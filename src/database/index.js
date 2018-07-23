import Datastore from 'nedb'
import { difference, uniq, compact } from 'lodash/fp'
import { getItems, getSkins, getSpecializations, getCurrencies } from '../lib'

class Database {
  constructor () {
    this.db = {
      currency: new Datastore({ filename: './db/currency', autoload: true }),
      items: new Datastore({ filename: './db/items', autoload: true }),
      skins: new Datastore({ filename: './db/skins', autoload: true }),
      specializations: new Datastore({ filename: './db/specializations', autoload: true })
    }
  }

  currencies = ids => this.execute(this.db.currency, getCurrencies, ids)
  items = ids => this.execute(this.db.items, getItems, ids)
  skins = ids => this.execute(this.db.skins, getSkins, ids)
  specializations = ids => this.execute(this.db.specializations, getSpecializations, ids)

  execute = (db, func, queryIds) => new Promise((resolve, reject) => {
    const uniqueIds = compact(uniq(queryIds))
    db.find({ id: { $in: uniqueIds } }, (err, dataDb) => {
      if (err) {
        return reject(err)
      }

      if (uniqueIds.length === dataDb.length) {
        return resolve(dataDb)
      }

      const diffIds = difference(uniqueIds)(dataDb.map(d => d.id))

      func(diffIds).then(data => {
        if (!data) {
          resolve(dataDb)
        } else {
          db.insert(data, err => {
            if (err) {
              return reject(err)
            }
            resolve(dataDb.concat(data))
          })
        }
      })
    })
  })
}

export const db = new Database()
