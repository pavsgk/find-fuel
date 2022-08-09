import axios from 'axios'
import { urls } from './constants'

async function requestStations() {
  const { data } = await axios.get(urls.stations)
  return data
}

export { requestStations }
