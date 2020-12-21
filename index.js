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

const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { forceUpdateElement } = require('powercord/util');
const { React, FluxDispatcher, getModule } = require('powercord/webpack');

const Settings = require('./components/Settings');
const TotalMembersComponent = require('./components/TotalMembers');
const { updatePresencesCount } = require('./countsStore');

const { ListThin } = getModule([ 'ListThin' ], false);
const { getLastSelectedGuildId } = getModule([ 'getLastSelectedGuildId' ], false);

module.exports = class TotalMembers extends Plugin {
  constructor () {
    super();

    this.handleMemberListUpdate = this.handleMemberListUpdate.bind(this);
  }

  async startPlugin () {
    this.loadStylesheet('style.css');

    powercord.api.settings.registerSettings(this.entityID, {
      category: this.entityID,
      label: 'Total Members',
      render: Settings
    });

    inject('total-members-members-list', ListThin, 'render', (args, res) => {
      if (!args[0] || !args[0].id || !args[0].id.startsWith('members')) {
        return res;
      }

      const id = getLastSelectedGuildId();
      res.props.children = [
        React.createElement(TotalMembersComponent, {
          entityID: this.entityID,
          guildId: !args[0].id.endsWith('uwu') && id
        }),
        res.props.children
      ];

      return res;
    });

    FluxDispatcher.subscribe('GUILD_MEMBER_LIST_UPDATE', this.handleMemberListUpdate);
    this.forceUpdateMembersList();
  }

  pluginWillUnload () {
    FluxDispatcher.unsubscribe('GUILD_MEMBER_LIST_UPDATE', this.handleMemberListUpdate);
    powercord.api.settings.unregisterSettings(this.entityID);
    uninject('total-members-members-list');
    this.forceUpdateMembersList();
  }

  forceUpdateMembersList () {
    forceUpdateElement(`.${getModule([ 'membersWrap' ], false).membersWrap}`);
  }

  handleMemberListUpdate (update) {
    if (update.id === 'everyone' || update.groups.find(g => g.id === 'online')) { // Figure out a better filter eventually
      const online = update.groups
        .map(group => group.id !== 'offline' ? group.count : 0)
        .reduce((a, b) => (a + b), 0);

      updatePresencesCount(update.guildId, online);
    }
  }
};
