import {DISPATCH_FILTER, DISPATCH_WIDGET_ACTION} from "./../../actions/dashboard/dashboard-actions";

const initialState = {
  filter: {},
  widgetAction: false
};

const dashboardReducer = (store = initialState, action) => {
  switch (action.type) {
    case DISPATCH_WIDGET_ACTION:
      return {...store, ...action.value};
    case DISPATCH_FILTER:
      return {...store, ...action.value};
    default:
      return store || { };
  }
};

export default dashboardReducer;
