export const DISCARD_CHANGES = "DISCARD_CHANGES";
export const TOGGLE_ACTIONS = {
  SHOW: "show",
  HIDE: "hide"
};

export const toggleModal = (toggleAction, meta) => {
  let action = {type: "TOGGLE_MODAL", value: toggleAction};

  if (meta) {
    action = {...action, ...meta};
//     if (meta.templateName) {
//       action.templateName = meta.templateName;
//     }

    // if (meta.data) {
    //   action.data = meta.data;
    // }
  }

  return action;
};

export const dispatchDiscardChanges = shouldDiscard => {
  return {type: "DISCARD_CHANGES", value: {shouldDiscard}};
};

