/*
 * Copyright (c) 2020 Cynthia K. Rey, All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

const { React } = require('powercord/webpack');
const { FormTitle } = require('powercord/components');
const { RadioGroup, SwitchItem } = require('powercord/components/settings');
const Preview = require('./Preview');

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
            desc: 'On two lines, using the same design as member groups.',
            value: 2
          }
        ]}
      >
        Display mode
      </RadioGroup>
      <SwitchItem
        value={props.getSetting('sticky', true)}
        onChange={() => props.toggleSetting('sticky', true)}
        note='Whether the member counts indicator should stick to top or not.'
      >
        Sticky
      </SwitchItem>
      <FormTitle tag='h4'>Preview</FormTitle>
      <Preview {...props}/>
    </React.Fragment>
  )
);
