const express = require('express')
const fetch = require('node-fetch')
const admin = require('firebase-admin')
const config = require('../../config')
const { checkErrors } = require('../../lib')

const router = express.Router()

router
  .post('/', addToken)

function addToken (req, res) {
  fetch(`${config.gwHost}/tokeninfo`, { headers: { Authorization: `Bearer ${req.body.apiKey}` } })
    .then(checkErrors('tokeninfo'))
    .then(data => {
      admin.database().ref(`users/${req.uid}`).set({
        apiKey: req.body.apiKey,
        permissions: data.permissions
      })
      return res.send(data.permissions)
    })
    .catch(err => {
      return res.sendStatus(403).send(err)
    })
}

module.exports = router
