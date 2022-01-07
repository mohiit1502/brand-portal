import React, {useRef} from "react";
import {mount} from "enzyme";
import toJson from "enzyme-to-json";
import ApplicationDetails from "./";
import Http from "../../utility/Http";
import applicationDetails from "../../../../test/client/mocks/applicationDetails";
import userProfile from "../../../../test/client/mocks/userProfile";
import org from "../../../../test/client/mocks/org";
import brand from "../../../../test/client/mocks/brand";

const setUp = (props) => {
  return mount(props ? <ApplicationDetails {...props} /> : <ApplicationDetails />);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});

describe("ApplicationDetails renders without error", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it("should render the application details successfully", () => {
    jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: applicationDetails}));
    const mRef = {current: document.createElement("div")};
    useRef.mockReturnValue(mRef);
    wrapper = setUp({user: userProfile, org, brand});
    const tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();
  });
});
