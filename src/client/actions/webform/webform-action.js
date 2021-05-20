export const DISPATCH_WEB_FORM_STATE = "DISPATCH_WEB_FORM_STATE";

export const dispatchWebformState = state => {
  return {type: DISPATCH_WEB_FORM_STATE, value: {state}};
};
