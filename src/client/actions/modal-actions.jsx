export const TOGGLE_ACTIONS = {
  SHOW: "show",
  HIDE: "hide"
};

export const toggleModal = (toggleAction, meta) => {
  return {type: "TOGGLE_MODAL", value: toggleAction, templateName: meta.templateName};
};


