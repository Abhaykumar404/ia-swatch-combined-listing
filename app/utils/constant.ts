import {
  collectPageStyleOptions,
  displayGroupOptions,
  imageSourceOptions,
  productPageStylesOptions,
  statusOption,
} from "../components/Select/data";

export const initialCreateSwatch = {
  hasUnsavedChanges: false,
  id: "",
  name: "Create swatch",
  shop: "",
  published: false,
  groupName: "",
  optionName: "",
  selectedProduct: [],
  status: statusOption[0].value,
  displayGroup: displayGroupOptions[0].value,
  productPageStyle: productPageStylesOptions[0].value,
  productPageImageSource: imageSourceOptions[0].value,
  collectionPageStyle: collectPageStyleOptions[0].value,
  collectionPageImageSource: imageSourceOptions[0].value,
};


export const globalStateInitialData = {
  discardState: initialCreateSwatch,
  listOfErrors: {},
};
