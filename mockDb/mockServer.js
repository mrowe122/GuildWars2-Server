const jsonServer = require('json-server')
const db = require('./routes')
const server = jsonServer.create()
const middlewares = jsonServer.defaults()

const PORT = 9001

const start = () => {
  server.use('/api/characters/:id', (req, res) => {
    const character = req.params.id.replace(' ', '')
    res.jsonp(db[character])
  })
	server.use('/api/characters', (req, res) => res.jsonp(db.characters))

	server.use(middlewares)
	server.listen(PORT, () => {
		console.log('JSON Server is running on localhost:' + PORT)
	})
}

module.exports = {
	start
}