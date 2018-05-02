import express from 'express'
import unirest from 'unirest'
import { gwHost, key } from '../../../config'

const router = express.Router()

router
  .get('/', request)
  .get('/:id', charData)

function request (req, res) {
  unirest.get(`${gwHost}/characters${req.url}`)
    .headers({ Authorization: `Bearer ${key}` })
    .end(data => res.json(data))
}

function charData (req, res) {
  unirest.get(`${gwHost}/characters${req.url}`)
    .headers({ Authorization: `Bearer ${key}` })
    .end(data => {
      res.json(data)
    })
}

export default router
