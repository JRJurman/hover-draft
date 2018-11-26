const express = require('express')
const bodyParser = require('body-parser')
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

const app = express()
app.use(bodyParser.json())

app.get('/', (req, res, next) => next())

app.post('/:action', (req, res, next) => {
  serverEngine.actions[req.params.action](req.body)
  next()
})

app.get('/newPlayer/:name', (req, res, next) => {
  serverEngine.actions.addPlayer({name: req.params.name})
  next()
})

app.get('/start', (req, res, next) => {
  serverEngine.actions.startDraft()
  next()
})

app.all('/*', (req, res) => {
  res.send(serverEngine.store)
})

const port = 3000
app.listen(port, () => console.log(`Draft example app listening on port ${port}!`))
