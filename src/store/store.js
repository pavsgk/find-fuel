
import { configureStore } from "@reduxjs/toolkit";
import camera from "./reducers/camera"

const store = configureStore({
  reducer: {
    camera
  }
})

export default store;