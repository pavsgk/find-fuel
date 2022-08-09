import { configureStore } from '@reduxjs/toolkit'
import camera from './reducers/camera'
import stations from './reducers/stations'

stations

const store = configureStore({
  reducer: {
    camera,
    stations,
  },
})

export default store
