/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
 * Original work under MIT; See LICENSE.
 */

const { Plugin } = require("powercord/entities");
const { inject, uninject } = require("powercord/injector");
const { forceUpdateElement } = require("powercord/util");
const { React, FluxDispatcher, getModule } = require('powercord/webpack')

const { ListThin } = getModule([ "ListThin" ], false);
const { requestMembers } = getModule([ "requestMembers" ], false);
const { getLastSelectedGuildId } = getModule([ "getLastSelectedGuildId" ], false);
const { getMemberCount } = getModule([ "getMemberCount" ], false);

const Settings = require("./components/Settings");
const TotalMembersElement = require("./components/TotalMembersElement");

let cache = {};

module.exports = class TotalMembers extends Plugin {
	constructor () {
		super()
		// this.settings.get at inject time would be enough, but this ensures it'll get re-rendered in all cases
		this.ConnectedTotalMembersElement = this.settings.connectStore(
			(props) => React.createElement(TotalMembersElement, { ...props, useMembersGroupStyle: props.getSetting('useMembersGroupStyle') })
		)
	}

	async startPlugin() {
		this.loadStylesheet("style.scss");

		powercord.api.settings.registerSettings(this.entityID, {
			category: this.entityID,
			label: "Total Members",
			render: (props) =>
				React.createElement(Settings, {
					...props,
					cache,
					getMemberCounts: this.getMemberCounts.bind(this),
				}),
		});

		inject(
			"total-members-members-list",
			ListThin,
			"render",
			(args, reactElement) => {
				if (
					!args[0] ||
					!args[0].id ||
					!args[0].id.startsWith("members")
				)
					return reactElement;

				const id = getLastSelectedGuildId();
				const total = getMemberCount(id);
				reactElement.props.children = [
					React.createElement(this.ConnectedTotalMembersElement, {
						total,
						counts: this.getMemberCounts(id),
						cached: cache[id],
					}),
					reactElement.props.children,
				];

				return reactElement;
			}
		);

		this.forceUpdateMembersList();
	}

	pluginWillUnload() {
		powercord.api.settings.unregisterSettings(this.entityID);
		uninject("total-members-members-list");
		this.forceUpdateMembersList();
	}

	forceUpdateMembersList() {
		forceUpdateElement(`.${getModule([ 'membersWrap' ], false).membersWrap}`);
	}

	getMemberCounts(id) {
		return new Promise((resolve, reject) => {
			function onMembers(guild) {
				if (guild.guildId == id) {
					let total = guild.memberCount;
					let online = guild.groups
						.map((group) => {
							return group.id != "offline" ? group.count : 0;
						})
						.reduce((a, b) => {
							return a + b;
						}, 0);

					cache[id] = { total, online };

					FluxDispatcher.unsubscribe(
						"GUILD_MEMBER_LIST_UPDATE",
						onMembers
					);
					resolve({
						total,
						online,
					});
				}
			}
			FluxDispatcher.subscribe("GUILD_MEMBER_LIST_UPDATE", onMembers);
			requestMembers(id);
		});
	}
};
