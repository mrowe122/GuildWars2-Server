import fetch from 'node-fetch'
import * as admin from 'firebase-admin'
import { assign, map, flatMap, get, concat, keyBy, chunk, flatten } from 'lodash/fp'
import debug from 'debug'
import config from '../config'

const CHUNK_SIZE = 200

const checkErrors = response => {
  if (!response.ok) {
    throw response
  }
  return response.json()
}

const handleError = (resolve, log) => err => {
  log(err)
  resolve(err)
}

export const getItems = ids => new Promise(resolve => {
  if (ids.length > CHUNK_SIZE) {
    Promise.all(chunk(CHUNK_SIZE)(ids).map(getItems)).then(d => resolve(flatten(d)))
  } else {
    fetch(`${config.gwHost}/items?ids=${ids}`)
      .then(checkErrors)
      .then(resolve)
      .catch(handleError(resolve, debug('Gw2:API-items:')))
  }
})

export const getSkins = ids => new Promise(resolve => {
  if (ids.length > CHUNK_SIZE) {
    Promise.all(chunk(CHUNK_SIZE)(ids).map(getSkins)).then(d => resolve(flatten(d)))
  } else {
    fetch(`${config.gwHost}/skins?ids=${ids}`)
      .then(checkErrors)
      .then(resolve)
      .catch(handleError(resolve, debug('Gw2:API-skins:')))
  }
})

export const getDyes = ids => new Promise(resolve => {
  if (ids.length > CHUNK_SIZE) {
    Promise.all(chunk(CHUNK_SIZE)(ids).map(getDyes)).then(d => resolve(flatten(d)))
  } else {
    fetch(`${config.gwHost}/colors?ids=${ids}`)
      .then(checkErrors)
      .then(resolve)
      .catch(handleError(resolve, debug('Gw2:API-dyes:')))
  }
})

export const getTitles = ids => new Promise(resolve => {
  if (ids.length > CHUNK_SIZE) {
    Promise.all(chunk(CHUNK_SIZE)(ids).map(getTitles)).then(d => resolve(flatten(d)))
  } else {
    fetch(`${config.gwHost}/titles?ids=${ids}`)
      .then(checkErrors)
      .then(resolve)
      .catch(handleError(resolve, debug('Gw2:API-titles:')))
  }
})

export const getAchievements = ids => new Promise(resolve => {
  if (ids.length > CHUNK_SIZE) {
    Promise.all(chunk(CHUNK_SIZE)(ids).map(getSkins)).then(d => resolve(flatten(d)))
  } else {
    fetch(`${config.gwHost}/achievements?ids=${ids}`)
      .then(checkErrors)
      .then(resolve)
      .catch(handleError(resolve, debug('Gw2:API-achievements:')))
  }
})

export const getGuild = guild => new Promise(resolve => {
  if (guild) {
    fetch(`${config.gwHost}/guild/${guild}`)
      .then(checkErrors)
      .then(resolve)
      .catch(handleError(resolve, debug('Gw2:API-guild:')))
  } else {
    resolve(null)
  }
})

const getTraits = ids => new Promise(resolve => {
  fetch(`${config.gwHost}/traits?ids=${ids}`)
    .then(checkErrors)
    .then(resolve)
    .catch(handleError(resolve, debug('Gw2:API-traits:')))
})

export const getSpecializations = ids => new Promise(resolve => {
  fetch(`${config.gwHost}/specializations?ids=${ids}`)
    .then(checkErrors)
    .then(specData => {
      const _traitIds = flatMap(trait => concat(
        get('minor_traits')(trait),
        get('major_traits')(trait)
      ))(specData)

      getTraits(_traitIds)
        .then(traitIds => {
          const _traitsIdKey = keyBy('id')(traitIds)
          const response = map(s => {
            const data = {}
            s.minor_traits.map(id => data[id] = _traitsIdKey[id] )
            s.major_traits.map(id => data[id] = _traitsIdKey[id] )
            return assign(s, { traitData: data })
          })(specData)
          resolve(response)
        })
    })
    .catch(handleError(resolve, debug('Gw2:API-specializations:')))
})

export const getCurrencies = ids => new Promise(resolve => {
  fetch(`${config.gwHost}/currencies?ids=${ids}`)
    .then(checkErrors)
    .then(resolve)
    .catch(handleError(resolve, debug('Gw2:API-currencies:')))
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
