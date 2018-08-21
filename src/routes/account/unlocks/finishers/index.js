const express = require('express')
const fetch = require('node-fetch')
const { get, keyBy, map, assign } = require('lodash/fp')
const { checkErrors } = require('../../../../lib')
const config = require('../../../../config')
const db = require('../../../../database')

const router = express.Router()

const mergeIds = (data, ids) => new Promise(resolve => {
  const _finishers = keyBy('id')(ids)
  const merged = map(c => assign(c, { data: _finishers[c.id] }))(data)
  resolve(merged)
})

router
  .get('/', request)

function request (req, res) {
  fetch(`${config.gwHost}/account/finishers`, { headers: { Authorization: `Bearer ${req.apiKey}` } })
    .then(checkErrors('finishers'))
    .then(finishers => {
      db.finishers(finishers.map(get('id'))).then(metadata => mergeIds(finishers, metadata))
        .then(data => res.send(data))
    })
    .catch(status => res.sendStatus(status))
}

module.exports = router
