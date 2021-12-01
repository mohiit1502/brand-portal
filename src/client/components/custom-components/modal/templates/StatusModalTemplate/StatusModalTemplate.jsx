/* eslint-disable filenames/match-regex, no-magic-numbers, no-shadow, no-unused-expressions, max-statements, complexity, react/jsx-indent-props */
import React, {useState} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {useHistory} from "react-router";

import {NOTIFICATION_TYPE, showNotification} from "../../../../../actions/notification/notification-actions";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../../actions/modal-actions";
import {updateUserProfile} from "../../../../../actions/user/user-actions";
import {dispatchOnboardingDetails} from "../../../../../actions/company/company-actions";
import * as components from "../../../../";

import Http from "../../../../../utility/Http";
import ContentRenderer from "../../../../../utility/ContentRenderer";
import mixpanel from "../../../../../utility/mixpanelutils";

import MIXPANEL_CONSTANTS from "../../../../../constants/mixpanelConstants";
import CONSTANTS from "../../../../../constants/constants";
import * as images from "./../../../../../images";
import "./StatusModalTemplate.component.scss";

const StatusModalTemplate = props => {
  const {modalsMeta, meta, showNotification, toggleModal, updateUserProfile, user,
     dispatchOnboardingDetails, onboardingDetails} = props;
  const {logoutUrl, profile} = user;
  const [loader, setLoader] = useState(false);
  const history = useHistory();
  const contentRenderer = new ContentRenderer();
  const baseUrl = window.location.origin;
  const logoutUrlSuperlated = logoutUrl && logoutUrl.replace("__domain__", baseUrl);
  const mixpanelPayload = {
    WORK_FLOW: MIXPANEL_CONSTANTS.MIXPANEL_WORKFLOW_MAPPING[meta && meta.CODE ? meta.CODE : 0] || "CODE_NOT_FOUND"
  };
  const ContentComponent = meta.CONTENT_COMPONENT && components[meta.CONTENT_COMPONENT];

  const resendInvite = () => {
    const email = profile ? profile.email : "";
    setLoader(true);
    const mixpanelPayload = {
      WORK_FLOW: MIXPANEL_CONSTANTS.MIXPANEL_WORKFLOW_MAPPING[64]
    };
    if (email) {
      Http.post("/api/users/reinvite", {email}, {clientType: Cookies.get("client_type")})
        .then(res => {
          if (res.body === true) {
            showNotification(NOTIFICATION_TYPE.SUCCESS, `Verification email sent to: ${email} `);
          } else if (res.body === false && res.status === CONSTANTS.STATUS_CODE_SUCCESS) {
            showNotification(NOTIFICATION_TYPE.SUCCESS, `User ${email} has already been activated.`);
          } else {
            showNotification(NOTIFICATION_TYPE.ERROR, `Verification email could not be sent to: ${email} `);
          }
          mixpanelPayload.API_SUCCESS = true;
        })
        .catch(e => {
          mixpanelPayload.API_SUCCESS = false;
          mixpanelPayload.ERROR = e.message ? e.message : e;
        })
        .finally(() => {
          setLoader(false);
          mixpanel.trackEvent(MIXPANEL_CONSTANTS.RESEND_SELF_INVITE, mixpanelPayload);
        });
    } else {
      showNotification(NOTIFICATION_TYPE.ERROR, `Email not available, please refresh the page!`);
    }
  };

  const getDynamicReplacementConfig = node => {
    const dynamicReplacementConfig = node.dynamicReplacementConfig;
    dynamicReplacementConfig && Object.keys(dynamicReplacementConfig).forEach(key => {
      const replacement = dynamicReplacementConfig[key];
      if (replacement.indexOf(".") > -1) {
        const replacementPath = replacement.split(".");
        let i = 0;
        let traverser = replacementPath[i++];
        if (traverser === "profile") {
          traverser = profile;
          while (traverser && i < replacementPath.length) {
            traverser = traverser[replacementPath[i++]];
          }
          dynamicReplacementConfig[key] = traverser;
        }
      }
    });
    // return dynamicReplacementConfig;
  };

  const getPartialObject = node => {
    if (node) {
      if (node.length) {
        const matchedNode = node.find(obj => onboardingDetails && obj.key && obj.key.indexOf(onboardingDetails.orgStatus) > -1)
        matchedNode && getDynamicReplacementConfig(matchedNode);
        return matchedNode;
      } else {
        getDynamicReplacementConfig(node);
      }
    }
    return null;
  };

  const linkConfirmation = () => {
    toggleModal(TOGGLE_ACTIONS.SHOW, {templateName: "StatusModalTemplate", ...modalsMeta.ACCOUNT_LINKING_CONFIRM});
  };

  const hideModal = () => {
    toggleModal(TOGGLE_ACTIONS.HIDE);
  };

  const linkAccounts = () => {
    setLoader(true);
    const mixpanelPayload = {
      API: "/api/users",
      WORK_FLOW: "LINK_ACCOUNTS"
    };
    const payload = {
      user: {
        accountLinked: true
      }
    };
    return Http.put(`/api/users/${user.profile.email}`, payload, null, null)
      .then(async res => {
        updateUserProfile(res.body);
        toggleModal(TOGGLE_ACTIONS.SHOW, {templateName: "StatusModalTemplate", ...modalsMeta.ACCOUNT_LINKED});
        mixpanelPayload.API_SUCCESS = true;
      })
      .catch(err => {
        showNotification(NOTIFICATION_TYPE.ERROR, "Accounts could not be linked, please try again!");
        mixpanelPayload.API_SUCCESS = false;
        mixpanelPayload.ERROR = err.message ? err.message : err;
      })
      .finally(() => {
        setLoader(false);
        mixpanel.trackEvent(MIXPANEL_CONSTANTS.ACCOUNT_LINKING.ACCOUNT_LINKING_ATTEMPTED, mixpanelPayload);
      });
  };


  const getAction = action => {
    switch (action) {
      case "updateCompanyDetails":
        return dispatchOnboardingDetails;
      case "dispatchUserProfile":
        return () => {
          const profileCloned = {...profile};
          profileCloned.workflow.code = 1;
          profileCloned.context = "edit";
          toggleModal(TOGGLE_ACTIONS.HIDE, {});
          updateUserProfile(profileCloned);
        };
      default:
        return null;
    }
  };

  const runPrimaryAction = (action, actionParam) => {
    switch (action) {
      case "linkConfirmation":
        linkConfirmation();
        break;
      case "linkAccounts":
        linkAccounts();
        break;
      case "toNext":
        toggleModal(TOGGLE_ACTIONS.HIDE, {});
        history.push(CONSTANTS.ROUTES.PROTECTED.DASHBOARD);
        break;
      case "navigation":
        window.open(actionParam, "_blank");
        // window.location.href = actionParam;
        break;
      case "logout":
        mixpanel.logout(MIXPANEL_CONSTANTS.LOGOUT.LOGOUT, mixpanelPayload);
        window.location.href = logoutUrlSuperlated;
        break;
      default:
        hideModal();
    }
  };

  const runSecondaryAction = action => {
    switch (action) {
      case "logout":
        mixpanel.logout(MIXPANEL_CONSTANTS.LOGOUT.LOGOUT, mixpanelPayload);
        window.location.href = logoutUrlSuperlated;
        break;
      case "resendInvite":
        resendInvite();
        break;
      case "closeModal":
        hideModal();
        break;
      default:
        hideModal();
    }
  };
  return (
    <div className="c-StatusModalTemplate modal show" id="singletonModal" tabIndex="-1" role="dialog">
      <div className={`modal-dialog modal-dialog-centered modal-lg${meta.MODAL_DIALOG_CLASSES ? " "+meta.MODAL_DIALOG_CLASSES : ""}`} role="document">
        <div className={`modal-content${loader ? " loader" : ""}`}>
          {meta.HEADER && <div className="modal-header font-weight-bold align-items-center">
            {meta.HEADER}
            <button type="button" className="close text-white" aria-label="Close" onClick={() => toggleModal(TOGGLE_ACTIONS.HIDE)}>
              <span className="close-btn" aria-hidden="true">&times;</span>
            </button>
          </div>}
          <div className={`modal-body${!(meta.TYPE === "NON_STATUS" || meta.TYPE === "NOTIFICATION") ? " text-center" : ""}${meta.TYPE !== "NOTIFICATION" ? " p-4" : " p-0"}${meta.BODY_CLASSES ? ` ${  meta.BODY_CLASSES}` : ""}`}>
            {(images[meta.IMAGE] || meta.image) && <div className="row">
              <div className="col">
                <img src={images[meta.IMAGE] || meta.image} alt="IMAGE_STATUS" height={meta.HEIGHT || 140}/>
              </div>
            </div>}
            {meta.TITLE && <div className="row mt-3">
              <div className={meta.TITLE.classes || "col"}>
                <span className={`status-header row font-weight-bold${meta.TITLE.ROW_CLASSES ? " " + meta.TITLE.ROW_CLASSES : ""}`}>
                {
                  typeof (meta.TITLE) === "string" ? meta.TITLE :
                    Object.keys(meta.TITLE.content).map(node => {
                      let content = meta.TITLE.content;
                      if (meta.TITLE.content[node].onClick) {
                        content = {...meta.TITLE.content};
                        const nodeContent = {...content[node]};
                        content[node] = nodeContent;
                        content[node].onClick = getAction(nodeContent.onClick);
                      }
                      return contentRenderer.getContent(content, node);
                    })
                }
                </span>
              </div>
            </div>}
            { meta.SUBTITLE &&
              <div className="row mt-1">
              <div className="col">
                <div className={`subtitle ${meta.SUBTITLE && meta.SUBTITLE.classes ? meta.SUBTITLE.classes : ""}`}>
                {
                  typeof (meta.SUBTITLE) === "string" ? meta.SUBTITLE :
                    Object.keys(meta.SUBTITLE.content).map(node => {
                    return contentRenderer.getContent(meta.SUBTITLE.content, node);
                  })
                }
                </div>
              </div>
            </div>
            }
            <div className={`row mt-1 body-content${meta.BODY_CONTENT_CLASSES ? ` ${  meta.BODY_CONTENT_CLASSES}` : ""}`}>
              <div className="col">
                { meta.MESSAGE && <div className={`status-description ${meta.MESSAGE && meta.MESSAGE.classes ? meta.MESSAGE.classes : ""}`}>
                {
                  typeof (meta.MESSAGE) === "string" ? meta.MESSAGE :
                    Object.keys(meta.MESSAGE.content).map(node => {
                      const nodeContent = meta.MESSAGE.content[node];
                      node.startsWith("partial")
                        ? Object.keys(nodeContent).forEach(node => {
                          if (typeof nodeContent[node] === "object") {
                            const parsedObject = getPartialObject(nodeContent[node]);
                            nodeContent[node] = parsedObject || nodeContent[node];
                          }
                          })
                        : getDynamicReplacementConfig(nodeContent);
                      return contentRenderer.getContent(meta.MESSAGE.content, node, "", "", onboardingDetails);
                    })
                }
                </div>}
              </div>
            </div>
            {(meta.PRIMARY_ACTION || meta.ADDITIONAL_ACTION) && <div className={`row footer${meta.FOOTER_CLASSES ? ` ${  meta.FOOTER_CLASSES}` : ""}`}>
              <div className={`col${meta.TYPE === "NON_STATUS" || meta.TYPE === "NOTIFICATION" ? " text-right" : ""}
                        ${meta.PRIMARY_ACTION && meta.PRIMARY_ACTION.containerClasses ? ` ${  meta.PRIMARY_ACTION.containerClasses}` : ""}`}>
                {meta.TYPE === "NON_STATUS" || meta.TYPE === "CTA" || meta.TYPE === "NOTIFICATION"
                  ? <button className={`btn btn-sm btn-primary${meta.TYPE !== "NOTIFICATION" ? " px-5" : ""}${meta.PRIMARY_ACTION && meta.PRIMARY_ACTION.classes ? ` ${  meta.PRIMARY_ACTION.classes}` : ""}`}
                    onClick={() => runPrimaryAction(meta.PRIMARY_ACTION && meta.PRIMARY_ACTION.action ? meta.PRIMARY_ACTION.action : "",
                                meta.PRIMARY_ACTION && meta.PRIMARY_ACTION.actionParam ? meta.PRIMARY_ACTION.actionParam : "")}>
                    {meta.BUTTON_TEXT || (typeof meta.PRIMARY_ACTION === "object" ? meta.PRIMARY_ACTION.text : meta.PRIMARY_ACTION)}
                  </button>
                  : !meta.NO_PRIMARY_ACTION && <a className="btn btn-sm btn-primary px-5" href={logoutUrlSuperlated} onClick={() => mixpanel.logout(MIXPANEL_CONSTANTS.LOGOUT.LOGOUT, mixpanelPayload)}>
                    {meta.PRIMARY_ACTION || "Logout"}
                  </a>
                }
                {meta.ADDITIONAL_ACTION && <div className={meta.TYPE !== "NOTIFICATION" ? " mx-auto mt-2" : " font-size-15"}>
                {meta.ADDITIONAL_ACTION.actionHelpText && <span className={meta.ADDITIONAL_ACTION.actionHelpText.classes ? meta.ADDITIONAL_ACTION.actionHelpText.classes : ""}>{meta.ADDITIONAL_ACTION.actionHelpText.text}</span>}
                <button className={`additional-action btn btn-link${meta.ADDITIONAL_ACTION.classes ? ` ${  meta.ADDITIONAL_ACTION.classes}` : ""}`}
                  onClick={() => runSecondaryAction(meta.ADDITIONAL_ACTION && meta.ADDITIONAL_ACTION.action ? meta.ADDITIONAL_ACTION.action : "")}>
                  {typeof meta.ADDITIONAL_ACTION === "object" ? meta.ADDITIONAL_ACTION.text : meta.ADDITIONAL_ACTION}
                </button>
                </div>}
              </div>
            </div>}
            {ContentComponent && <ContentComponent user={user && user.profile} handler={getAction(meta.CONTENT_COMPONENT_PROP)}
            org={onboardingDetails && onboardingDetails.org} brand={onboardingDetails && onboardingDetails.brand}/>}
          </div>
        </div>
      </div>
    </div>
  );
};

StatusModalTemplate.propTypes = {
  meta: PropTypes.object,
  modalsMeta: PropTypes.object,
  toggleModal: PropTypes.func,
  showNotification: PropTypes.func,
  dispatchOnboardingDetails: PropTypes.func,
  updateUserProfile: PropTypes.func,
  user: PropTypes.object,
  onboardingDetails: PropTypes.object
};

const mapStateToProps = state => {
  return {
    onboardingDetails: state.company.onboardingDetails,
    user: state.user,
    modalsMeta: state.content.metadata ? state.content.metadata.MODALSCONFIG : {}
  };
};

const mapDispatchToProps = {
  dispatchOnboardingDetails,
  showNotification,
  toggleModal,
  updateUserProfile
};

export default connect(mapStateToProps, mapDispatchToProps)(StatusModalTemplate);
