import React from 'react';
import Alert from './Alert';
import {shallow} from "enzyme";
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {findByTestAttribute,testStore} from "../../utility/TestingUtils";

configure({ adapter: new Adapter() });

let props;
let store;

const setUp = () => {
  store = testStore();
  const component = shallow(
        <Alert store={store} {...props}/>).dive()
  return component;
}

describe('Alert', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = setUp();
    });
    describe("Should render without error",() => {

      it("Should render Alert Image",() => {
       const alertImage = findByTestAttribute(wrapper,"alert-logo")
       expect(alertImage.length).toBe(1);
     });

     it("Should render Alert Header",() => {
       const alertHeader = findByTestAttribute(wrapper,"alert-header");
       expect(alertHeader.length).toBe(1);
     });

     it("Should render Alert Description",() => {
       const alertDescription = findByTestAttribute(wrapper,"alert-description");
       expect(alertDescription.length).toBe(1);
     });

     it("Should render Cancel Button",() => {
       const cancelButton = findByTestAttribute(wrapper,"cancel-button");
       expect(cancelButton.length).toBe(1);

     });

     it("Should render Discard Button",() => {
       const discardButton = findByTestAttribute(wrapper,"discard-button");
       expect(discardButton.length).toBe(1);
     });
   });

   describe("On Click Tests",() => {

     it("Cancel Button Click",() => {
       const cancelButton = findByTestAttribute(wrapper,"cancel-button");
       cancelButton.simulate('click');
       const actions = store.getActions();
       expect(actions).toStrictEqual([
         { type: 'DISCARD_CHANGES', value: { shouldDiscard: false } },
         { type: 'TOGGLE_MODAL', value: 'hide' }
       ]);
     });

     it("Discard Button Click",() => {
       const discardButton = findByTestAttribute(wrapper,"discard-button");
       discardButton.simulate('click');
       const actions = store.getActions();
       expect(actions).toStrictEqual([
         { type: 'DISCARD_CHANGES', value: { shouldDiscard: true } },
         { type: 'TOGGLE_MODAL', value: 'hide' }
       ]);
     })
   })
});
