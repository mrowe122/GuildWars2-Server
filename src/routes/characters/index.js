import express from 'express'
import unirest from 'unirest'
import fs from 'fs'
import config from '../../config'

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
  unirest.get(`${config.gwHost}/characters${req.url}`)
    .headers({ Authorization: `Bearer ${req.apiKey}` })
    .end(data => {
      res.send(data)
    })
}

function charData (req, res) {
  unirest.get(`${config.gwHost}/characters${req.url}`)
    .headers({ Authorization: `Bearer ${req.apiKey}` })
    .end(data => {
      res.send(data)
    })
}

export default router
