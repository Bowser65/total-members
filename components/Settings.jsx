/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
 * Original work under MIT; See LICENSE.
 */

const { React, getModule } = require('powercord/webpack')
const { SwitchItem } = require("powercord/components/settings");
const TotalMembersElement = require("./TotalMembersElement");
const { getLastSelectedGuildId } = getModule([ "getLastSelectedGuildId" ], false);
const { getMemberCount } = getModule([ "getMemberCount" ], false);

class Settings extends React.Component {
	render() {
		const id = getLastSelectedGuildId();
		const total = getMemberCount(id);

		return (
			<React.Fragment>
				<SwitchItem
					value={this.props.getSetting("useMembersGroupStyle")}
					onChange={() => this.props.toggleSetting("useMembersGroupStyle")}
				>
					Use Member Group Style
				</SwitchItem>
				<TotalMembersElement
					total={total}
					counts={this.props.getMemberCounts(id)}
					cached={this.props.cache[id]}
					useMembersGroupStyle={this.props.getSetting('useMembersGroupStyle')}
				/>
			</React.Fragment>
		);
	}
}

module.exports = Settings;
