import unirest from 'unirest'
import config from '../config'

export const getItems = ids => unirest.get(`${config.gwHost}/items?ids=${ids}`)
