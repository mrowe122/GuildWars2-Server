import express from 'express'
import unirest from 'unirest'
import config from '../../config'

const router = express.Router()

router
  .get('/', request)
  .get('/:id', charData)

function request (req, res) {
  unirest.get(`${config.gwHost}/characters${req.url}`)
    //TODO client will not be sending api key. Implement Database
    .headers({ Authorization: `Bearer ${req.query.access_token}` })
    .end(data => res.send(data))
}

function charData (req, res) {
  unirest.get(`${config.gwHost}/characters${req.url}`)
    //TODO client will not be sending api key. Implement Database
    .headers({ Authorization: `Bearer ${req.query.access_token}` })
    .end(data => res.send(data))
}

export default router
