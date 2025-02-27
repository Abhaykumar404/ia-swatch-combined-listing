import { configureStore } from "@reduxjs/toolkit";
import globalStateSlice from "./slices/global-state-slice";
import createCombinedListingSlice from "./slices/swatch-slice"
const store = configureStore({
  reducer: {
    swatch: createCombinedListingSlice,
    globalState: globalStateSlice,
  },
});

export default store;
