export const DISPATCH_WIDGET_ACTION = "DISPATCH_WIDGET_ACTION";
export const DISPATCH_FILTER = "DISPATCH_FILTER";

export const dispatchWidgetAction = widgetAction => {
    return {type: DISPATCH_WIDGET_ACTION, value: {widgetAction}};
};

export const dispatchFilter = filter => {
  return {type: DISPATCH_FILTER, value: {filter}}
}
