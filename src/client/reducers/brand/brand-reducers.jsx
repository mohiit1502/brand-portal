import {DISPATCH_BRANDS} from "../../actions/brand/brand-actions";

const brandEdit = (store, action) => {
  switch (action.type) {
    case DISPATCH_BRANDS:
      return {...store, ...action.value};
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
