import axios from 'axios'
import { urls } from './constants'

async function requestStations() {
  if (process.env.NODE_ENV === 'development') {
    const { data } = await axios.get(urls.stations)
    return data
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const { stations } = require('../mocks/tomtom.js')
      console.log(stations)
      resolve(stations)
    }, 500)
  })
}

export { requestStations }
