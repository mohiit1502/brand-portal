export const DISPATCH_COMPANY_STATE = "DISPATCH_COMPANY_STATE";
export const DISPATCH_BRAND_STATE = "DISPATCH_BRAND_STATE";
export const DISPATCH_NEW_REQUEST = "DISPATCH_NEW_REQUEST";
export const DISPATCH_STEPS = "DISPATCH_STEPS";

export const dispatchCompanyState = companyState => {
    return {type: DISPATCH_COMPANY_STATE, value: {companyState}};
};

export const dispatchBrandState = brandState => {
    return {type: DISPATCH_BRAND_STATE, value: {brandState}};
};

export const dispatchSteps = steps => {
    return {type: DISPATCH_STEPS, value: {steps}};
};

export const dispatchNewRequest = isNew => {
    return {type: DISPATCH_NEW_REQUEST, value: {isNew}};
};
