const jsonServer = require('json-server')
const db = require('./routes')
const server = jsonServer.create()
const middlewares = jsonServer.defaults()

const start = () => {
	server.use('/api/characters', (req, res) => res.jsonp(db.characters))

	server.use(middlewares)
	server.listen(9002, () => {
		console.log('JSON Server is running on localhost:9002')
	})
}

start()

module.exports = {
	start
}