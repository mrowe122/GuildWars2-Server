import express from 'express'
import unirest from 'unirest'
import fs from 'fs'
import { map, flatMap, reduce, get } from 'lodash/fp'
import config from '../../config'
import { getItems, getSkins, getGuild, getSpecializations } from '../../lib'
import { parseData } from '../../util'

const router = express.Router()

router.use((req, res, next) => {
  fs.readFile('./userDb/apiKey', 'utf8', (err, data) => {
    if (err) {
      res.status(401).send('no api key stored')
    } else {
      req.apiKey = JSON.parse(data).apiKey
      next()
    }
  })
})

router
  .get('/', request)
  .get('/:id', charData)

function request (req, res) {
  unirest.get(`${config.gwHost}/characters`)
    .headers({ Authorization: `Bearer ${req.apiKey}` })
    .end(data => {
      if (data.ok) {
        return res.send({ body: data.body, statusCode: data.statusCode })
      } else {
        return res.status(data.statusCode).send(data.body)
      }
    })
}

function charData (req, res) {
  unirest.get(`${config.gwHost}/characters${req.url}`)
    .headers({ Authorization: `Bearer ${req.apiKey}` })
    .end(data => {
      if (!data.ok) {
        return res.status(data.statusCode).send(data.body)
      }
      const itemsId = flatMap(
        ({ id, infusions = [] , upgrades = [] }) => [id, ...infusions, ...upgrades]
      )(data.body.equipment)
      const skinIds = map(get('skin'))(data.body.equipment)
      const specializationIds = flatMap(map(get('id')))(data.body.specializations)
      return Promise.all([
        getItems(itemsId), getSkins(skinIds), getGuild(data.body.guild), getSpecializations(specializationIds)
      ]).then(parseData(data.body))
        .then(merged => res.send({ body: merged, statusCode: data.statusCode }))
    })
}

export default router
