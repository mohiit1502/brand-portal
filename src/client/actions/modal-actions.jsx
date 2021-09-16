export const DISCARD_CHANGES = "DISCARD_CHANGES";
export const TOGGLE_ACTIONS = {
  SHOW: "show",
  HIDE: "hide"
};

export const toggleModal = (toggleAction, meta) => {
  let action = {type: "TOGGLE_MODAL", value: toggleAction};
  action = meta ? {...action, ...meta} : action;
  return action;
};

export const dispatchDiscardChanges = shouldDiscard => {
  return {type: "DISCARD_CHANGES", value: {shouldDiscard}};
};

