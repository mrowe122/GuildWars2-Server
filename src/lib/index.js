import unirest from 'unirest'
import * as admin from 'firebase-admin'
import config from '../config'

export const getItems = ids => new Promise(resolve => {
  unirest
    .get(`${config.gwHost}/items?ids=${ids}`)
    .end(data => resolve(data))
})

export const getSkins = ids => new Promise(resolve => {
  unirest
    .get(`${config.gwHost}/skins?ids=${ids}`)
    .end(data => resolve(data))
})

export const getGuild = id => new Promise(resolve => {
  unirest
    .get(`${config.gwHost}/guild/${id}`)
    .end(data => resolve(data))
})

export const getSpecializations = ids => new Promise(resolve => {
  unirest
    .get(`${config.gwHost}/specializations?ids=${ids}`)
    .end(data => resolve(data))
})

export const getCurrencies = ids => new Promise(resolve => {
  unirest
    .get(`${config.gwHost}/currencies?ids=${ids}`)
    .end(data => resolve(data))
})

export const checkToken = (req, res, next) => {
  const token = req.body.token || req.query.token
  admin.auth().verifyIdToken(token)
    .then(decodedToken => {
      req.uid = decodedToken.uid
      next()
    }).catch(() => {
      res.sendStatus(500)
    })
}

export const getApiKey = (req, res, next) => {
  admin.database().ref(`users/${req.uid}`).once('value').then(snapshot => {
    const uuid = snapshot.val()
    if (uuid && uuid.apiKey) {
      req.apiKey = uuid.apiKey
      next()
    } else {
      res.status(403).send({ message: 'No Api Key' })
    }
  })
}
