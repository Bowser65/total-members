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

const { React, getModule, getModuleByDisplayName, constants: { ROLE_COLORS } } = require('powercord/webpack');
const { AsyncComponent, AdvancedScrollerAuto } = require('powercord/components');

const HeaderBarContainer = AsyncComponent.from(getModuleByDisplayName('HeaderBarContainer'));
const ChannelText = AsyncComponent.from(getModuleByDisplayName('ChannelText'));
const MemberListItem = AsyncComponent.from(getModuleByDisplayName('MemberListItem'));
const Scroller = getModule([ 'ListAuto', 'ListRowHeight' ], false).default;
const ChannelMessage = getModule([ 'MESSAGE_ID_PREFIX' ], false).default;

const games = [
  'Minecraft',
  'Among Us',
  'Roblox',
  'Half Life 3'
];

const twitch = {
  type: 1,
  name: 'Twitch',
  details: 'something',
  url: 'https://twitch.tv/twitch'
};

const spotify = {
  type: 2,
  name: 'Spotify',
  details: 'yes'
};

const channel = {
  isPrivate: () => false,
  isSystemDM: () => false,
  getGuildId: () => 'uwu'
};

const roles = [ 'Staff', 'Moderator', 'Online' ];

const { membersGroup } = getModule([ 'membersGroup' ], false);
function renderItem (currentUser, counts, colors, statuses, { type, section, rowIndex }) {
  if (type === 'section') {
    return (
      <h2 className={`${membersGroup} container-2ax-kl`} key={`section-${section}`}>
        <span>{roles[section]}—{counts[section]}</span>
      </h2>
    );
  }

  return (
    <MemberListItem
      key={`member-${rowIndex}`}
      channel={channel}
      colorString={colors[section]}
      user={currentUser}
      {...statuses[rowIndex]}
    />
  );
}


// Classes
const { membersWrap, hiddenMembers, members } = getModule([ 'members', 'membersWrap' ], false);
const { icon, iconWrapper } = getModule([ 'iconWrapper', 'transparent' ], false);
const { title, content: chatContent } = getModule([ 'title', 'content', 'chat' ], false);
const { size16 } = getModule([ 'size16' ], false);
const { base } = getModule([ 'base' ], false);

const Message = getModule(m => m.prototype && m.prototype.getReaction && m.prototype.isSystemDM, false);
const { getCurrentUser } = getModule([ 'getCurrentUser' ], false);

module.exports = React.memo(
  () => {
    // State utils
    const emptyArray = Array(69).fill();
    const randomStatus = () => {
      const rand = Math.random();
      const rand2 = Math.random();

      return {
        isMobile: rand > 0.7,
        status: rand <= 0.05
          ? 'streaming'
          : rand <= 0.5
            ? 'online'
            : rand <= 0.7
              ? 'idle'
              : 'dnd',
        activities: rand <= 0.05
          ? [ twitch ]
          : rand2 <= 0.4
            ? [ { type: 0,
              name: games[Math.floor(Math.random() * games.length)] } ]
            : rand2 >= 0.7
              ? [ spotify ]
              : []
      };
    };

    // State
    const currentUser = getCurrentUser();
    const colorStaff = React.useMemo(() => `#${ROLE_COLORS[Math.round(Math.random() * 10)].toString(16)}`, []);
    const colorMod = React.useMemo(() => `#${ROLE_COLORS[Math.round(Math.random() * 10)].toString(16)}`, []);
    const statuses = React.useMemo(() => emptyArray.map(randomStatus), []);
    const counts = React.useMemo(() => {
      const rand = Math.round(Math.random() * 4) + 3;
      return [ 1, rand, 68 - rand ];
    }, []);
    const boundRenderItem = React.useMemo(
      () => renderItem.bind(null, currentUser, counts, [ colorStaff, colorMod ], statuses),
      [ counts, colorStaff, colorMod, statuses ]
    );

    const conversation = React.useMemo(() => [
      [ null, 'Oh hey I know that guy, the staff member' ],
      [ colorMod, `Wait, you know ${currentUser.username}?` ],
      [ null, 'Indeed!' ],
      [ colorMod, 'But how?!' ],
      [ colorStaff, 'Of course they know me, they\'re me' ],
      [ colorMod, 'Oh, that explains' ]
    ], [ colorStaff, colorMod, currentUser ]);

    // Render
    return (
      <div className='total-members-preview'>
        <HeaderBarContainer>
          <div className={iconWrapper}>
            <ChannelText className={icon}/>
          </div>
          <h3 className={`${title} ${base} ${size16}`}>test-channel</h3>
        </HeaderBarContainer>
        <div className={chatContent}>
          <AdvancedScrollerAuto>
            <div className='group-spacing-16'>
              {conversation.map((msg, i) => (
                <ChannelMessage
                  channel={channel}
                  message={new Message({
                    id: i,
                    author: currentUser,
                    colorString: msg[0],
                    content: msg[1]
                  })}
                  id={`uwu-${i.toString()}`}
                  groupId={i}
                />
              ))}
            </div>
          </AdvancedScrollerAuto>
          <div className={`${membersWrap} ${hiddenMembers}`}>
            <Scroller
              fade
              className={members}
              id='members-uwu'
              rowHeight={44}
              sectionHeight={() => 40}
              sections={counts}
              renderSection={boundRenderItem}
              renderRow={boundRenderItem}
            />
          </div>
        </div>
      </div>
    );
  }
);
