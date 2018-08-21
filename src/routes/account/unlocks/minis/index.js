const express = require('express')
const fetch = require('node-fetch')
const { checkErrors } = require('../../../../lib')
const config = require('../../../../config')
const db = require('../../../../database')

const router = express.Router()

router
  .get('/', request)

function request (req, res) {
  fetch(`${config.gwHost}/account/minis`, { headers: { Authorization: `Bearer ${req.apiKey}` } })
    .then(checkErrors('minis'))
    .then(response => {
      db.minis(response)
        .then(data => res.send(data))
    })
    .catch(status => res.sendStatus(status))
}

module.exports = router
