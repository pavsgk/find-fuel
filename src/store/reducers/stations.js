import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { requestStations } from '../../utils/api'
import { dbParser, filterByField } from '../../utils/parsers'
import { calculateDistance, flattenObject } from '../../utils/utils'

const initialState = {
  db: [],
  myPosition: [30.523333, 50.450001],
  filters: { radius: 5000, brand: [] },
  filtered: [],
  isReady: false,
  isError: false,
  isLoading: true,
}

export const getStations = createAsyncThunk('stations/get', async () => {
  const response = await requestStations()
  const shapedResults = response.results.map(flattenObject)
  return shapedResults
})

const recalculateDistances = (stations, { lng, lat }) => {
  return stations
    .map((station) => {
      station['dist'] = calculateDistance(station.position_lat, station.position_lon, lat, lng)
      return station
    })
    .sort((stationA, stationB) => stationA.dist - stationB.dist)
}

const applyFilters = (state) => {
  let updatedStationsList = recalculateDistances(state.db, {
    lng: state.myPosition[0],
    lat: state.myPosition[1],
  }).filter((el) => el.dist < state.filters.radius)

  const { brand } = state.filters
  if (brand.length) {
    updatedStationsList = filterByField(updatedStationsList, 'poi_brands_0_name', brand)
  }

  return updatedStationsList
}

const stationsSlice = createSlice({
  name: 'stations',
  initialState,
  reducers: {
    updateFilters: (state, { payload }) => {
      state.filters = { ...state.filters, ...payload }
      state.filtered = applyFilters(state)
    },
    setMyPosition: (state, { payload }) => {
      state.myPosition = payload
      state.filtered = applyFilters(state)
    },
  },
  extraReducers: {
    [getStations.fulfilled]: (state, { payload }) => {
      state.db = payload
      state.filtered = applyFilters(state)
      state.isReady = true
      state.isLoading = false
      console.log(state);
    },
    [getStations.pending]: (state) => {
      state.isLoading = true
    },
    [getStations.rejected]: (state) => {
      state.isLoading = false
      state.isError = true
      state.isReady = false
    },
  },
})

export const { setMyPosition, updateFilters } = stationsSlice.actions
export default stationsSlice.reducer
