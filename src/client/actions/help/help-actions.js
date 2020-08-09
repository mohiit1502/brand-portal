export const TOGGLE_IMAGE_VIEWER = "TOGGLE_IMAGE_VIEWER";

export const toggleImageViewer = viewerState => {
    return {type: TOGGLE_IMAGE_VIEWER, value: {viewerState}};
};
