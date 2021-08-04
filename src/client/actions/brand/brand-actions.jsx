export const DISPATCH_BRANDS = "DISPATCH_BRANDS";

const saveBrandInitiated = () => {
  return {type: "SAVE_BRAND_INITIATED"};
};

const saveBrandCompleted = () => {
  return {type: "SAVE_BRAND_COMPLETED"};
};

export const dispatchBrands = brands => {
  return {type: DISPATCH_BRANDS, value: brands};
};

export {saveBrandInitiated, saveBrandCompleted};
