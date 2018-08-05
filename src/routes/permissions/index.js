const express = require('express')
const admin = require('firebase-admin')

const router = express.Router()

router
  .get('/', getPermissions)

function getPermissions (req, res) {
  admin.database().ref(`users/${req.uid}`).once('value').then(snapshot => {
    res.send({ body: snapshot.val().permissions })
  })
}

module.exports = router
