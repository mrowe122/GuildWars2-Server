import express from 'express'
import fetch from 'node-fetch'
import { flatMap } from 'lodash/fp'
import config from '../../config'
import { db } from '../../database'
import { mergeIds } from './util'

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
  fetch(`${config.gwHost}/account/titles`, { headers: { Authorization: `Bearer ${req.apiKey}` } })
    .then(checkErrors)
    .then(response => {
      db.titles(response)
        .then(data => db.achievements(flatMap(i => i.achievements)(data)).then(ach => mergeIds(data, ach)))
        .then(data => res.send({ body: data }))
    })
    .catch(err => console.error(err))
}

export default router
