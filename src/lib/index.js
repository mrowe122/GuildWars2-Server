import unirest from 'unirest'
import config from '../config'

export const getItems = ids => new Promise(resolve => {
  unirest
    .get(`${config.gwHost}/items?ids=${ids}`)
    .end(data => {
      // check if errors
      resolve(data)
    })
})

export const getSkins = ids => new Promise(resolve => {
  unirest
    .get(`${config.gwHost}/skins?ids=${ids}`)
    .end(data => {
      // check if errors
      resolve(data)
    })
})
