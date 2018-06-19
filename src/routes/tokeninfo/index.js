import express from 'express'
import fs from 'fs'
import unirest from 'unirest'
import { checkSession } from '../../util'
import config from '../../config'

const router = express.Router()

router
  .use('/', checkSession)
  .post('/', addToken)

function addToken (req, res) {
  unirest.get(`${config.gwHost}/tokeninfo`)
    .headers({ Authorization: `Bearer ${req.body.apiKey}` })
    .end(data => {
      if (data.ok) {
        fs.readFile(`./userDb/users/${req.user.username}`, 'utf8', (err, file) => {
          if (err) {
            return res.status(500).send(err)
          }
          const user = JSON.parse(file)
          user.tokenInfo = data.body
          user.apiKey = req.body.apiKey
          fs.writeFile(`./userDb/users/${req.user.username}`, JSON.stringify(user), 'utf8', err => {
            if (err) {
              return res.status(500).send(err)
            }
  
            return res.status(200).send({ permissions: user.tokenInfo.permissions })
          })
        })
      } else {
        res.status(403).send(data.body)
      }
    })
}

export default router