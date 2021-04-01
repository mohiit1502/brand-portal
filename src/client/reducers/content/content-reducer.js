import {DISPATCH_META_DATA, TOGGLE_IMAGE_VIEWER} from "../../actions/content/content-actions";
//todo import it 
const initialState =  {
  viewerState: {show: false, imageSrc: ""}
};

const helpReducer = (store = initialState, action) => {
  switch (action.type) {
    case TOGGLE_IMAGE_VIEWER:
    case DISPATCH_META_DATA:
      ///dispatchmpconfigue
      return {...store, ...action.value};
    default:
      return store || { };
  }
};

export default helpReducer;
