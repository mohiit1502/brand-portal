export const DISPATCH_WIDGET_ACTION = "DISPATCH_WIDGET_ACTION";

export const dispatchWidgetAction = widgetAction => {
    return {type: DISPATCH_WIDGET_ACTION, value: {widgetAction}};
};
