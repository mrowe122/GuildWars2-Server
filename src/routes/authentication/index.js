import express from 'express'
import unirest from 'unirest'
import fs from 'fs'
import config from '../../config'

const router = express.Router()

router
  .post('/', createAccount)

function createAccount (req, res) {
  unirest.get(`${config.gwHost}/tokeninfo`)
    .headers({ Authorization: `Bearer ${req.body.apiKey}` })
    .end(data => {
      if (data.ok) {
        const _token = JSON.stringify(data.body)
        if (!fs.existsSync('userDb')) { fs.mkdirSync('userDb') }
        fs.writeFile('./userDb/apiKey', _token, err => {
          if (err) { return res.status(500).send(err) }
          res.status(200).send(data.body)
        })
      } else {
        res.status(403).send(data.body)
      }
    })
}

export default router
