const Hover = require('hover-engine')

// setup server to control entire draft
const seed = Math.floor(Math.random()*1000)
const serverEngine = new Hover()
serverEngine.addActions({
  draft: require('./actions/draft')(seed)
})

serverEngine.actions.setCards(
  [...new Array( 26 ).keys()].map( ( _, i ) => String.fromCharCode( 65 + i ) )
)

serverEngine.actions.addPlayer({name: 'Jesse'})
serverEngine.actions.addPlayer({name: 'Ethan'})
serverEngine.actions.addPlayer({name: 'Will'})

serverEngine.actions.startDraft()
serverEngine.actions.pickCard({playerIndex: 0, packIndex: 0})

console.log(serverEngine.store)
