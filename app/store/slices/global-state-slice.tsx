import { createSlice } from "@reduxjs/toolkit";
import { globalStateInitialData } from "../../utils/constant";
import merge from "lodash/merge";

const globalStateSlice = createSlice({
  name: "globalState",
  initialState: globalStateInitialData,
  reducers: {
    setDiscardedState: (state, action) => {
      state.discardState = action.payload;
    },
    setListOfErrors: (state, action) => {
      state.listOfErrors = action.payload;
    },
    setWholeGlobalState: (state, action) => {
      merge(state, action.payload);
    },
  },
});

export default globalStateSlice.reducer;
export const { setDiscardedState, setListOfErrors, setWholeGlobalState } = globalStateSlice.actions;
