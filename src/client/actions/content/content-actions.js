export const TOGGLE_IMAGE_VIEWER = "TOGGLE_IMAGE_VIEWER";
export const DISPATCH_FORM_FIELD_META_DATA = "DISPATCH_FORM_FIELD_META_DATA";
export const DISPATCH_MODALS_META_DATA = "DISPATCH_MODALS_META_DATA";
export const DISPATCH_SECTIONS_META_DATA = "DISPATCH_SECTIONS_META_DATA";

export const toggleImageViewer = viewerState => {
    return {type: TOGGLE_IMAGE_VIEWER, value: {viewerState}};
};

export const dispatchFormFieldMetadata = metadata => {
  return {type: DISPATCH_FORM_FIELD_META_DATA, value: {metadata}};
};

export const dispatchModalsMetadata = metadata => {
  return {type: DISPATCH_MODALS_META_DATA, value: {metadata}};
};

export const dispatchSectionsMetadata = metadata => {
  return {type: DISPATCH_SECTIONS_META_DATA, value: {metadata}};
};
