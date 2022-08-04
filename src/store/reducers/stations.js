import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  db: [],
  filters: {},
  filtered: [],
  isReady: false,
  isError: false,
  isLoading: true,
}

export const getStations = createAsyncThunk('stations/get', async () => {
  const {data} = await axios.get('api/stations');
  return data;
})

const stationsSlice = createSlice({
  name: 'stations',
  initialState,
  reducers: {
    
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