import {DISPATCH_WIDGET_ACTION} from "./../../actions/dashboard/dashboard-actions";

const initialState =  {
  widgetAction: false
};

const dashboardReducer = (store = initialState, action) => {
  switch (action.type) {
    case DISPATCH_WIDGET_ACTION:
      return {...store, ...action.value};
    default:
      return store || { };
  }
};

export default dashboardReducer;
