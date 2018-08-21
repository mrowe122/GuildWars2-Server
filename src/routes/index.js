const express = require('express')
const character = require('./characters')
const tokeninfo = require('./tokeninfo')
const permissions = require('./permissions')
const account = require('./account')
const settings = require('./account/settings')
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
  .use('/settings', settings)
  .use(getApiKey)
  .use('/characters', character)
  .use('/permissions', permissions)
  .use('/account', account)

module.exports = router
