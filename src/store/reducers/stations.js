import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { requestStations } from '../../utils/api'
import { calculateDistance } from '../../utils/utils'

const initialState = {
  db: [],
  myPosition: [30.523333, 50.450001],
  filters: { radius: 5000 },
  filtered: [],
  isReady: false,
  isError: false,
  isLoading: true,
}

export const getStations = createAsyncThunk('stations/get', async () => {
  const response = await requestStations()
  return response.results
})

const recalculateDistances = (stations, { lng, lat }) => {
  return stations
    .map((station) => {
      station['dist'] = calculateDistance(station.position.lat, station.position.lon, lat, lng)
      return station
    })
    .sort((stationA, stationB) => stationA.dist - stationB.dist)
}

const stationsSlice = createSlice({
  name: 'stations',
  initialState,
  reducers: {
    updateFilters: (state, { payload }) => {
      state.filters = { ...state.filters, ...payload }
      const updatedStationsList = recalculateDistances(state.db, { lng: state.myPosition[0], lat: state.myPosition[1] })
      state.filtered = updatedStationsList.filter((el) => el.dist < state.filters.radius)
    },
    setMyPosition: (state, { payload }) => {
      state.myPosition = payload
      const [lng, lat] = payload
      const updatedStationsList = recalculateDistances(state.db, { lng, lat })
      state.filtered = updatedStationsList.filter((el) => el.dist < state.filters.radius)
    },
  },
  extraReducers: {
    [getStations.fulfilled]: (state, { payload }) => {
      const [lng, lat] = state.myPosition
      state.db = recalculateDistances(payload, { lng, lat })
      state.filtered = state.db.filter((el) => el.dist < state.filters.radius)
      state.isReady = true
      state.isLoading = false
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
