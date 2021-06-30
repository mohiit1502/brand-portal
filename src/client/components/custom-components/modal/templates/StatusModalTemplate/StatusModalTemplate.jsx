/* eslint-disable complexity */
/* eslint-disable react/prop-types */
// eslint-disable-next-line filenames/match-regex
import React, {useState} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import mixpanel from "../../../../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../../../../constants/mixpanelConstants";
import ContentRenderer from "../../../../../utility/ContentRenderer";
import "./StatusModalTemplate.component.scss";
import Http from "../../../../../utility/Http";
import {NOTIFICATION_TYPE, showNotification} from "../../../../../actions/notification/notification-actions";
import CONSTANTS from "../../../../../constants/constants";

// eslint-disable-next-line complexity
const StatusModalTemplate = props => {
  const {showNotification, user} = props;
  const {logoutUrl, profile} = user;
  const [loader, setLoader] = useState(false);
  const contentRenderer = new ContentRenderer();
  const baseUrl = window.location.origin;
  const logoutUrlSuperlated = logoutUrl && logoutUrl.replace("__domain__", baseUrl);
  const mixpanelPayload = {
    WORK_FLOW: MIXPANEL_CONSTANTS.MIXPANEL_WORKFLOW_MAPPING[props.meta && props.meta.CODE ? props.meta.CODE : 0] || "CODE_NOT_FOUND"
  };

  const resendInvite = () => {
    const email = profile ? profile.email : "";
    setLoader(true);
    const mixpanelPayload = {
      WORK_FLOW: MIXPANEL_CONSTANTS.MIXPANEL_WORKFLOW_MAPPING[64]
    };
    if (email) {
      Http.post("/api/users/reinvite", {email}, "")
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
        .catch((e) => {
          console.log(e);
          mixpanelPayload.API_SUCCESS = false;
          mixpanelPayload.ERROR = e.message ? e.message : e;
        })
        .finally(() => {
          setLoader(false);
          // mixpanel.trackEvent(MIXPANEL_CONSTANTS.RESEND_INVITE, mixpanelPayload);
        });
    } else {
      showNotification(NOTIFICATION_TYPE.ERROR, `Email not available, please refresh the page!`);
    }
  }

  return (
    <div className="c-StatusModalTemplate modal show" id="singletonModal" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className={`modal-content${loader ? " loader" : ""}`}>
          <div className="modal-body text-center">
            <div className="row">
              <div className="col">
                <img src={props.meta.image} height={120}/>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col">
                <span className="status-header font-weight-bold">
                  {props.meta.TITLE}
                </span>
              </div>
            </div>
            { props.meta.SUBTITLE &&
            <div className="row mt-1">
              <div className="col">
                <div className={`subtitle ${props.meta.SUBTITLE && props.meta.SUBTITLE.classes ? props.meta.SUBTITLE.classes : ""}`}>
                  {
                    typeof (props.meta.SUBTITLE) === "string" ? props.meta.SUBTITLE :
                      Object.keys(props.meta.SUBTITLE.content).map(node => {
                        return contentRenderer.getContent(props.meta.SUBTITLE.content, node);
                      })
                  }
                </div>
              </div>
            </div>
            }
            <div className="row mt-1">
              <div className="col">
                <div className={`status-description ${props.meta.MESSAGE && props.meta.MESSAGE.classes ? props.meta.MESSAGE.classes : ""}`}>
                  {
                    typeof (props.meta.MESSAGE) === "string" ? props.meta.MESSAGE :
                      Object.keys(props.meta.MESSAGE.content).map(node => {
                        return contentRenderer.getContent(props.meta.MESSAGE.content, node);
                      })
                  }
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col">
                <a className="btn btn-sm btn-primary px-5" href={logoutUrlSuperlated} onClick={() => {mixpanel.logout(MIXPANEL_CONSTANTS.LOGOUT.LOGOUT, mixpanelPayload);}}>
                  Logout
                </a>
                {props.meta.ADDITIONAL_ACTION && <a className="additional-action d-block mt-2" onClick={resendInvite}>
                  {props.meta.ADDITIONAL_ACTION}
                </a>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

StatusModalTemplate.props = {
  logoutUrl: PropTypes.string,
  meta: PropTypes.object
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = {
  showNotification
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusModalTemplate);
