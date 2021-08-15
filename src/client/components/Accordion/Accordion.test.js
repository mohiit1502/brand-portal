import React from 'react';
import Accordion from './Accordion';
import {findByTestAttribute, testStore} from "../../utility/TestingUtils";
import {configure, shallow} from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
let props;
let store;

const setUp = () => {
  props = {
    data:{
      simple: false,
      question:"This is a test question"
    },
    expanded:true
  };
  store = testStore();
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
  });
});
