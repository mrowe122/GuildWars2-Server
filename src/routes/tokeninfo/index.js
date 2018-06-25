import express from 'express'
import unirest from 'unirest'
import * as admin from 'firebase-admin'
import config from '../../config'

const router = express.Router()

router
  .post('/', addToken)

function addToken (req, res) {
  unirest.get(`${config.gwHost}/tokeninfo`)
    .headers({ Authorization: `Bearer ${req.body.apiKey}` })
    .end(data => {
      if (data.ok) {
        admin.database().ref(`users/${req.uid}`).set({
          apiKey: req.body.apiKey,
          permissions: data.body.permissions
        })
        res.send({ permissions: data.body.permissions })
      } else {
        res.status(403).send(data.body)
      }
    })
}

export default router
