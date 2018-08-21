const Datastore = require('nedb')
const { difference, uniq, compact } = require('lodash/fp')
const debug = require('debug')
const { getItems, getDyes, getSkins, getSpecializations, getCurrencies, getTitles, getAchievements, getFinishers, getMinis } = require('../lib')

const log = debug('Gw2:NeDB:')

class Database {
  constructor () {
    this.db = {
      achievements: new Datastore({ filename: './db/achievements', autoload: true }),
      currency: new Datastore({ filename: './db/currency', autoload: true }),
      dyes: new Datastore({ filename: './db/dyes', autoload: true }),
      finishers: new Datastore({ filename: './db/finishers', autoload: true }),
      items: new Datastore({ filename: './db/items', autoload: true }),
      minis: new Datastore({ filename: './db/minis', autoload: true }),
      skins: new Datastore({ filename: './db/skins', autoload: true }),
      specializations: new Datastore({ filename: './db/specializations', autoload: true }),
      titles: new Datastore({ filename: './db/titles', autoload: true })
    }
  }

  query(db, func, ids) {
    return new Promise(resolve => {
      const uniqueIds = compact(uniq(ids))
      db.find({ id: { $in: uniqueIds } }, (err, dataDb) => {
        if (err) {
          log(err)
          return resolve(dataDb)
        }

        if (uniqueIds.length === dataDb.length) {
          return resolve(dataDb.filter(d => !d.blacklist))
        }

        const diffIds = difference(uniqueIds)(dataDb.map(d => d.id))

        func(diffIds).then(data => {
          if (data.status === 404) {
            log(data.status, data.statusText, diffIds)
            const blackList = diffIds.map(i => ({ id: i, blacklist: true }))
            db.insert(blackList, err => {
              if (err) {
                return resolve(dataDb)
              }
              resolve(dataDb)
            })
          } else {
            db.insert(data, err => {
              if (err) {
                return resolve(dataDb)
              }
              resolve(dataDb.concat(data))
            })
          }
        })
      })
    })
  }
  
  achievements(ids) {
    return this.query(this.db.achievements, getAchievements, ids)
  }

  currencies(ids) {
    return this.query(this.db.currency, getCurrencies, ids)
  }

  dyes(ids) {
    return this.query(this.db.dyes, getDyes, ids)
  }

  finishers(ids) {
    return this.query(this.db.finishers, getFinishers, ids)
  }

  items(ids) {
    return this.query(this.db.items, getItems, ids)
  }

  minis(ids) {
    return this.query(this.db.minis, getMinis, ids)
  }

  skins(ids) {
    return this.query(this.db.skins, getSkins, ids)
  }
  
  specializations(ids) {
    return this.query(this.db.specializations, getSpecializations, ids)
  }

  titles(ids) {
    return this.query(this.db.titles, getTitles, ids)
  }
}

module.exports = new Database()
