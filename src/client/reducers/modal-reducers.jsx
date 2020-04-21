import {TOGGLE_ACTIONS} from "../actions/modal-actions";

const modal = (store, action) => {
  switch (action.type) {
    case "TOGGLE_MODAL": {
      const enable = action.value ? (action.value === TOGGLE_ACTIONS.SHOW) : !store.enable;
      return { enable, template: action.templateName};
    }
    default: {
      return store || {
        enable: false,
        template: null
      };
    }
  }
};

export {modal};
