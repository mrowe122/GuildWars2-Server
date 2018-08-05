const express = require('express')
const fetch = require('node-fetch')
const config = require('../../config')
const { mergeIds } = require('./util')
const db = require('../../database')

const router = express.Router()

const checkErrors = response => {
  if (!response.ok) {
    throw response.status
  }
  return response.json()
}

router
  .get('/', request)

function request (req, res) {
  fetch(`${config.gwHost}/account/wallet`, { headers: { Authorization: `Bearer ${req.apiKey}` } })
    .then(checkErrors)
    .then(response => {
      const ids = response.map(c => c.id)
      db.currencies(ids)
        .then(data => mergeIds(response, data))
        .then(merged => res.send({ body: merged }))
    })
    .catch(err => console.error(err))
}

module.exports = router
