export const TOGGLE_ACTIONS = {
  SHOW: "show",
  HIDE: "hide"
};

export const toggleModal = toggleAction => {
  return {type: "TOGGLE_MODAL", value: toggleAction};
};
