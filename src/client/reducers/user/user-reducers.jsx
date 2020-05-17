const userEdit = (store, action) => {
  switch (action.type) {
    case "SAVE_USER_INITIATED": {
      return { save: true };
    }
    case "SAVE_USER_COMPLETED": {
      return { save: false };
    }
    default: {
      return store ||  {
        save: false
      };
    }
  }
};

export {userEdit};
