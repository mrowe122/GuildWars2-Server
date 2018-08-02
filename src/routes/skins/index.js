import express from 'express'
import fetch from 'node-fetch'
import config from '../../config'
import { db } from '../../database'

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

export default router
