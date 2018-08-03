import Datastore from 'nedb'
import { difference, uniq, compact } from 'lodash/fp'
import debug from 'debug'
import { getItems, getDyes, getSkins, getSpecializations, getCurrencies, getTitles, getAchievements } from '../lib'

const log = debug('Gw2:NeDB:')

class Database {
  constructor () {
    this.db = {
      achievements: new Datastore({ filename: './db/achievements', autoload: true }),
      currency: new Datastore({ filename: './db/currency', autoload: true }),
      dyes: new Datastore({ filename: './db/dyes', autoload: true }),
      items: new Datastore({ filename: './db/items', autoload: true }),
      skins: new Datastore({ filename: './db/skins', autoload: true }),
      specializations: new Datastore({ filename: './db/specializations', autoload: true }),
      titles: new Datastore({ filename: './db/titles', autoload: true })
    }
  }

  achievements = ids => this.execute(this.db.achievements, getAchievements, ids)
  currencies = ids => this.execute(this.db.currency, getCurrencies, ids)
  dyes = ids => this.execute(this.db.dyes, getDyes, ids)
  items = ids => this.execute(this.db.items, getItems, ids)
  skins = ids => this.execute(this.db.skins, getSkins, ids)
  specializations = ids => this.execute(this.db.specializations, getSpecializations, ids)
  titles = ids => this.execute(this.db.titles, getTitles, ids)

  execute = (db, func, queryIds) => new Promise(resolve => {
    const uniqueIds = compact(uniq(queryIds))
    db.find({ id: { $in: uniqueIds } }, (err, dataDb) => {
      if (err) {
        log(err)
        return resolve(dataDb)
      }

      if (uniqueIds.length === dataDb.length) {
        return resolve(dataDb)
      }

      const diffIds = difference(uniqueIds)(dataDb.map(d => d.id))
      log('fetching ids for', diffIds)

      func(diffIds).then(data => {
        if (data.status === 404) {
          log(data)
          resolve(dataDb)
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

export const db = new Database()
