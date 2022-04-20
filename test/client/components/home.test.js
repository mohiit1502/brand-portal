import React, {useRef} from "react";
import ReactDOM from "react-dom";
import Home from "../../../src/client/components/home/home";
import 'regenerator-runtime';
import {testStore} from "../../../src/client/utility/TestingUtils";
import renderer from "react-test-renderer";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
// import FORMFIELDCONFIG from "../../../src/client/config/formsConfig/form-field-meta";
import FORMFIELDMOCK from "../mocks/formFeildMock";
import MODALSMETA from "../../../src/client/config/contentDescriptors/modals-meta"
import homePageMocks from "../mocks/homePageMocks";
import profile from "../mocks/userProfile";
import portalRegUserProfile from "../mocks/portalRegUserProfile";


let store;
const setUp = (props) => {
  const mockStore = {
    modal:{
      enable:false,
      template:null
    },
    content:{
      metadata: {...FORMFIELDMOCK, ...MODALSMETA}
    },
    user: {profile}
  };
  store = testStore(mockStore);
  return renderer.create(<Provider store={store}><BrowserRouter><Home {...props} /></BrowserRouter></Provider>);
};

const setUp2 = (props) => {
  const mockStore = {
    modal:{
      enable:false,
      template:null
    },
    content:{
      metadata: {...FORMFIELDMOCK, ...MODALSMETA}
    },
    user: {portalRegUserProfile}
  };
  store = testStore(mockStore);
  return renderer.create(<Provider store={store}><BrowserRouter><Home {...props} /></BrowserRouter></Provider>);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});

describe("Home Tests", () => {

  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it("renders without error", () => {
    const mRef = {current: document.createElement("div")};
    useRef.mockReturnValue(mRef);
    wrapper = setUp({homePageMocks});
    const tree = wrapper.toJSON();
    expect(tree).toMatchSnapshot();
  });

  // it("renders onboarding screen without error", () => {
  //   const mRef = {current: document.createElement("div")};
  //   useRef.mockReturnValue(mRef);
  //   wrapper = setUp2({
  //     ...homePageMocks,
  //     userProfile:portalRegUserProfile
  //   });
  //   const tree = wrapper.toJSON();
  //   expect(tree).toMatchSnapshot();
  // });
});




describe("Home", () => {
  let component;
  let container;

  beforeEach(() => {
    container = document.createElement("div");
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
  });

  it("has expected content with deep render", () => {
    const initialState = {
      checkBox: { checked: false },
      number: { value: 999 }
    };
    expect(true).toBe(true);

    // const store = createStore(rootReducer, initialState);
    //
    // component = ReactDOM.render(
    //   <Provider store={store}>
    //     <BrowserRouter>
    //       <Home />
    //     </BrowserRouter>
    //   </Provider>,
    //   container
    // );
    //
    // expect(component).to.not.be.false;
  });
});
