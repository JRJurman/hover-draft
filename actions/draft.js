const { shuffle, rotate, distribute } = require('../card-utils')

const update = (original, updates) => Object.assign({}, original, updates)
const newPlayer = (player) => Object.assign({}, player, {
  status: 'waiting',
  cards: [],
  pack: []
})

module.exports = (seed) => ({
  init: () => ({
    // should be object with ids
    players: [],
    cards: [],
    seed: seed,
    direction: 1
  }),
  setSeed: (draft, seed) => update(draft, {seed}),
  setCards: (draft, cards) => update(draft, {cards}),
  addPlayer: (draft, player) => update(draft, {
    players: draft.players.concat(newPlayer(player))
  }),
  startDraft: (draft) => {
    const shuffledCards = shuffle(draft.cards, draft.seed)
    const nextPacks = distribute(shuffledCards, draft.players.length)
    const newPlayers = draft.players.map((player, playerIndex) =>
      update(player, {
        status: 'picking',
        pack: nextPacks[playerIndex]
      })
    )
    return update(draft, {players: newPlayers})
  },
  pickCard: (draft, {playerIndex, packIndex}, actions) => {
    const player = draft.players[playerIndex]
    const updatedPlayer = update(player, {
      status: 'waiting',
      cards: player.cards.concat(player.pack[packIndex]),
      pack: player.pack.filter((card, cardIndex) => cardIndex !== packIndex)
    })

    const updatedPlayers = draft.players.map(
      (player, index) => index == playerIndex ? updatedPlayer : player
    )

    const newDraft = update(draft, {
      players: updatedPlayers
    })

    // determine if everyone is waiting for the draft to advance
    const allWaiting = newDraft.players.every(player => player.status === 'waiting')
    if (allWaiting) actions.advanceDraft()
    return newDraft
  },
  advanceDraft: (draft) => {
    const nextPacks = rotate(draft.players.map(player => player.pack), draft.direction)
    const newPlayers = draft.players.map((player, playerIndex) =>
      update(player, {
        status: 'picking',
        pack: nextPacks[playerIndex]
      })
    )
    return update(draft, {players: newPlayers})
  }
})
