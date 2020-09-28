/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
 * Original work under MIT; See LICENSE.
 */

const { React, getModule, getModuleByDisplayName, constants: { ROLE_COLORS } } = require('powercord/webpack')
const { Icon, AsyncComponent, AdvancedScrollerAuto, AdvancedScrollerThin } = require('powercord/components')
const TotalMembers = require('./TotalMembers')

const HeaderBarContainer = AsyncComponent.from(getModuleByDisplayName('HeaderBarContainer'))
const ChannelText = AsyncComponent.from(getModuleByDisplayName('ChannelText'))
const MemberListItem = AsyncComponent.from(getModuleByDisplayName('MemberListItem'))
const ChannelMessage = AsyncComponent.from(getModule(m => m.type && m.type.displayName === 'ChannelMessage'))

const games = [
  'Minecraft',
  'Among Us',
  'Roblox',
  'Half Life 3'
]

module.exports = React.memo(
	(props) => {
    // Classes
    const Message = getModule(m => m.prototype && m.prototype.getReaction && m.prototype.isSystemDM, false)
    const { membersWrap, hiddenMembers, members } = getModule([ 'members' ], false)
    const { membersGroup } = getModule([ 'membersGroup' ], false)
    const { content } = getModule([ 'content', 'scrollerBase' ], false)
    const { icon, iconWrapper } = getModule([ 'iconWrapper', 'transparent' ], false)
    const { title, content: chatContent } = getModule([ 'title', 'content', 'chat' ], false)
    const { message, cozyMessage, groupStart } = getModule([ 'cozyMessage' ], false)
    const { size16 } = getModule([ 'size16' ], false)
    const { base } = getModule([ 'base' ], false)

    const { getCurrentUser } = getModule([ 'getCurrentUser' ], false)

    // State utils
    const emptyArray = Array(69).fill()
    const randomStatus = () => {
      const rand = Math.random()
      const rand2 = Math.random()

      return {
        isMobile: rand > .7,
        status: rand <= .05
          ? 'streaming'
          : rand <= .5
            ? 'online'
            : rand <= .7
              ? 'idle'
              : 'dnd',
        activities: rand <= .05
          ? [ { type: 1, name: 'Twitch', details: 'something', url: 'https://twitch.tv/twitch' } ]
          : rand2 <= .4
            ? [ { type: 0, name: games[Math.floor(Math.random() * games.length)] } ]
            : rand2 >= .7
              ? [ { type: 2, name: 'Spotify', details: 'yes' } ]
              : []
      }
    }

    // State
    const colorStaff = React.useMemo(() => `#${ROLE_COLORS[Math.round(Math.random() * 10)].toString(16)}`, [])
    const colorMod = React.useMemo(() => `#${ROLE_COLORS[Math.round(Math.random() * 10)].toString(16)}`, [])
    const modCount = React.useMemo(() => Math.round(Math.random() * 4) + 3, [])
    const statuses = React.useMemo(() => emptyArray.map(randomStatus), [])
    const currentUser = getCurrentUser()

    const conversation = React.useMemo(() => [
      [ null, 'Oh hey I know that guy, the staff member' ],
      [ colorMod, `Wait, you know ${currentUser.username}?` ],
      [ null, 'Indeed!' ],
      [ colorMod, 'But how?!' ],
      [ colorStaff, 'Of course they know me, they\'re me' ],
      [ colorMod, 'Oh, that explains' ]
    ], [ colorStaff, colorMod, currentUser ])

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
                  groupId={i}
                  className={`${message} ${cozyMessage} ${groupStart}`}
                  message={new Message({
                    author: currentUser,
                    colorString: msg[0],
                    content: msg[1]
                  })}
                  channel={{}}
                />
              ))}
            </div>
          </AdvancedScrollerAuto>
          <div className={`${membersWrap} ${hiddenMembers}`}>
            <AdvancedScrollerThin className={members}>
              <TotalMembers {...props} online={69} total={420}/>
              <div className={content}>
                <h2 className={`${membersGroup} container-2ax-kl`}>
                  <span>Staff—1</span>
                </h2>
                <MemberListItem
                  channel={{}}
                  colorString={colorStaff}
                  user={currentUser}
                  {...statuses[0]}
                />

                <h2 className={`${membersGroup} container-2ax-kl`}>
                  <span>Moderator—{modCount}</span>
                </h2>
                {Array(modCount).fill().map((_, i) => (
                  <MemberListItem
                    channel={{}}
                    colorString={colorMod}
                    user={currentUser}
                    {...statuses[i + 1]}
                  />
                ))}

                <h2 className={`${membersGroup} container-2ax-kl`}>
                  <span>Online—{68 - modCount}</span>
                </h2>
                {Array(68 - modCount).fill().map((_, i) => (
                  <MemberListItem
                    channel={{}}
                    user={currentUser}
                    {...statuses[i + modCount + 1]}
                  />
                ))}
              </div>
            </AdvancedScrollerThin>
          </div>
        </div>
      </div>
    )
  }
)
