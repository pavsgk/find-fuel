import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { requestStations } from "../../utils/api";
import { calculateDistance } from "../../utils/utils";

const initialState = {
  db: [],
  mark: [50.450001, 30.523333],
  filters: {},
  filtered: [],
  isReady: false,
  isError: false,
  isLoading: true,
}

export const getStations = createAsyncThunk('stations/get', async () => {
  const response = await requestStations();
  return response.results;
});

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
      const [lat, long] = state.mark;
      console.log(lat, long)
      state.db = payload.map(station => {
        station['distance'] = calculateDistance(station['latitude'], station['longitude'], lat, long);
        return station;
      });

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