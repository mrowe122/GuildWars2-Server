const express = require('express')
const admin = require('firebase-admin')

const router = express.Router()

router
  .get('/', request)

function request (req, res) {
  admin.database().ref(`users/${req.uid}`).once('value').then(snapshot => {
    res.send(snapshot.val())
  })
}

module.exports = router
