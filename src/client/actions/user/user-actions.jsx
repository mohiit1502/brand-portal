const saveUserInitiated = () => {
  return {type: "SAVE_USER_INITIATED"};
};

const saveUserCompleted = () => {
  return {type: "SAVE_USER_COMPLETED"};
};

const updateUserProfile = meta => {
  return {type: "UPDATE_PROFILE", value: meta};
};


export {saveUserInitiated, saveUserCompleted, updateUserProfile};
