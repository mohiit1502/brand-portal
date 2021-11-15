import configureMockStore from "redux-mock-store";

export const findByTestAttribute = (component, attr) => component.find(`[data-test="${attr}"]`);
export const testStore = state => configureMockStore()(state);
