const express = require('express')
const character = require('./characters')
const tokeninfo = require('./tokeninfo')
const permissions = require('./permissions')
const wallet = require('./wallet')
const skins = require('./skins')
const dyes = require('./dyes')
const titles = require('./titles')
const { checkToken, getApiKey } = require('../lib')

const router = express.Router()

const enableCors = function(req, res, next) {
  res.set('Cache-Control', 'no-store, must-revalidate, no-cache')
  res.set('Pragma', 'no-cache')
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, POST')
  next()
}

router
  .use(enableCors)
  .use(checkToken)
  .use('/tokeninfo', tokeninfo)
  .use(getApiKey)
  .use('/characters', character)
  .use('/permissions', permissions)
  .use('/account/wallet', wallet)
  .use('/account/skins', skins)
  .use('/account/dyes', dyes)
  .use('/account/titles', titles)

module.exports = router
