export const DISPATCH_WIDGET_ACTION = "DISPATCH_WIDGET_ACTION";
export const DISPATCH_FILTER = "DISPATCH_FILTER";
export const DISPATCH_CUSTOM_DATE = "DISPATCH_CUSTOM_DATE";

export const dispatchWidgetAction = widgetAction => {
    return {type: DISPATCH_WIDGET_ACTION, value: {widgetAction}};
};

export const dispatchFilter = filter => dispatch => {
  dispatch({type: DISPATCH_FILTER, value: {filter}});
  return Promise.resolve();
};

export const dispatchCustomDate = customDate => {
  return {type: DISPATCH_CUSTOM_DATE, value: {customDate}};
};
