/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */

import React from 'react';
import Accordion from './Accordion';
import {findByTestAttribute, testStore} from "../../utility/TestingUtils";
import {configure, shallow} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import mixpanel from "../../utility/mixpanelutils";

configure({ adapter: new Adapter() });
let props;
let store;

const setUp = () => {
  props = {
    children: "This is test children",
    data:{
      simple: false,
      question:"This is a test question"
    },
    expanded:true,
    setExpanded: () => {
      console.log("This is a test function");
    }
  };
  store = testStore({});
  const component = shallow(
    <Accordion store={store} {...props}/>);
  return component;
}


describe('Accordion', () => {

  let wrapper;
  beforeEach(() => {
    wrapper = setUp();
  });
  describe("Should render without error",()=>{
    it("Accordion Button Successfully Rendered",() => {
      const accordionButton = findByTestAttribute(wrapper,"accordion-button");
      expect(accordionButton.length).toBe(1);
      expect(accordionButton.text()).toBe("This is a test question")
    });

    it("Accordion Button Panel Successfully Rendered",() => {
      const accordionButtonPanel = findByTestAttribute(wrapper,"accordion-buttonPanel");
      expect(accordionButtonPanel.length).toBe(1);
    });

    it("Accordion Button Panel Should not render with empty props",() => {
      const testProps = {
        data: {
          simple:true
        }
      };
      const component = shallow(
        <Accordion store={store} {...testProps}/>);
      const accordionButtonPanel = findByTestAttribute(component,"accordion-buttonPanel");
      expect(accordionButtonPanel.length).toBe(0);
    })

    it("Accordion Button to be rendered",() => {
      const testProps = {
        children: "This is test children",
        data:{
          simple: false,
          question:"This is a test question"
        },
        expanded:true,
        setExpanded: () => {
          console.log("This is a test function");
        }
      };
      const component = shallow(
        <Accordion store={store} {...testProps}/>);
      const accordionButton = findByTestAttribute(component,"accordion-button");
      expect(accordionButton.length).toBe(1);
      expect(accordionButton.props().children).toBe("This is a test question");
    })

    it("Accordion Button Simulate click",() => {
      const testProps = {
        children: "This is test children",
        data:{
          simple: false,
          question:"This is a test question",
          id: "testId"
        },
        expanded:false,
        setExpanded: () => {
          console.log("This is a test function");
        }
      };
      const component = shallow(
        <Accordion store={store} {...testProps}/>);
      const accordionButton = findByTestAttribute(component,"accordion-button");
      mixpanel.trackEvent = jest.fn();
      accordionButton.simulate('click');
      expect(mixpanel.trackEvent).toHaveBeenCalled();
    });

    it("Accordion Button Simulate click without question",() => {
      const testProps = {
        children: "This is test children",
        data:{
          simple: false,
          id: "testId"
        },
        expanded:false,
        setExpanded: () => {
          console.log("This is a test function");
        }
      };
      const component = shallow(
        <Accordion store={store} {...testProps}/>);
      const accordionButton = findByTestAttribute(component,"accordion-button");
      mixpanel.trackEvent = jest.fn();
      accordionButton.simulate('click');
      expect(mixpanel.trackEvent).toHaveBeenCalled();
    });

    it("Accordion Button Simulate click expanded true",() => {
      const testProps = {
        children: "This is test children",
        data:{
          simple: false,
          id: "testId"
        },
        expanded:true,
        setExpanded: () => {
          console.log("This is a test function");
        }
      };
      const component = shallow(
        <Accordion store={store} {...testProps}/>);
      const accordionButton = findByTestAttribute(component,"accordion-button");
      mixpanel.trackEvent = jest.fn();
      accordionButton.simulate('click');
      expect(mixpanel.trackEvent).toBeCalledTimes(0);
    });
  });
});
