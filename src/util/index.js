import { keyBy, assign, assignAll, flatMap, map, mapValues } from 'lodash/fp'
import fs from 'fs'

export const parseData = data => ids => {
  return Promise.all([
    mergeEquipment(data.equipment, [ids[0].body, ids[1].body]),
    guildEmblem(ids[2].body),
    mergeSpecialization(data.specializations, ids[3].body)
  ]).then(parsedData => assignAll([data, ...parsedData]))
}

const mergeEquipment = (data, ids) => new Promise(resolve => {
  const _itemIdKey = keyBy('id')(ids[0])
  const _skinIdKey = keyBy('id')(ids[1])
  const _equipment = flatMap(({ infusions = [], upgrades = [], skin = null, ...e }) => assign(
    e, {
      data: _itemIdKey[e.id],
      infusions: infusions.map(i => _itemIdKey[i]),
      upgrades: upgrades.map(u => _itemIdKey[u]),
      skin: _skinIdKey[skin]
    }
  ))(data)
  resolve({ equipment: keyBy('slot')(_equipment) })
})

const guildEmblem = data => new Promise(resolve => resolve({ guild: data }))

const mergeSpecialization = (data, ids) => new Promise(resolve => {
  const _itemIdKey = keyBy('id')(ids)
  const _specialization = mapValues(map(s => s ? assign(s, { data: _itemIdKey[s.id] }) : null))(data)
  resolve({ specializations: _specialization })
})

export const checkSession = (req, res, next) => {
  fs.readFile(`./userDb/sessions/${req.headers['x-session-token']}`, 'utf8', (err, sessionFile) => {
    if (err) {
      return res.sendStatus(404)
    }

    const session = JSON.parse(sessionFile)

    fs.readFile(`./userDb/users/${session.user}`, 'utf8', (err, userFile) => {
      if (err) {
        return res.sendStatus(404)
      }

      req.user = JSON.parse(userFile)
      next()
    })
  })
}