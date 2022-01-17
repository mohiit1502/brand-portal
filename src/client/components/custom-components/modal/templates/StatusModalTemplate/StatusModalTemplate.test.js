import React, {useRef} from "react";
import StatusModalTemplate from "./StatusModalTemplate";
import toJson from "enzyme-to-json";
import {mount} from "enzyme";
import {Provider} from "react-redux";
import MockNextContext from "../../../../../../../test/client/utility/MockNextContext"
import {clearKeys, testStore} from "../../../../../utility/TestingUtils";
import PropTypes from "prop-types";
import Http from "../../../../../utility/Http";
import Cookies from "electrode-cookies";


let props;
let store;
jest.mock("electrode-cookies");

const setUp = (props) => {
  store = testStore({
    company: {
      onboardingDetails:{}
    },
    user:{
      profile:{
        email: "test@mailinator.com"
      }
    },
    content:{
      metadata:{
        MODALSCONFIG : {}
      }
    }
  });
  return mount(props ? <Provider store={store}><MockNextContext pathname="/help"><StatusModalTemplate {...props} /></MockNextContext></Provider> : <Provider store={store}><MockNextContext><StatusModalTemplate /></MockNextContext></Provider>);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});



describe("StatusModalTemplate", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  it("renders without error", () => {
    const handlers = {

      toggleModal: ()=>{},
      showNotification: ()=>{},
      dispatchOnboardingDetails: ()=>{},
      updateUserProfile: ()=>{},

    };

    props = {
      user: {
        profile:{
          email: "test@mailinator.com"
        }
      },
      onboardingDetails:{},
      modalsMeta:{},
      meta: {
        "TYPE": "NOTIFICATION",
        "PRIMARY_ACTION": {
          "text": "Start",
          "action": "hideModal",
          "classes": "my-4"
        },
        "ADDITIONAL_ACTION": {
          "text": "Log out",
          "classes": "mp-blue",
          "action": "logout"
        },
        TITLE: {
          "onClick":"",
          "content": {
            "para1": {
              "text": "test",
              "classes": "",
              "onClick":"updateCompanyDetails",
              "dynamicReplacementConfig": {"__emailPlaceholder__": "profile.email"}
            },
            "para2": {
              "text": "test",
              "classes": "",
              "onClick":"updateCompanyDetails",
              "dynamicReplacementConfig": {"__emailPlaceholder__": "org"}
            },
            "button1": {
              "icon": "EditOutlinedIcon",
              "classes": "col btn btn-primary px-0",
              "buttonText": "Edit Application",
              "onClick": "dispatchUserProfile",
              "renderCondition": "{\"keyPath\": \"orgStatus\", \"value\": \"on_hold\"}"
            }
            }
        },
        MESSAGE: {
          "content": {
            "partial3": {
              "chunk5": [
                {
                  "text": "If you believe this is an error, contact ",
                  "classes": "mt-5",
                  "dynamicReplacementConfig": {"__emailPlaceholder__": "profile.email"},
                  "key": ["ON_HOLD"]
                }
              ],
              "anchor": [{
                "href": "mailto:brandportal@walmart.com",
                "text": "brandportal@walmart.com.",
                "classes": "font-weight-bold mt-5 brand-portal-link-class",
                "key": ["ON_HOLD"]
              }
              ]
            },
            "para1": {
              "text": "test",
              "classes": ""
            },
            "partial1": {
              "chunk1": "Status: ",
              "chunk2": [{
                "text": "Under Review",
                "classes": "status-review",
                "key": ["NEW"]
              },
                {
                  "text": "Action Required",
                  "classes": "status-onhold",
                  "key": ["ON_HOLD"]
                },
                {
                  "text": "Declined",
                  "classes": "status-declined",
                  "key": ["REJECTED", "REJECTED_ON_AUDIT"]
                }
              ]
            }
          }
        }
      }
    };
    let clonedProps = {...JSON.parse(JSON.stringify(props)), ...handlers};
    Cookies.get.mockImplementation(() => "test-cookie");
    jest.spyOn(Http, "post").mockImplementation(() => Promise.resolve({body: {}}));
    wrapper = setUp(clonedProps);
    let tree = toJson(wrapper);
    clearKeys(tree, []);
    expect(tree).toMatchSnapshot();
    wrapper.find(".additional-action").simulate("click");

    clonedProps = {...JSON.parse(JSON.stringify(props)), ...handlers};
    clonedProps.meta.ADDITIONAL_ACTION.action = "resendInvite";
    wrapper = setUp(clonedProps);
    wrapper.find(".additional-action").simulate("click");

    clonedProps = {...JSON.parse(JSON.stringify(props)), ...handlers};
    clonedProps.meta.ADDITIONAL_ACTION.action = "closeModal";
    wrapper = setUp(clonedProps);
    wrapper.find(".additional-action").simulate("click");

    jest.spyOn(Http, "put").mockImplementation(() => Promise.resolve({body: {}}));
    clonedProps = {...JSON.parse(JSON.stringify(props)), ...handlers};
    clonedProps.meta.ADDITIONAL_ACTION.action = "test";
    wrapper = setUp(clonedProps);
    wrapper.find(".additional-action").simulate("click");

    clonedProps = {...JSON.parse(JSON.stringify(props)), ...handlers};
    clonedProps.meta.PRIMARY_ACTION.action = "linkConfirmation";
    wrapper = setUp(clonedProps);
    wrapper.find(".btn-primary").simulate("click");

    clonedProps = {...JSON.parse(JSON.stringify(props)), ...handlers};
    clonedProps.meta.PRIMARY_ACTION.action = "linkAccounts";
    wrapper = setUp(clonedProps);
    wrapper.find(".btn-primary").simulate("click");

    clonedProps = {...JSON.parse(JSON.stringify(props)), ...handlers};
    clonedProps.meta.PRIMARY_ACTION.action = "toNext";
    wrapper = setUp(clonedProps);
    wrapper.find(".btn-primary").simulate("click");

    clonedProps = {...JSON.parse(JSON.stringify(props)), ...handlers};
    clonedProps.meta.PRIMARY_ACTION.action = "navigation";
    wrapper = setUp(clonedProps);
    wrapper.find(".btn-primary").simulate("click");

    clonedProps = {...JSON.parse(JSON.stringify(props)), ...handlers};
    clonedProps.meta.PRIMARY_ACTION.action = "logout";
    wrapper = setUp(clonedProps);
    wrapper.find(".btn-primary").simulate("click");

    clonedProps = {...JSON.parse(JSON.stringify(props)), ...handlers};
    clonedProps.meta.PRIMARY_ACTION.action = "refreshAndHideModal";
    clonedProps.meta.TITLE.content.para1.onClick = "test";
    wrapper = setUp(clonedProps);
    wrapper.find(".btn-primary").simulate("click");

    clonedProps = {...JSON.parse(JSON.stringify(props)), ...handlers};
    clonedProps.meta.PRIMARY_ACTION.action = "test";
    clonedProps.user.profile.email=false;
    clonedProps.meta.TITLE.content.para1.onClick = "dispatchUserProfile";
    wrapper = setUp(clonedProps);
    wrapper.find(".btn-primary").simulate("click");

  });
});
