const express = require('express')
const fetch = require('node-fetch')
const { map, flatMap, get } = require('lodash/fp')
const config = require('../../config')
const { getGuild } = require('../../lib')
const { parseData } = require('./util')
const db = require('../../database')
const router = express.Router()

const checkErrors = response => {
  if (!response.ok) {
    throw response.status
  }
  return response.json()
}

router
  .get('/', requestAllCharacters)
  .get('/:id', requestCharacter)

function requestAllCharacters (req, res) {
  fetch(`${config.gwHost}/characters`, { headers: { Authorization: `Bearer ${req.apiKey}` } })
    .then(checkErrors)
    .then(data => res.send({ body: data }))
    .catch(err => {
      console.error(err)
      return res.send(err)
    })
}

function requestCharacter (req, res) {
  fetch(`${config.gwHost}/characters${req.url}`, { headers: { Authorization: `Bearer ${req.apiKey}` } })
    .then(checkErrors)
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
        .then(merged => res.send({ body: merged }))
    })
    .catch(err => {
      console.error(err)
      res.send(err)
    })
}

module.exports = router
