import unirest from 'unirest'
import * as admin from 'firebase-admin'
import { assign, map, flatMap, get, concat, keyBy } from 'lodash/fp'
import config from '../config'

export const getItems = ids => new Promise(resolve => {
  unirest
    .get(`${config.gwHost}/items?ids=${ids}`)
    .end(resolve)
})

export const getSkins = ids => new Promise(resolve => {
  unirest
    .get(`${config.gwHost}/skins?ids=${ids}`)
    .end(resolve)
})

export const getGuild = id => new Promise(resolve => {
  unirest
    .get(`${config.gwHost}/guild/${id}`)
    .end(resolve)
})

export const getSpecializations = ids => new Promise(resolve => {
  unirest
    .get(`${config.gwHost}/specializations?ids=${ids}`)
    .end(specIds => {
      const _traitIds = flatMap(trait => concat(
        get('minor_traits')(trait),
        get('major_traits')(trait)
      ))(specIds.body)

      unirest
        .get(`${config.gwHost}/traits?ids=${_traitIds}`)
        .end(traitIds => {
          const _traitsIdKey = keyBy('id')(traitIds.body)
          const response = map(s => {
            const data = {}
            s.minor_traits.map(id => data[id] = _traitsIdKey[id] )
            s.major_traits.map(id => data[id] = _traitsIdKey[id] )
            return assign(s, { traitData: data })
          })(specIds.body)
          resolve(response)
        })
    })
})

export const getCurrencies = ids => new Promise(resolve => {
  unirest
    .get(`${config.gwHost}/currencies?ids=${ids}`)
    .end(resolve)
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
