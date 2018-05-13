import express from 'express'
import unirest from 'unirest'
import fs from 'fs'
import { flatMap, reduce } from 'lodash/fp'
import config from '../../config'
import { getItems, getSkins } from '../../lib'
import { mergeEquipment } from '../../util'

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
      if (!data.ok) {
        return res.send({ body: data.body, statusCode: data.statusCode })
      }
      const itemsId = flatMap(
        ({ id, infusions = [] , upgrades = [] }) => [id, ...infusions, ...upgrades]
      )(data.body.equipment)
      const skinIds = reduce((acc, { skin }) => skin ? acc.concat([skin]) : acc, [])(data.body.equipment)
      Promise.all([getItems(itemsId), getSkins(skinIds)]).then(ids => {
        mergeEquipment(data.body, ids).then(merged => res.send({ body: merged, statusCode: data.statusCode }))
      })
    })
}

export default router
