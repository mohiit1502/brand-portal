export const SAVE_USER_INITIATED = "SAVE_USER_INITIATED";
export const SAVE_USER_COMPLETED = "SAVE_USER_COMPLETED";
export const UPDATE_PROFILE = "UPDATE_PROFILE";
export const DISPATCH_LOGOUT_URL = "DISPATCH_LOGOUT_URL";


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
