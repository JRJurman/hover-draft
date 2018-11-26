/* Functions for dealing with an array of cards */
// this should eventually be broken into it's own library

const cutOver = (cards, percent) => {
  return cards.slice(cards.length*percent).concat(cards.slice(0, cards.length*percent))
}

const zipper = cards => {
  const left = cards.slice(0, cards.length/2)
  const right = cards.slice(cards.length/2)
  return left
    .map((card, index) => [card].concat(right[index]))
    .reduce((cards, cardPair) => cards.concat(cardPair))
}

const shuffle = (cards, seed) => {
  let shuffledCards = cards.slice()
  const seedIter = [...Array(seed).keys()]
  seedIter.forEach((_, index) => {
    shuffledCards = zipper(shuffledCards)
    shuffledCards = cutOver(shuffledCards, (index*.2)%1)
  })
  return shuffledCards
}

/* direction should either be 1 or -1 */
const rotate = (cards, direction) => {
  return cards.slice(-direction).concat(cards.slice(0, -direction))
}

const distribute = (cards, number) => {
  return [...Array(number).keys()].map(
    (_, index) => cards.slice((cards.length/number)*(index), (cards.length/number)*(index+1))
  )
}

module.exports = {
  cutOver, zipper, shuffle, rotate, distribute
}
