import express from 'express'
import unirest from 'unirest'
import config from '../../config'
import { getCurrencies } from '../../lib'
import { mergeIds } from './util'

const router = express.Router()

router
  .get('/', request)

function request (req, res) {
  unirest.get(`${config.gwHost}/account/wallet`)
    .headers({ Authorization: `Bearer ${req.apiKey}` })
    .end(data => {
      if (!data.ok) {
        return res.status(403).send(data.body)
      }
      const ids = data.body.map(c => c.id)
      getCurrencies(ids)
        .then(ids => mergeIds(data.body, ids.body))
        .then(merged => res.send({ body: merged, statusCode: data.statusCode }))
    })
}

export default router
