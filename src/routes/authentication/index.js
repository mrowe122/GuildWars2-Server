import express from 'express'
import fs from 'fs'

const router = express.Router()

const UUID = () => {
  let dt = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    let r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c=='x' ? r : (r&0x3 | 0x8)).toString(16);
  });
}

router
  .post('/create', createAccount)
  .post('/', authenticate)

function createAccount (req, res) {
  const user = {
    username: req.body.username,
    password: req.body.password
  }
  const id = UUID()

  fs.writeFile(`./userDb/users/${req.body.username}`, JSON.stringify(user), 'utf8', err => {
    if (err) {
      return res.status(500).send(err)
    }

    const session = {
      user: req.body.username
    }
    fs.writeFile(`./userDb/sessions/${id}`, JSON.stringify(session), 'utf8', err => {
      if (err) {
        return res.status(500).send(err)
      }
      return res.status(201).send(id)
    })
  })
}

function authenticate (req, res) {
  fs.readFile(`./userDb/users/${req.body.username}`, 'utf8',  (err, userFile) => {
    if (err) {
      res.status(404).send('user does not exist')
    } else {
      const user = JSON.parse(userFile)
      if (user.password === req.body.password) {
        const id = UUID()
        const session = {
          user: req.body.username
        }
        fs.writeFile(`./userDb/sessions/${id}`, JSON.stringify(session), 'utf8', err => {
          if (err) {
            return res.status(500).send(err)
          }
          return res.status(200).send({ sessionId: id, permissions: user.tokenInfo.permissions })
        })
      } else {
        res.status(403).send('password did not match')
      }
    }
  })
}

export default router
