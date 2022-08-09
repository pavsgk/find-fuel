import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { requestStations } from '../../utils/api'
import { calculateDistance } from '../../utils/utils'

const initialState = {
  db: [],
  myPosition: [30.523333, 50.450001],
  filters: {},
  filtered: [],
  isReady: false,
  isError: false,
  isLoading: true,
}

export const getStations = createAsyncThunk('stations/get', async () => {
  const response = await requestStations()
  return response.results
})

const stationsSlice = createSlice({
  name: 'stations',
  initialState,
  reducers: {
    filterStations: (state, { payload }) => {
      state.filtered = state.db
    },
    setMyPosition: (state, { payload }) => {
      state.myPosition = payload
    },
  },
  extraReducers: {
    [getStations.fulfilled]: (state, { payload }) => {
      const [lng, lat] = state.myPosition
      state.db = payload.map((station) => {
        station['distance'] = calculateDistance(station.position.lat, station.position.lon, lat, lng)
        return station
      })
      console.log(state.db)

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

export const { setMyPosition } = stationsSlice.actions
export default stationsSlice.reducer
