import {DISPATCH_BRANDS} from "../brand/brand-actions";

export const SAVE_USER_INITIATED = "SAVE_USER_INITIATED";
export const SAVE_USER_COMPLETED = "SAVE_USER_COMPLETED";
export const UPDATE_PROFILE = "UPDATE_PROFILE";
export const DISPATCH_LOGOUT_URL = "DISPATCH_LOGOUT_URL";
export const UPDATE_FORM_VALUES = "UPDATE_USER_FORM_VALUES";
export const UPDATE_FORM_ERRORS = "UPDATE_USER_FORM_ERRORS";
export const DISPATCH_USERS = "DISPATCH_USERS";

export const saveUserInitiated = () => {
  return {type: "SAVE_USER_INITIATED"};
};

export const saveUserCompleted = () => {
  return {type: "SAVE_USER_COMPLETED"};
};

export const updateUserProfile = meta => {
  return {type: "UPDATE_PROFILE", value: {profile: meta}};
};

export const dispatchLogoutUrl = logoutUrl => {
  return {type: "DISPATCH_LOGOUT_URL", value: {logoutUrl}};
};

export const updateFormValues = formValues => {
  return {type: "UPDATE_FORM_VALUES", value: {formValues}};
};

export const updateFormErrors = formErrors => {
  return {type: "UPDATE_FORM_ERRORS", value: {formErrors}};
};

export const dispatchUsers = users => {
  return {type: DISPATCH_USERS, value: users};
};

