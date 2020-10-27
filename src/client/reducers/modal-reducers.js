import {TOGGLE_ACTIONS, DISCARD_CHANGES} from "../actions/modal-actions";

const modal = (store, action) => {
  switch (action.type) {
    case "TOGGLE_MODAL": {
      const enable = action.value ? (action.value === TOGGLE_ACTIONS.SHOW) : !store.enable;
      const storeData = { enable, shouldDiscard: store.shouldDiscard, ...action};
      if (action.data) {
        storeData.data = action.data;
      }
      return storeData;
    }
    case DISCARD_CHANGES:
      return {...store, ...action.value};
    default: {
      return store || {
        enable: false,
        template: null
      };
    }
  }
};

export {modal};
