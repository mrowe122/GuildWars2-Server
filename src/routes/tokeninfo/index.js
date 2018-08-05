const express = require('express')
const fetch = require('node-fetch')
const admin = require('firebase-admin')
const config = require('../../config')

const router = express.Router()

function checkErrors(response) {
  if (!response.ok) {
    throw response.status
  }
  return response.json()
}

router
  .post('/', addToken)

function addToken (req, res) {
  fetch(`${config.gwHost}/tokeninfo`, { headers: { Authorization: `Bearer ${req.apiKey}` } })
    .then(checkErrors)
    .then(data => {
      if (data.statusText !== 'OK') {
        return res.status(403).send(data.data)
      }
      admin.database().ref(`users/${req.uid}`).set({
        apiKey: req.body.apiKey,
        permissions: data.data.permissions
      })
      return res.send({ permissions: data.data.permissions })
    })
    .catch(err => console.error(err))
}

module.exports = router
