import express from 'express'
import unirest from 'unirest'
import fs from 'fs'
import { flatMap } from 'lodash/fp'
import config from '../../config'
import { getItems } from '../../lib'
import { mergeEquipmentIds } from '../../util'

const router = express.Router()

router.use((req, res, next) => {
  fs.readFile('./userDb/user', 'utf8', (err, data) => {
    const apiKey = JSON.parse(data).apiKey
    if (apiKey) {
      req.apiKey = apiKey
      next()
    } else {
      res.status(403).send('no api key stored')
    }
  })
})

router
  .get('/', request)
  .get('/:id', charData)

function request (req, res) {
  unirest.get(`${config.gwHost}/characters`)
    .headers({ Authorization: `Bearer ${req.apiKey}` })
    .end(data => res.send({ body: data.body, statusCode: data.statusCode }))
}

function charData (req, res) {
  unirest.get(`${config.gwHost}/characters${req.url}`)
    .headers({ Authorization: `Bearer ${req.apiKey}` })
    .end(data => {
      const allIds = flatMap(
        ({ id, infusions = [] , upgrades = [] }) => [id, ...infusions, ...upgrades]
      )(data.body.equipment)
      getItems(allIds).end(ids => {
        mergeEquipmentIds(data.body, ids.body).then(merged => res.send({ body: merged, statusCode: data.statusCode }))
      })
    })
}

export default router
