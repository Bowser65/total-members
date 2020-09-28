/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
 * Original work under MIT; See LICENSE.
 */

const { Plugin } = require('powercord/entities')
const { inject, uninject } = require('powercord/injector')
const { forceUpdateElement } = require('powercord/util')
const { React, FluxDispatcher, getModule } = require('powercord/webpack')

const { ListThin } = getModule([ "ListThin" ], false);
const { requestMembers } = getModule([ "requestMembers" ], false);
const { getLastSelectedGuildId } = getModule([ "getLastSelectedGuildId" ], false);
const { getMemberCount } = getModule([ "getMemberCount" ], false);

const Settings = require("./components/Settings");
const TotalMembersComponent = require("./components/TotalMembers");

let cache = {};

module.exports = class TotalMembers extends Plugin {
	constructor () {
		super()

		// this.settings.get at inject time would be enough, but this ensures it'll get re-rendered in all cases
		this.ConnectedTotalMembers = this.settings.connectStore(TotalMembersComponent)
	}

	async startPlugin() {
		this.loadStylesheet('style.css')

		powercord.api.settings.registerSettings(this.entityID, {
			category: this.entityID,
			label: 'Total Members',
			render: Settings,
		})

		inject('total-members-members-list', ListThin, 'render', (args, res) => {
			if (!args[0] || !args[0].id || !args[0].id.startsWith('members'))
				return res

			const id = getLastSelectedGuildId()
			res.props.children = [
				React.createElement(this.ConnectedTotalMembers, {
					online: cache[id],
					total: getMemberCount(id),
					fetchOnline: () => this.getMemberCounts(id),
				}),
				res.props.children,
			]

			return res
		})

		this.forceUpdateMembersList()
	}

	pluginWillUnload() {
		powercord.api.settings.unregisterSettings(this.entityID)
		uninject('total-members-members-list')
		this.forceUpdateMembersList()
	}

	forceUpdateMembersList() {
		forceUpdateElement(`.${getModule([ 'membersWrap' ], false).membersWrap}`)
	}

	getMemberCounts(id) {
		return new Promise(resolve => {
			function onMembers(guild) {
				if (guild.guildId == id) {
					const online = guild.groups
						.map((group) => group.id != "offline" ? group.count : 0)
						.reduce((a, b) => (a + b), 0)

					FluxDispatcher.unsubscribe('GUILD_MEMBER_LIST_UPDATE', onMembers)
					cache[id] = online
					resolve(online)
				}
			}

			FluxDispatcher.subscribe('GUILD_MEMBER_LIST_UPDATE', onMembers)
			requestMembers(id)
		});
	}
};
