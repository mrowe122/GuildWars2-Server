import express from 'express'
import unirest from 'unirest'
import fs from 'fs'
import config from '../../config'

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

function request (req, res) {
  unirest.get(`${config.gwHost}/tokeninfo`)
    .headers({ Authorization: `Bearer ${req.apiKey}` })
    .end(data => {
      if (data.ok) {
        return res.send({ body: data.body, statusCode: data.statusCode })
      } else {
        return res.status(data.statusCode).send(data.body)
      }
    })
}

export default router
