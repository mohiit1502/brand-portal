export const TOGGLE_ACTIONS = {
  SHOW: "show",
  HIDE: "hide"
};

export const toggleModal = (toggleAction, meta) => {
  const action = {type: "TOGGLE_MODAL", value: toggleAction};

  if (meta) {
    if (meta.templateName) {
      action.templateName = meta.templateName;
    }

    if (meta.data) {
      action.data = meta.data;
    }
  }

  return action;
};

