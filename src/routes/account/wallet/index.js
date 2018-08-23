const express = require('express')
const fetch = require('node-fetch')
const { keyBy, map, assign } = require('lodash/fp')
const { checkErrors } = require('../../../lib')
const config = require('../../../config')
const db = require('../../../database')

const router = express.Router()

const mergeIds = (data, ids) => new Promise(resolve => {
  const _currencyIds = keyBy('id')(ids)
  const merged = map(c => assign(c, { data: _currencyIds[c.id] }))(data)
  resolve(merged)
})

router
  .get('/', request)

function request (req, res) {
  fetch(`${config.gwHost}/account/wallet`, { headers: { Authorization: `Bearer ${req.apiKey}` } })
    .then(checkErrors('wallet'))
    .then(response => {
      const ids = response.map(c => c.id)
      db.currencies(ids)
        .then(data => mergeIds(response, data))
        .then(data => res.send(data))
    })
    .catch(err => res.status(err.status).send(err.statusText))
}

module.exports = router
