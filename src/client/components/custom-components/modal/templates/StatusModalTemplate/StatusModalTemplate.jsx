import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";

import {NOTIFICATION_TYPE, showNotification} from "../../../../../actions/notification/notification-actions";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../../actions/modal-actions";

import Http from "../../../../../utility/Http";
import ContentRenderer from "../../../../../utility/ContentRenderer";
import mixpanel from "../../../../../utility/mixpanelutils";

import MIXPANEL_CONSTANTS from "../../../../../constants/mixpanelConstants";
import CONSTANTS from "../../../../../constants/constants";
import "./StatusModalTemplate.component.scss";

// eslint-disable-next-line complexity
const StatusModalTemplate = props => {
  const {showNotification, meta, user} = props;
  const {logoutUrl, profile} = user;
  const [loader, setLoader] = useState(false);
  const [displayAdditionalActionLocal, setDisplayAdditionalActionLocal] = useState();
  const [remaining, setRemaining] = useState();
  const contentRenderer = new ContentRenderer();
  const baseUrl = window.location.origin;
  const logoutUrlSuperlated = logoutUrl && logoutUrl.replace("__domain__", baseUrl);
  const mixpanelPayload = {
    WORK_FLOW: MIXPANEL_CONSTANTS.MIXPANEL_WORKFLOW_MAPPING[meta && meta.CODE ? meta.CODE : 0] || "CODE_NOT_FOUND"
  };

  useEffect(() => {
    setDisplayAdditionalActionLocal(props.meta.displayAdditionalAction);
    setRemaining(props.meta.remaining);
  }, [props.meta.displayAdditionalAction, props.meta.remaining])

  const resendInvite = () => {
    const email = profile ? profile.email : "";
    setLoader(true);
    const mixpanelPayload = {
      WORK_FLOW: MIXPANEL_CONSTANTS.MIXPANEL_WORKFLOW_MAPPING[64]
    };
    if (email) {
      Http.post("/api/users/reinvite", {email, workflow: "user_mail_verification"})
        .then(res => {
          if (res.body) {
            const config = res.body.emailConfig;
            if ((typeof res.body === "boolean" && res.body === true) || res.body.status === true) {
              showNotification(NOTIFICATION_TYPE.SUCCESS, `Verification email sent to: ${email} `);
            } else if (res.body.status === false && res.status === CONSTANTS.STATUS_CODE_SUCCESS) {
              showNotification(NOTIFICATION_TYPE.SUCCESS, `User ${email} has already been activated.`);
              mixpanelPayload.emailAlreadyVerified = true;
            }
            if (config) {
              setDisplayAdditionalActionLocal(config.count < config.limit);
              setRemaining(config.limit - config.count);
            }
          } else {
            showNotification(NOTIFICATION_TYPE.ERROR, `Verification email could not be sent to: ${email} `);
          }
          mixpanelPayload.API_SUCCESS = true;
        })
        .catch((e) => {
          console.log(e);
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
  }

  return (
    <div className="c-StatusModalTemplate modal show" id="singletonModal" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className={`modal-content${loader ? " loader" : ""}`}>
          {meta.HEADER && <div className="modal-header font-weight-bold align-items-center">
            {meta.HEADER}
            <button type="button" className="close text-white" aria-label="Close" onClick={() => props.toggleModal(TOGGLE_ACTIONS.HIDE)}>
              <span className="close-btn" aria-hidden="true">&times;</span>
            </button>
          </div>}
          <div className={`modal-body${meta.TYPE !== "NON_STATUS" ? " text-center" : ""} p-4`}>
            {meta.image && <div className="row">
              <div className="col">
                <img src={meta.image} alt="IMAGE_STATUS" height={120}/>
              </div>
            </div>}
            {meta.TITLE && <div className="row mt-3">
              <div className="col">
                <span className="status-header font-weight-bold">
                  {meta.TITLE}
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
            <div className="row mt-1">
              <div className="col">
                <div className={`status-description ${meta.MESSAGE && meta.MESSAGE.classes ? meta.MESSAGE.classes : ""}`}>
                {
                  typeof (meta.MESSAGE) === "string" ? meta.MESSAGE :
                    Object.keys(meta.MESSAGE.content).map(node => {
                    return contentRenderer.getContent(meta.MESSAGE.content, node);
                  })
                }
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className={`col${meta.TYPE === "NON_STATUS" ? " text-right" : ""}`}>
                {meta.TYPE === "NON_STATUS"
                  ? <button className="btn btn-sm btn-primary px-5" onClick={() => props.toggleModal(TOGGLE_ACTIONS.HIDE)}>{meta.BUTTON_TEXT}</button>
                  : <a className="btn btn-sm btn-primary px-5" href={logoutUrlSuperlated} onClick={() => {mixpanel.logout(MIXPANEL_CONSTANTS.LOGOUT.LOGOUT, mixpanelPayload);}}>
                    Logout
                  </a>
                }
                {props.meta.ADDITIONAL_ACTION &&
                (displayAdditionalActionLocal === undefined ?
                    <div className="list-loader loader d-block mt-3" style={{height: "1.8rem"}} />
                    : displayAdditionalActionLocal &&
                    <div className="d-block">
                      <a className="additional-action mt-2" onClick={resendInvite}>{props.meta.ADDITIONAL_ACTION}</a>
                      {remaining && typeof remaining === "number" && <p className="font-size-12 font-weight-bold mt-1">You can resend ({remaining}) more time/s</p>}
                    </div>
                )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

StatusModalTemplate.props = {
  meta: PropTypes.object,
  toggleModal: PropTypes.func,
  showNotification: PropTypes.func,
  user: PropTypes.object
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = {
  toggleModal,
  showNotification
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusModalTemplate);
