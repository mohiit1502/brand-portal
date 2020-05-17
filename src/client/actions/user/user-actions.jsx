const saveUserInitiated = () => {
  return {type: "SAVE_USER_INITIATED"};
};

const saveUserCompleted = () => {
  return {type: "SAVE_USER_COMPLETED"};
};


export {saveUserInitiated, saveUserCompleted};
