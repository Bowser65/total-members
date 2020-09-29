/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
 * Original work under MIT; See LICENSE.
 */

const { Plugin } = require('powercord/entities')
const { inject, uninject } = require('powercord/injector')
const { forceUpdateElement } = require('powercord/util')
const { React, FluxDispatcher, getModule } = require('powercord/webpack')

const Settings = require('./components/Settings');
const TotalMembersComponent = require('./components/TotalMembers');
const { updatePresencesCount } = require('./countsStore');

const { ListThin } = getModule([ 'ListThin' ], false)
const { getLastSelectedGuildId } = getModule([ 'getLastSelectedGuildId' ], false)

module.exports = class TotalMembers extends Plugin {
	constructor () {
		super()

		this.handleMemberListUpdate = this.handleMemberListUpdate.bind(this)
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
				React.createElement(TotalMembersComponent, { entityID: this.entityID, guildId: id }),
				res.props.children,
			]

			return res
		})

		FluxDispatcher.subscribe('GUILD_MEMBER_LIST_UPDATE', this.handleMemberListUpdate)
		this.forceUpdateMembersList()
	}

	pluginWillUnload() {
		FluxDispatcher.unsubscribe('GUILD_MEMBER_LIST_UPDATE', this.handleMemberListUpdate)
		powercord.api.settings.unregisterSettings(this.entityID)
		uninject('total-members-members-list')
		this.forceUpdateMembersList()
	}

	forceUpdateMembersList() {
		forceUpdateElement(`.${getModule([ 'membersWrap' ], false).membersWrap}`)
	}

	handleMemberListUpdate (update) {
		if (update.id === 'everyone' || update.groups.find(g => g.id === 'online')) { // Figure out a better filter eventually
			const online = update.groups
				.map(group => group.id !== 'offline' ? group.count : 0)
				.reduce((a, b) => (a + b), 0)

			updatePresencesCount(update.guildId, online)
		}
	}
}
