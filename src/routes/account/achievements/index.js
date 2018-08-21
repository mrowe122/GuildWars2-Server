const express = require('express')
const fetch = require('node-fetch')
const { keyBy, flatMap, get, groupBy, map, assign, cond, matches, stubTrue } = require('lodash/fp')
const config = require('../../../config')
const db = require('../../../database')
const { checkErrors } = require('../../../lib')

const router = express.Router()

router
  .get('/', request)

function request (req, res) {
  const GroupAchievements = new Promise((resolve, reject) => {
    fetch(`${config.gwHost}/achievements/groups?ids=all`)
      .then(checkErrors('Achievements-Group'))
      .then(resolve)
      .catch(reject)
  })
  const AccountAchievements = new Promise((resolve, reject) => {
    fetch(`${config.gwHost}/account/achievements`, { headers: { Authorization: `Bearer ${req.apiKey}` } })
      .then(checkErrors('Achievements-Account'))
      .then(response => resolve(keyBy('id')(response)))
      .catch(reject)
  })
  const CategoryAchievements = new Promise((resolve, reject) => {
    fetch(`${config.gwHost}/achievements/categories?ids=all`)
      .then(checkErrors('Achievements-Category'))
      .then(response => db.achievements(flatMap(get('achievements'))(response))
        .then(dbAchievements => {
          const { Item, Title } = groupBy('type')(flatMap(get('rewards'))(dbAchievements))
          return Promise.all([
            db.items(map(get('id'))(Item)),
            db.titles(map(get('id'))(Title))
          ])
          .then(dbItemTitles => {
            const itemIdsKey = keyBy('id')(dbItemTitles[0])
            const titleIdsKey = keyBy('id')(dbItemTitles[1])
            const payload = dbAchievements.map(a =>
              a.rewards
                ? assign(a, { rewards: map(cond([
                    [matches({ type: 'Item' }), r => assign(r, { data: itemIdsKey[r.id] })],
                    [matches({ type: 'Title' }), r => assign(r, { data: titleIdsKey[r.id] })],
                    [stubTrue, r => r]
                  ]))(a.rewards)
                })
                : a
            )
            return resolve({ categoryResponse: response, dbAchievements: payload })
          })
        })
        .catch(reject))
  })

  Promise.all([GroupAchievements, CategoryAchievements, AccountAchievements]).then(data => {
    const [groups, categories, achievements] = data
    const dbAchievementsKeys = keyBy('id')(categories.dbAchievements)
    const _temp = categories.categoryResponse.map(c => ({
      ...c,
      achievements: c.achievements.map(achId => ({ ...dbAchievementsKeys[achId], achievementProgress: achievements[achId] }))
    }))
    const categoryKeys = keyBy('id')(_temp)
    const _finalData = groups.map(group => ({
      ...group,
      categories: group.categories.map(id => categoryKeys[id])
    }))
    res.send(_finalData)
  })
  .catch(status => res.sendStatus(status))
}

module.exports = router
