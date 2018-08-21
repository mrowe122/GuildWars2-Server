const express = require('express')
const fetch = require('node-fetch')
const { flatMap, keyBy, map, assign } = require('lodash/fp')
const { checkErrors } = require('../../../../lib')
const config = require('../../../../config')
const db = require('../../../../database')

const router = express.Router()

const mergeIds = (data, ids) => new Promise(resolve => {
  const _titles = keyBy('id')(ids)
  const merged = map(c => assign(c, { achievements: map(a => _titles[a])(c.achievements) }))(data)
  resolve(merged)
})

router
  .get('/', request)

function request (req, res) {
  fetch(`${config.gwHost}/account/titles`, { headers: { Authorization: `Bearer ${req.apiKey}` } })
    .then(checkErrors('titles'))
    .then(response => {
      db.titles(response)
        .then(data => db.achievements(flatMap(i => i.achievements)(data)).then(ach => mergeIds(data, ach)))
        .then(data => res.send(data))
    })
    .catch(status => res.sendStatus(status))
}

module.exports = router
