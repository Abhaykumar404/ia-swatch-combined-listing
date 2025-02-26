import { createSlice } from "@reduxjs/toolkit";
import { initialCreateSwatch } from "../../utils/constant";
import merge from "lodash/merge";

const createSwatchSlice = createSlice({
  name: "create-swatch",
  initialState: initialCreateSwatch,
  reducers: {
    setGroupName: (state, action) => {
      state.groupName = action.payload;
      state.hasUnsavedChanges = true;
    },
    setOptionName: (state, action) => {
      state.optionName = action.payload;
      state.hasUnsavedChanges = true;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
      state.hasUnsavedChanges = true;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
      state.hasUnsavedChanges = true;
    },
    setDisplayGroup: (state, action) => {
      state.displayGroup = action.payload;
      state.hasUnsavedChanges = true;
    },
    setProductPageStyle: (state, action) => {
      state.productPageStyle = action.payload;
      state.hasUnsavedChanges = true;
    },
    setProductPageImageSource: (state, action) => {
      state.productPageImageSource = action.payload;
      state.hasUnsavedChanges = true;
    },
    setCollectionPageStyle: (state, action) => {
      state.collectionPageStyle = action.payload;
      state.hasUnsavedChanges = true;
    },
    setCollectionPageImageSource: (state, action) => {
      state.collectionPageImageSource = action.payload;
      state.hasUnsavedChanges = true;
    },
    setWholeState: (state, action) => {
      merge(state, action.payload);
      state.hasUnsavedChanges = true;
    },
    resetUnsavedChanges: (state) => {
      state.hasUnsavedChanges = false;
    },
  },
});

export default createSwatchSlice.reducer;
export const {
  setGroupName,
  setOptionName,
  setSelectedProduct,
  setStatus,
  setDisplayGroup,
  setProductPageStyle,
  setProductPageImageSource,
  setCollectionPageStyle,
  setCollectionPageImageSource,
  setWholeState,
  resetUnsavedChanges,
} = createSwatchSlice.actions;
