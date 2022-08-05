import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { requestStations } from "../../utils/api";

const initialState = {
  db: [],
  filters: {},
  filtered: [],
  isReady: false,
  isError: false,
  isLoading: true,
}

export const getStations = createAsyncThunk('stations/get', async () => await requestStations());

const stationsSlice = createSlice({
  name: 'stations',
  initialState,
  reducers: {
    filterStations: (state, {payload}) => {
      state.filtered = state.db;
    }
  },
  extraReducers: {
    [getStations.fulfilled]: (state, {payload}) => {
      state.db = payload;
      state.isReady = true;
      state.isLoading = false;
    },
    [getStations.pending]: (state) => {
      state.isLoading = true;
    },
    [getStations.rejected]: (state) => {
      state.isLoading = false;
      state.isError = true;
      state.isReady = false;
    }
  }
})

export default stationsSlice.reducer;