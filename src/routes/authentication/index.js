import express from 'express'
import unirest from 'unirest'
import fs from 'fs'

const router = express.Router()

router
  .post('/', createAccount)

function createAccount (req, res) {
  const user = JSON.stringify(req.body)
  if (!fs.existsSync('userDb')) { fs.mkdirSync('userDb') }
  fs.writeFile('./userDb/user', user, err => {
    if (err) { return res.status(500).send(err) }
    res.status(200).send('User Created')
  })
}

export default router
