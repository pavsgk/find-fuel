import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  defaultCenter: [50.450001, 30.523333],
  defaultCenterZoom: 14,
}

const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    updatePosition(state, {payload: {center, zoom}}) {
      state.defaultCenter = center;
      state.defaultZoom = zoom;
    }
  }
})

export const { updatePosition } = cameraSlice.actions;
export default cameraSlice.reducer;