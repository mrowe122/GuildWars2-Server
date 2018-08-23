const express = require('express')
const fetch = require('node-fetch')
const { keyBy, map, assign } = require('lodash/fp')
const { checkErrors } = require('../../../../lib')
const config = require('../../../../config')
const db = require('../../../../database')

const router = express.Router()

const mergeIds = (data, ids) => new Promise(resolve => {
  const _itemIds = keyBy('id')(ids)
  const merged = map(c => assign(c, { data: _itemIds[c.item] }))(data)
  resolve(merged)
})

router
  .get('/', request)

function request (req, res) {
  fetch(`${config.gwHost}/account/dyes`, { headers: { Authorization: `Bearer ${req.apiKey}` } })
    .then(checkErrors('dyes'))
    .then(response => {
      db.dyes(response)
        .then(data => db.items(data.map(d => d.item)).then(itemData => mergeIds(data, itemData)))
        .then(data => res.send(data))
    })
    .catch(err => res.status(err.status).send(err.statusText))
}

module.exports = router
