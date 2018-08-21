const express = require('express')
const fetch = require('node-fetch')
const { map, flatMap, get } = require('lodash/fp')
const config = require('../../config')
const { getGuild, checkErrors } = require('../../lib')
const { parseData } = require('./util')
const db = require('../../database')

const router = express.Router()

router
  .get('/', requestAllCharacters)
  .get('/:id', requestCharacter)

function requestAllCharacters (req, res) {
  fetch(`${config.gwHost}/characters`, { headers: { Authorization: `Bearer ${req.apiKey}` } })
    .then(checkErrors('characters'))
    .then(data => res.send(data))
    .catch(status => res.sendStatus(status))
}

function requestCharacter (req, res) {
  fetch(`${config.gwHost}/characters${req.url}`, { headers: { Authorization: `Bearer ${req.apiKey}` } })
    .then(checkErrors('character'))
    .then(data => {
      const itemsId = flatMap(
        ({ id, infusions = [] , upgrades = [] }) => [id, ...infusions, ...upgrades]
      )(data.equipment)
      const bagsId = flatMap(
        ({ id, inventory }) => [id, ...inventory.map(i => i && i.id)]
      )(data.bags)
      const skinIds = map(get('skin'))(data.equipment)
      const specializationIds = flatMap(map(get('id')))(data.specializations)
      return Promise.all([
        db.items([].concat(itemsId, bagsId)), db.skins(skinIds), getGuild(data.guild), db.specializations(specializationIds)
      ]).then(parseData(data))
        .then(merged => res.send(merged))
    })
    .catch(status => res.sendStatus(status))
}

module.exports = router
