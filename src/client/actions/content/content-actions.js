export const TOGGLE_IMAGE_VIEWER = "TOGGLE_IMAGE_VIEWER";
export const DISPATCH_META_DATA = "DISPATCH_META_DATA";
//to do : add disoatch action mx here
export const toggleImageViewer = viewerState => {
    return {type: TOGGLE_IMAGE_VIEWER, value: {viewerState}};
};

export const dispatchMetadata = metadata => {
  return {type: DISPATCH_META_DATA, value: {metadata}};
}
