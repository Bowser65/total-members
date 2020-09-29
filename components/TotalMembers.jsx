/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
 * Original work under MIT; See LICENSE.
 */

const { React, Flux, getModule, i18n: { Messages } } = require('powercord/webpack')
const { store: countsStore } = require('../countsStore')

const { requestMembers } = getModule([ 'requestMembers' ], false)
const classes = {
	...getModule([ 'membersGroup' ], false),
	...getModule([ 'statusOnline' ], false)
}

class TotalMembers extends React.PureComponent {
	componentDidMount () {
		if (this.props.getSetting('displayMode') > 2) {
			this.props.updateSetting('displayMode', 0)
		}

		if (!this.props.online) {
			setTimeout(() => {
				if (!this.props.online) {
					console.log('requesting', this.props.guildId)
					requestMembers(this.props.guildId)
				}
			}, 1.5e3)
		}
	}

	renderAsCounts (sticky, small) {
		const cls = [
			'total-members',
			'counts',
			small && 'small',
			sticky && 'sticky'
		]

		return (
			<div className={cls.filter(Boolean).join(' ')}>
				<div className={`count ${classes.statusCounts}`}>
					<i className={classes.statusOffline}/>
					<span className={classes.count}>
						{Messages.INSTANT_INVITE_GUILD_MEMBERS_TOTAL.format({ count: this.props.total })}
					</span>
				</div>
				<div className={`count ${classes.statusCounts}`}>
					<i className={classes.statusOnline}/>
					<span className={classes.count}>
						{typeof this.props.online === 'number'
							? Messages.INSTANT_INVITE_GUILD_MEMBERS_ONLINE.format({ membersOnline: this.props.online })
							: Messages.DEFAULT_INPUT_PLACEHOLDER}
					</span>
				</div>
			</div>
		)
	}

	renderAsGroup (sticky) {
		const cls = [
			'total-members',
			'groups',
			sticky && 'sticky'
		]

		return (
			<div className={cls.filter(Boolean).join(' ')}>
				<h2 className={`group ${classes.membersGroup} container-2ax-kl`}>
					{Messages.MEMBERS}—{this.props.total.toLocaleString()}
				</h2>
				<h2 className={`group ${classes.membersGroup} container-2ax-kl`}>
					{Messages.STATUS_ONLINE}—
					{typeof this.props.online === 'number'
						? this.props.online.toLocaleString()
						: Messages.DEFAULT_INPUT_PLACEHOLDER}
				</h2>
			</div>
		)
	}

	render () {
		const sticky = this.props.getSetting('sticky', true)
		switch (this.props.getSetting('displayMode', 0)) {
			case 0:
				return this.renderAsCounts(sticky)
			case 1:
				return this.renderAsCounts(sticky, true)
			case 2:
				return this.renderAsGroup(sticky)
		}

		return null
	}
}

const memberStore = getModule([ 'getMemberCount' ], false)
module.exports = Flux.connectStores(
  [ countsStore, memberStore, powercord.api.settings.store ],
  (props) => ({
		online: props.guildId ? countsStore.getPresenceCount(props.guildId) : 69,
		total: props.guildId ? memberStore.getMemberCount(props.guildId) : 420,
    ...(props.entityID ? powercord.api.settings._fluxProps(props.entityID) : {})
	})
)(TotalMembers)
