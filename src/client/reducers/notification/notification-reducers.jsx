
const notification = (store, action) => {
  const value = action.value;

  switch (action.type) {
    case "SHOW_NOTIFICATION": {
      return {...value, show: true};
    }
    default: {
      return store || {
        show: false
      };
    }
  }
};


export {notification};
