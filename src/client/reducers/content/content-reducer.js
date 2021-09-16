import {DISPATCH_FORM_FIELD_META_DATA, DISPATCH_MODALS_META_DATA, TOGGLE_IMAGE_VIEWER} from "../../actions/content/content-actions";

const initialState =  {
  viewerState: {show: false, imageSrc: ""}
};

const contentReducer = (store = initialState, action) => {
  switch (action.type) {
    case TOGGLE_IMAGE_VIEWER:
    case DISPATCH_FORM_FIELD_META_DATA:
    case DISPATCH_MODALS_META_DATA:
      return {...store, ...action.value, metadata: {...store.metadata, ...action.value.metadata}};
    default:
      return store || { };
  }
};

export default contentReducer;
