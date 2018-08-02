'use strict';

var jsonServer = require('json-server');
var db = require('./routes');
var server = jsonServer.create();
var middlewares = jsonServer.defaults();

var PORT = 9001;

var start = function start() {
	server.use('/api/characters/:id', function (req, res) {
		var character = req.params.id.replace(' ', '');
		res.jsonp(db[character]);
	});
	server.use('/api/characters', function (req, res) {
		return res.jsonp(db.characters);
	});
	server.use('/api/permissions', function (req, res) {
		return res.jsonp(db.permissions);
	});
	server.use('/api/account/wallet', function (req, res) {
		return res.jsonp(db.wallet);
	});
	server.use('/api/account/skins', function (req, res) {
		return res.jsonp(db.skins);
	});

	server.use(middlewares);
	server.listen(PORT, function () {
		console.log('JSON Server is running on localhost:' + PORT);
	});
};

module.exports = {
	start: start
};