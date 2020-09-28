/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
 * Original work under MIT; See LICENSE.
 */

const { React } = require('powercord/webpack')
const { FormTitle } = require('powercord/components')
const { RadioGroup, SwitchItem } = require('powercord/components/settings')
const TotalMembersElement = require('./TotalMembers')

module.exports = React.memo(
	(props) => (
		<React.Fragment>
			<RadioGroup
				onChange={e => props.updateSetting('displayMode', e.value)}
				value={props.getSetting('displayMode', 0)}
				options={[
					{
						name: 'Original',
						desc: 'Similar to Discord\'s invite counts, although with way larger text and on two lines.',
						value: 0
					},
					{
						name: 'Invites-like',
						desc: 'On a single line, using the same design as Discord\'s on invites.',
						value: 1
					},
					{
						name: 'Member Group',
						desc: 'Bold text, on two lines, using a similar design to Discord\'s on invites.',
						value: 2
					}
				]}
			>
				Display mode
			</RadioGroup>
			<SwitchItem
				value={props.getSetting('sticky', true)}
				onChange={() => props.toggleSetting('sticky', true)}
				note='Wether the member counts indicator should stick to top or not.'
			>
				Sticky
			</SwitchItem>
			<FormTitle tag='h4'>Preview</FormTitle>
			<TotalMembersElement
				{...props}
				online={69}
				total={420}
			/>
		</React.Fragment>
	)
)
