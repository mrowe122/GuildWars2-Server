const express = require('express')
const fetch = require('node-fetch')
const config = require('../../config')
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
  fetch(`${config.gwHost}/account/skins`, { headers: { Authorization: `Bearer ${req.apiKey}` } })
    .then(checkErrors)
    .then(response => {
      db.skins(response)
        .then(data => res.send({ body: data }))
    })
    .catch(err => console.error(err))
}

module.exports = router
