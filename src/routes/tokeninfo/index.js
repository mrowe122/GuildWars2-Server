import express from 'express'
import fs from 'fs'

const router = express.Router()

router
  .get('/', request)

function request (req, res) {
  fs.readFile('./userDb/apiKey', 'utf8', (err, data) => {
    if (err) {
      res.status(401).send('no api key stored')
    } else {
      res.send({ body: JSON.parse(data) })
    }
  })
}

export default router
