import { configureStore } from "@reduxjs/toolkit";
import globalStateSlice from "./slices/global-state-slice";
import createSwatchSlice from "./slices/swatch-slice"
const store = configureStore({
  reducer: {
    swatch: createSwatchSlice,
    globalState: globalStateSlice,
  },
});

export default store;
