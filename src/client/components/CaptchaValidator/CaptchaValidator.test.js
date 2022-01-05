/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React from "react";
import {create, act} from 'react-test-renderer';
import Http from "../../utility/Http";
import CaptchaValidator from "./";
import {setupFetchStub} from "../../utility/TestingUtils";

const setUp = () => {
  let tree;
  act(() => {
    tree = create(<CaptchaValidator/>)
  });
  return tree;
};

describe("CaptchaValidator test container", () => {
  let wrapper;

  describe("CaptchaValidator renders without error", () => {
    afterAll(() => {
      global.fetch && global.fetch.mockClear();
      delete global.fetch;
    })
    beforeEach(() => {
      jest.restoreAllMocks();
      jest.resetAllMocks();
    });
    it("should render the Captcha successfully when enabled", () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {enableCaptcha: true, sitekey: "sitekey"}}));
      wrapper = setUp();
      const tree = wrapper.toJSON();
      expect(tree).toMatchSnapshot();
    });
    it("verify Captcha when disabled", () => {
      jest.spyOn(Http, "crud").mockImplementation(() => Promise.resolve({body: {enableCaptcha: false, sitekey: "sitekey"}}));
      wrapper = setUp();
      const tree = wrapper.toJSON();
      expect(tree).toMatchSnapshot();
    });
    it("tests API failure scenario", () => {
      global.fetch = jest.fn().mockImplementation(setupFetchStub({}));
      wrapper = setUp();
      const tree = wrapper.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
