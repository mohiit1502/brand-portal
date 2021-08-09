import {DISPATCH_META_DATA, TOGGLE_IMAGE_VIEWER} from "../../actions/content/content-actions";

const initialState =  {
  viewerState: {show: false, imageSrc: ""}
};

const contentReducer = (store = initialState, action) => {
  switch (action.type) {
    case TOGGLE_IMAGE_VIEWER:
    case DISPATCH_META_DATA:
      return {...store, ...action.value};
    default:
      return store || { };
  }
};

export default contentReducer;
