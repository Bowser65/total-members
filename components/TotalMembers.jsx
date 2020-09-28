/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
 * Original work under MIT; See LICENSE.
 */

const { React, getModule, i18n: { Messages } } = require('powercord/webpack')

const classes = {
	...getModule([ "membersGroup" ], false),
	...getModule([ "statusOnline" ], false)
};

class TotalMembers extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = { online: props.online }
	}

	componentDidMount () {
		if (this.props.getSetting('displayMode') > 2) {
			this.props.updateSetting('displayMode', 0)
		}

		if (!this.state.online) {
			this.props.fetchOnline().then(c => this.setState({ online: c }))
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
						{typeof this.state.online === 'number'
							? Messages.INSTANT_INVITE_GUILD_MEMBERS_ONLINE.format({ membersOnline: this.state.online })
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
					Members—{this.props.total.toLocaleString()}
				</h2>
				<h2 className={`group ${classes.membersGroup} container-2ax-kl`}>
					Online—
					{this.state.online
						? this.state.online.toLocaleString()
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

	membersGroupStyle = () => {
		return (
			<div className={`total-members-group-box`}>
				<h2 className={`total-members-count ${classes.membersGroup} container-2ax-kl`}>
					Total Members—{this.state.total.toLocaleString(undefined)}
				</h2>
				<h2 className={`total-members-count ${classes.membersGroup} container-2ax-kl`}>
					Online Members—
					{this.state.online
						? this.state.online.toLocaleString(undefined)
						: "Loading..."}
				</h2>
			</div>
		);
	};

	countBoxStyle = () => {
		return (
			<div className={`total-members-count-box`}>
				<div className={`total-members-count ${classes.statusCounts}`}>
					<i
						className={`${classes.status} ${classes.statusOffline}`}
					></i>
					<span className={`${classes.count}`}>
						{this.state.total.toLocaleString(undefined)} Members
					</span>
				</div>
				<div className={`total-members-count ${classes.statusCounts}`}>
					<i
						className={`${classes.status} ${classes.statusOnline}`}
					></i>
					<span className={`${classes.count}`}>
						{this.state.online
							? `${this.state.online.toLocaleString(
									undefined
							  )} Online`
							: "Loading..."}
					</span>
				</div>
			</div>
		);
	};
}

module.exports = TotalMembers;
