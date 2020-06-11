const brandEdit = (store, action) => {
  switch (action.type) {
    case "SAVE_BRAND_INITIATED": {
      return { save: true };
    }
    case "SAVE_BRAND_COMPLETED": {
      return { save: false };
    }
    default: {
      return store ||  {
        save: false
      };
    }
  }
};

export {brandEdit};
