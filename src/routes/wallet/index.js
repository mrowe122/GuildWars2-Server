import express from 'express'
import fetch from 'node-fetch'
import config from '../../config'
import { mergeIds } from './util'
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
  fetch(`${config.gwHost}/account/wallet`, { headers: { Authorization: `Bearer ${req.apiKey}` } })
    .then(checkErrors)
    .then(data => {
      const ids = data.map(c => c.id)
      db.currencies(ids)
        .then(ids => mergeIds(data, ids))
        .then(merged => res.send({ body: merged }))
    })
    .catch(err => console.error(err))
}

export default router
