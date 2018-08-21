const express = require('express')
const wallet = require('./wallet')
const achievements = require('./achievements')
const skins = require('./unlocks/skins')
const dyes = require('./unlocks/dyes')
const minis = require('./unlocks/minis')
const titles = require('./unlocks/titles')
const finishers = require('./unlocks/finishers')

const router = express.Router()

router
  .use('/achievements', achievements)
  .use('/dyes', dyes)
  .use('/finishers', finishers)
  .use('/minis', minis)
  .use('/skins', skins)
  .use('/titles', titles)
  .use('/wallet', wallet)

module.exports = router
