/* eslint-disable filenames/match-regex, no-magic-numbers, no-shadow, no-unused-expressions, max-statements, complexity, react/jsx-indent-props */
import React, {useState} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {useHistory} from "react-router";
import Cookies from "electrode-cookies";
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
  const org = user && user.profile && user.profile.organization;
  const [loader, setLoader] = useState(false);
  const [apiError, setApiError] = useState(false);
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
            showNotification(NOTIFICATION_TYPE.SUCCESS, "Email Resent", "variant2", "Verified2");
          } else if (res.body === false && res.status === CONSTANTS.STATUS_CODE_SUCCESS) {
            showNotification(NOTIFICATION_TYPE.SUCCESS, "Email has already been activated.", "variant2", "Verified2");
          } else {
            showNotification(NOTIFICATION_TYPE.ERROR, "Verification Email could not be sent.", "variant2");
          }
          mixpanelPayload.API_SUCCESS = true;
        })
        .catch(e => {
          mixpanelPayload.API_SUCCESS = false;
          mixpanelPayload.ERROR = e.message ? e.message : e;
          showNotification(NOTIFICATION_TYPE.ERROR, "Verification Email could not be sent.", "variant2");
        })
        .finally(() => {
          setLoader(false);
          mixpanel.trackEvent(MIXPANEL_CONSTANTS.RESEND_SELF_INVITE, mixpanelPayload);
        });
    } else {
      setLoader(false);
      showNotification(NOTIFICATION_TYPE.ERROR, `Email not available, please refresh the page!`, "variant2");
    }
  };

  const getPartialObject = node => {
    if (node) {
      if (node.length) {
        const matchedNode = node.find(obj => onboardingDetails && obj.key && obj.key.indexOf(onboardingDetails.orgStatus) > -1)
        matchedNode && ContentRenderer.getDynamicReplacementConfig(matchedNode, profile, org);
        return matchedNode;
      } else {
        ContentRenderer.getDynamicReplacementConfig(node, profile, org);
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

  const updateUser = () => {
    setLoader(true);
    const mixpanelPayload = {
      API: "/api/users",
      WORK_FLOW: "LINK_ACCOUNTS",
      EMAIL: user.profile.email
    };
    const payload = {
      user: {
        doItLater: true
      }
    };
    return Http.put(`/api/users/${user.profile.email}`, payload, null, null)
      .then(async res => {
        updateUserProfile(res.body);
        showNotification(NOTIFICATION_TYPE.SUCCESS, "Saved your preference successfully!");
        mixpanelPayload.API_SUCCESS = true;
      })
      .catch(err => {
        mixpanelPayload.API_SUCCESS = false;
        mixpanelPayload.ERROR = err.message ? err.message : err;
      })
      .finally(() => {
        setLoader(false);
        hideModal();
        mixpanel.trackEvent(MIXPANEL_CONSTANTS.VIEW_DASHBOARD_WORKFLOW.UPDATE_PROFILE_LATER, mixpanelPayload);
      });
  }

  const deleteContactInfo = () => {
    setLoader(true);
    const mixpanelPayload = {
      API: "/api/users",
      WORK_FLOW: "LINK_ACCOUNTS",
      EMAIL: user.profile.email
    };
    const payload = {orgId: user.profile.organization.id};
    return Http.put(`/api/org/deleteSecondaryContactInfo`, payload, null, null)
      .then(async res => {
        if (res.status === 200) {
          const userClone = JSON.parse(JSON.stringify(user.profile));
          delete userClone.organization.secondaryContactInformation;
          updateUserProfile(userClone);
        }
        showNotification(NOTIFICATION_TYPE.SUCCESS, "Deleted contact information successfully!");
        hideModal();
        mixpanelPayload.API_SUCCESS = true;
      })
      .catch(err => {
        showNotification(NOTIFICATION_TYPE.ERROR, "Unable to delete contact information, please try again!");
        mixpanelPayload.API_SUCCESS = false;
        mixpanelPayload.ERROR = err.message ? err.message : err;
      })
      .finally(() => {
        setLoader(false);
        mixpanel.trackEvent(MIXPANEL_CONSTANTS.VIEW_DASHBOARD_WORKFLOW.UPDATE_PROFILE_LATER, mixpanelPayload);
      });
  }

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
    try {
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
          break;
        case "logout":
          mixpanel.logout(MIXPANEL_CONSTANTS.LOGOUT.LOGOUT, mixpanelPayload);
          window.location.href = logoutUrlSuperlated;
          break;
        case "deleteContactInfo":
          deleteContactInfo();
          break;
        case "refreshAndHideModal":
          toggleModal(TOGGLE_ACTIONS.HIDE);
          window.location.reload();
          break;
        case "reroute":
          toggleModal(TOGGLE_ACTIONS.HIDE);
          history.push(actionParam);
          break;
        default:
          hideModal();
      }
    } catch (e) {
      loader && setLoader(false);
      console.log(e);
    }
  };

  const runSecondaryAction = action => {
    try {
      switch (action) {
        case "logout":
          mixpanel.logout(MIXPANEL_CONSTANTS.LOGOUT.LOGOUT, mixpanelPayload);
          window.location.href = logoutUrlSuperlated;
          break;
        case "resendInvite":
          resendInvite();
          break;
        case "updateUser":
          updateUser();
          break;
        case "closeModal":
        default:
          hideModal();
      }
    } catch (e) {
      loader && setLoader(false);
      console.log(e);
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
          <div className={`modal-body overflow-y-auto${!(meta.TYPE === "NON_STATUS" || meta.TYPE === "NOTIFICATION") ? " text-center" : ""}
          ${meta.TYPE !== "NOTIFICATION" ? " p-4" : " p-0"}${meta.BODY_CLASSES ? ` ${  meta.BODY_CLASSES}` : ""}
          ${apiError ? "error-layout" : ""}`}>
          {!apiError ? <>{(images[meta.IMAGE] || meta.image) && <div className="row">
              <div className="col">
                <img src={images[meta.IMAGE] || meta.image} alt="IMAGE_STATUS" height={meta.HEIGHT || 140}/>
              </div>
            </div>}
            {meta.TITLE && <div className={`row mt-3${meta.TITLE.classes ? " "+ meta.TITLE.classes : ""}`}>
              <div className={meta.TITLE.classes || "col"}>
                <span className={`status-header row font-weight-bold${meta.TITLE.ROW_CLASSES ? " " + meta.TITLE.ROW_CLASSES : ""}`}>
                {
                  typeof (meta.TITLE) === "string" ? meta.TITLE :
                    Object.keys(meta.TITLE.content).map(node => {
                      const content = {...meta.TITLE.content};
                      const nodeContent = {...content[node]};
                      const shouldRender = !nodeContent.renderCondition || (nodeContent.renderCondition && onboardingDetails
                        && ContentRenderer.evaluateRenderDependencySubPart(JSON.parse(nodeContent.renderCondition), "value",
                        onboardingDetails));
                      if (shouldRender) {
                        content[node] = nodeContent;
                        ContentRenderer.getDynamicReplacementConfig(nodeContent, profile, org);
                        if (meta.TITLE.content[node].onClick) {
                          content[node].onClick = getAction(nodeContent.onClick);
                        }
                        return contentRenderer.getContent(content, node);
                      } else {
                        return null;
                      }
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
                      const shouldRender = !nodeContent.renderCondition || (nodeContent.renderCondition && onboardingDetails
                        && ContentRenderer.evaluateRenderDependencySubPart(JSON.parse(nodeContent.renderCondition), "value",
                        onboardingDetails));
                      if (shouldRender) {
                      node.startsWith("partial")
                        ? Object.keys(nodeContent).forEach(node => {
                          if (typeof nodeContent[node] === "object") {
                            const parsedObject = getPartialObject(nodeContent[node]);
                            nodeContent[node] = parsedObject || nodeContent[node];
                          }
                          })
                        : ContentRenderer.getDynamicReplacementConfig(nodeContent, profile, org);
                      return contentRenderer.getContent(meta.MESSAGE.content, node);
                      } else {
                        return null;
                      }

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
                {meta.ADDITIONAL_ACTION && <div className={`${meta.TYPE !== "NOTIFICATION" ? " mx-auto mt-2" : " font-size-15"}
                ${meta.ADDITIONAL_ACTION && meta.ADDITIONAL_ACTION.containerClasses ? ` ${meta.ADDITIONAL_ACTION.containerClasses}` : ""}`}>
                {meta.ADDITIONAL_ACTION.actionHelpText && <span className={meta.ADDITIONAL_ACTION.actionHelpText.classes ? meta.ADDITIONAL_ACTION.actionHelpText.classes : ""}>{meta.ADDITIONAL_ACTION.actionHelpText.text}</span>}
                <button className={`additional-action btn btn-link${meta.ADDITIONAL_ACTION.classes ? ` ${  meta.ADDITIONAL_ACTION.classes}` : ""}`}
                  onClick={() => runSecondaryAction(meta.ADDITIONAL_ACTION && meta.ADDITIONAL_ACTION.action ? meta.ADDITIONAL_ACTION.action : "")}>
                  {typeof meta.ADDITIONAL_ACTION === "object" ? meta.ADDITIONAL_ACTION.text : meta.ADDITIONAL_ACTION}
                </button>
                </div>}
              </div>
            </div>}
            {ContentComponent && <ContentComponent user={user && user.profile} handler={getAction(meta.CONTENT_COMPONENT_PROP)}
            apiError={apiError} setApiError={setApiError} org={onboardingDetails && onboardingDetails.org}
            brand={onboardingDetails && onboardingDetails.brand}/>}
            </> :
            <div>
              <h4>Unable to complete request. Please <a href="/">refresh!</a> </h4>
            </div>}
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
