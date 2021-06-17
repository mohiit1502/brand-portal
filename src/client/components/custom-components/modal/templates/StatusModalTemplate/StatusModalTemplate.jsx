/* eslint-disable complexity */
/* eslint-disable react/prop-types */
// eslint-disable-next-line filenames/match-regex
import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import mixpanel from "../../../../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../../../../constants/mixpanelConstants";
import ContentRenderer from "../../../../../utility/ContentRenderer";
import "./StatusModalTemplate.component.scss";

// eslint-disable-next-line complexity
const StatusModalTemplate = props => {
  const contentRenderer = new ContentRenderer();
  // const baseUrl = CONSTANTS.URL.DOMAIN[process.env.NODE_ENV && process.env.NODE_ENV.toUpperCase()];
  const baseUrl = window.location.origin;
  const logoutUrl = props.logoutUrl && props.logoutUrl.replace("__domain__", baseUrl);
  const mixpanelPayload = {
    WORK_FLOW: MIXPANEL_CONSTANTS.MIXPANEL_WORKFLOW_MAPPING[props.meta && props.meta.CODE ? props.meta.CODE : 0] || "CODE_NOT_FOUND"
  };
  return (
    <div className="c-StatusModalTemplate modal show" id="singletonModal" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content">
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
                <a className="btn btn-sm btn-primary px-5" href={logoutUrl} onClick={() => {mixpanel.logout(MIXPANEL_CONSTANTS.LOGOUT.LOGOUT, mixpanelPayload);}}>
                  Logout
                </a>
                {props.meta.ADDITIONAL_ACTION && <a className="additional-action d-block mt-2" href={logoutUrl} onClick={() => {mixpanel.logout(MIXPANEL_CONSTANTS.LOGOUT.LOGOUT, mixpanelPayload);}}>
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
    logoutUrl: state.user.logoutUrl
  };
};

export default connect(mapStateToProps)(StatusModalTemplate);
