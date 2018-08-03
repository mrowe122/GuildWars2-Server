import Datastore from 'nedb'
import { difference, uniq, compact } from 'lodash/fp'
import debug from 'debug'
import { getItems, getDyes, getSkins, getSpecializations, getCurrencies } from '../lib'

const log = debug('Gw2:NeDB:')

class Database {
  constructor () {
    this.db = {
      currency: new Datastore({ filename: './db/currency', autoload: true }),
      items: new Datastore({ filename: './db/items', autoload: true }),
      dyes: new Datastore({ filename: './db/dyes', autoload: true }),
      skins: new Datastore({ filename: './db/skins', autoload: true }),
      specializations: new Datastore({ filename: './db/specializations', autoload: true })
    }
  }

  currencies = ids => this.execute(this.db.currency, getCurrencies, ids)
  items = ids => this.execute(this.db.items, getItems, ids)
  dyes = ids => this.execute(this.db.dyes, getDyes, ids)
  skins = ids => this.execute(this.db.skins, getSkins, ids)
  specializations = ids => this.execute(this.db.specializations, getSpecializations, ids)

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
