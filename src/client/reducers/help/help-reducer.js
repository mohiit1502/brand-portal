import {TOGGLE_IMAGE_VIEWER} from "./../../actions/help/help-actions";

const initialState =  {
  viewerState: {show: false, imageSrc: ""}
};

const helpReducer = (store = initialState, action) => {
  switch (action.type) {
    case TOGGLE_IMAGE_VIEWER:
      return {...store, ...action.value};
    default:
      return store || { };
  }
};

export default helpReducer;
