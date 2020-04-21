const userEdit = (store, action) => {
  switch (action.type) {
    case "SAVE_USER": {
      return { save: true };
    }
    default: {
      return store ||  {
        save: false
      };
    }
  }
};

export {userEdit};
