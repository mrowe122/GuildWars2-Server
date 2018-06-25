import express from 'express'
import * as admin from 'firebase-admin'

const router = express.Router()

router
  .get('/', getPermissions)

function getPermissions (req, res) {
  admin.database().ref(`users/${req.uid}`).once('value').then(snapshot => {
    res.send({ body: snapshot.val().permissions })
  })
}

export default router
