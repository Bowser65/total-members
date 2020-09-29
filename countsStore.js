/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
 */

const { Flux, FluxDispatcher } = require('powercord/webpack')

const counts = {}

class CountsStore extends Flux.Store {
  getStore() {
    return counts
  }

  getPresenceCount (guildId) {
    return counts[guildId]
  }
}

module.exports = {
  store: new CountsStore(FluxDispatcher, {
    'TOTAL_MEMBERS_UPDATE_COUNTS': ({ guildId, count }) => (counts[guildId] = count)
  }),
  updatePresencesCount: (guildId, count) =>
    FluxDispatcher.dirtyDispatch({
      type: 'TOTAL_MEMBERS_UPDATE_COUNTS',
      guildId,
      count
    })
}
