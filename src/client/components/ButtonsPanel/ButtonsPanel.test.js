/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */

import React from "react";
import ButtonsPanel from "./ButtonsPanel";
import {configure, shallow} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import {findByTestAttribute, testStore} from "../../utility/TestingUtils";
import ContentRenderer from "../../utility/ContentRenderer";

configure({ adapter: new Adapter() });
let props;
let store;

const setUp = () => {
  props = {
    parentRef: {
      onClickTest: () => {
        console.log("test on click");
      }
    },
    buttons: {
      testButton1: {
        onClick: "onClickTest",
        text: "Test Button",
        type: "button",
        textObj: "{condition:{a:b}}"
      },
      testButton2: {
        onClick: "onClickTest",
        text: "Test Button",
        type: "button",
        handlerArg: "test"
      }
    }
  };
  store = testStore({});
  const component = shallow(
    <ButtonsPanel store={store} {...props}/>);
  return component;
}


describe("ButtonsPanel", () => {

  let wrapper;
  beforeEach(() => {
    wrapper = setUp();
  });

  it('button should not be empty', function () {
    ContentRenderer.evaluateRenderDependency = jest.fn();
    let buttonPanel = findByTestAttribute(wrapper,"button-panel");
    const buttonDiv = findByTestAttribute(wrapper,"button-div");
    expect(buttonPanel.length).toBe(1);
    expect(buttonDiv.length).toBe(1);
    wrapper.find("button").at(1).simulate("click");
    wrapper.update();
    props.bareButton = true;
    wrapper = shallow(
      <ButtonsPanel store={store} {...props}/>);
    ContentRenderer.evaluateRenderDependency = jest.fn();
    buttonPanel = findByTestAttribute(wrapper,"button-panel");
    expect(buttonPanel.length).toBe(0);
  });

  it('button should be null', function () {
    props.parentRef = null;
    wrapper = shallow(
      <ButtonsPanel store={store} {...props}/>);
    ContentRenderer.evaluateRenderDependency = jest.fn();
    let buttonPanel = findByTestAttribute(wrapper,"button-panel");
    const buttonDiv = findByTestAttribute(wrapper,"button-div");
    expect(buttonPanel.length).toBe(1);
    expect(buttonDiv.length).toBe(1);
  });

});
