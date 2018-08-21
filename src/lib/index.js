const fetch = require('node-fetch')
const admin = require('firebase-admin')
const { assign, map, flatMap, get, concat, keyBy, chunk, flatten } = require('lodash/fp')
const debug = require('debug')
const config = require('../config')

const CHUNK_SIZE = 200

const checkErrors = log => response => {
  if (!response.ok) {
    debug(`Gw2:${log}:`)(response.status, response.statusText, response.url)
    throw response.status === 400 ? 403 : response
  }
  return response.json()
}

const getItems = ids => new Promise(resolve => {
  if (ids.length > CHUNK_SIZE) {
    Promise.all(chunk(CHUNK_SIZE)(ids).map(getItems)).then(d => resolve(flatten(d)))
  } else {
    fetch(`${config.gwHost}/items?ids=${ids}`)
      .then(checkErrors('API-items'))
      .then(resolve)
      .catch(resolve)
  }
})

const getSkins = ids => new Promise(resolve => {
  if (ids.length > CHUNK_SIZE) {
    Promise.all(chunk(CHUNK_SIZE)(ids).map(getSkins)).then(d => resolve(flatten(d)))
  } else {
    fetch(`${config.gwHost}/skins?ids=${ids}`)
      .then(checkErrors('API-skins'))
      .then(resolve)
      .catch(resolve)
  }
})

const getDyes = ids => new Promise(resolve => {
  if (ids.length > CHUNK_SIZE) {
    Promise.all(chunk(CHUNK_SIZE)(ids).map(getDyes)).then(d => resolve(flatten(d)))
  } else {
    fetch(`${config.gwHost}/colors?ids=${ids}`)
      .then(checkErrors('API-dyes'))
      .then(resolve)
      .catch(resolve)
  }
})

const getTitles = ids => new Promise(resolve => {
  if (ids.length > CHUNK_SIZE) {
    Promise.all(chunk(CHUNK_SIZE)(ids).map(getTitles)).then(d => resolve(flatten(d)))
  } else {
    fetch(`${config.gwHost}/titles?ids=${ids}`)
      .then(checkErrors('API-titles'))
      .then(resolve)
      .catch(resolve)
  }
})

const getFinishers = ids => new Promise(resolve => {
  if (ids.length > CHUNK_SIZE) {
    Promise.all(chunk(CHUNK_SIZE)(ids).map(getFinishers)).then(d => resolve(flatten(d)))
  } else {
    fetch(`${config.gwHost}/finishers?ids=${ids}`)
      .then(checkErrors('API-finishers'))
      .then(resolve)
      .catch(resolve)
  }
})

const getMinis = ids => new Promise(resolve => {
  if (ids.length > CHUNK_SIZE) {
    Promise.all(chunk(CHUNK_SIZE)(ids).map(getMinis)).then(d => resolve(flatten(d)))
  } else {
    fetch(`${config.gwHost}/minis?ids=${ids}`)
      .then(checkErrors('API-minis'))
      .then(resolve)
      .catch(resolve)
  }
})

const getAchievements = ids => new Promise(resolve => {
  if (ids.length > CHUNK_SIZE) {
    Promise.all(chunk(CHUNK_SIZE)(ids).map(getAchievements)).then(d => resolve(flatten(d)))
  } else {
    fetch(`${config.gwHost}/achievements?ids=${ids}`)
      .then(checkErrors('API-achievements'))
      .then(resolve)
      .catch(resolve)
  }
})

const getGuild = guild => new Promise(resolve => {
  if (guild) {
    fetch(`${config.gwHost}/guild/${guild}`)
      .then(checkErrors('API-guild'))
      .then(resolve)
      .catch(resolve)
  } else {
    resolve(null)
  }
})

const getTraits = ids => new Promise(resolve => {
  fetch(`${config.gwHost}/traits?ids=${ids}`)
    .then(checkErrors('API-traits'))
    .then(resolve)
    .catch(resolve)
})

const getSpecializations = ids => new Promise(resolve => {
  fetch(`${config.gwHost}/specializations?ids=${ids}`)
    .then(checkErrors('API-specializations'))
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
    .catch(resolve)
})

const getCurrencies = ids => new Promise(resolve => {
  fetch(`${config.gwHost}/currencies?ids=${ids}`)
    .then(checkErrors('API-currencies'))
    .then(resolve)
    .catch(resolve)
})

const checkToken = (req, res, next) => {
  const token = req.body.token || req.query.token
  admin.auth().verifyIdToken(token)
    .then(decodedToken => {
      req.uid = decodedToken.uid
      next()
    }).catch(() => {
      res.sendStatus(500)
    })
}

const getApiKey = (req, res, next) => {
  admin.database().ref(`users/${req.uid}`).once('value').then(snapshot => {
    const uuid = snapshot.val()
    if (uuid && uuid.apiKey) {
      req.apiKey = uuid.apiKey
      next()
    } else {
      res.sendStatus(403).send({ message: 'No Api Key' })
    }
  })
}

module.exports = {
  checkErrors,
  getItems,
  getSkins,
  getDyes,
  getTitles,
  getAchievements,
  getFinishers,
  getMinis,
  getGuild,
  getSpecializations,
  getCurrencies,
  checkToken,
  getApiKey
}
