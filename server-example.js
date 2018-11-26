const express = require('express')
const expressWs = require('express-ws')
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

const wsOptions = { clientTracking: true }
const WS = expressWs(express(), null, { wsOptions })
const server = WS.getWss()
const app = WS.app

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.ws('/join', () => {})

app.get('/', (req, res, next) => next())

app.post('/:action', (req, res, next) => {
  serverEngine.actions[req.params.action](req.body)
  next()
})

app.get('/newPlayer/:name', (req, res, next) => {
  serverEngine.actions.addPlayer({name: req.params.name})
  next()
})

app.use((req, res) => {
  Array.from(server.clients)
    .forEach(client => client.send(JSON.stringify(serverEngine.store)))
  res.send(serverEngine.store)
})

const port = 4545
app.listen(port, () => console.log(`Draft example app listening on port ${port}!`))
