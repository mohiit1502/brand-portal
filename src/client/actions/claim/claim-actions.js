export const DISPATCH_CLAIMS = "DISPATCH_CLAIMS";

export const dispatchClaims = claims => {
    return {type: DISPATCH_CLAIMS, value: claims};
};
