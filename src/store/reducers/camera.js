import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  center: [30.523333, 50.450001],
  zoom: 14,
  isAutofocus: true,
  stylesVisibility: {
    trafficFlow: true,
    trafficIncidents: true,
    poi: false,
  },
}

const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    toggleAutofocus(state) {
      state.isAutofocus = !state.isAutofocus
    },
    updatePosition(state, { payload: { center, zoom } }) {
      state.center = center
      state.zoom = zoom
    },
    updateStylesVisibility(state, { payload: { name, value } }) {
      state.stylesVisibility[name] = value
    },
  },
})

export const { updatePosition, updateStylesVisibility, toggleAutofocus } = cameraSlice.actions
export default cameraSlice.reducer
