/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React from "react";
import {act} from "react-test-renderer";
import {mount} from "enzyme";
import toJson from "enzyme-to-json";
import Http from "../../utility/Http";
import CaptchaValidator from "./";
import {setupFetchStub} from "../../utility/TestingUtils";

const setUp = async () => {
  let tree;
  await act( async () => tree = mount(<CaptchaValidator onChange={jest.fn()}/>));
  return tree
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
    it("should render the Captcha successfully when enabled", async () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {enableCaptcha: true, sitekey: "sitekey"}}));
      wrapper = await setUp();
      wrapper.update();
      wrapper.find("ReCAPTCHA").prop("onExpired")();
      wrapper.update();
      const tree = toJson(wrapper);
      expect(tree).toMatchSnapshot();
    });
    it("verify Captcha when disabled", () => {
      jest.spyOn(Http, "crud").mockImplementation(() => Promise.resolve({body: {enableCaptcha: false, sitekey: "sitekey"}}));
      wrapper = setUp();
      const tree = toJson(wrapper);
      expect(tree).toMatchSnapshot();
    });
    it("tests API failure scenario", () => {
      global.fetch = jest.fn().mockImplementation(setupFetchStub({}));
      wrapper = setUp();
      const tree = toJson(wrapper);
      expect(tree).toMatchSnapshot();
    });
  });
});
