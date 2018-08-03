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
	server.use('/api/permissions', (req, res) => res.jsonp(db.permissions))
	server.use('/api/account/wallet', (req, res) => res.jsonp(db.wallet))
	server.use('/api/account/skins', (req, res) => res.jsonp(db.skins))
	server.use('/api/account/dyes', (req, res) => res.jsonp(db.dyes))
	server.use('/api/account/titles', (req, res) => res.jsonp(db.titles))

	server.use(middlewares)
	server.listen(PORT, () => {
		console.log('JSON Server is running on localhost:' + PORT)
	})
}

module.exports = {
	start
}
