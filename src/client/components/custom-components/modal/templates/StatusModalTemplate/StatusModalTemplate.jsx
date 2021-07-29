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
import {TOGGLE_ACTIONS, toggleModal} from "../../../../../actions/modal-actions";

// eslint-disable-next-line complexity
const StatusModalTemplate = props => {
  const contentRenderer = new ContentRenderer();
  // const baseUrl = CONSTANTS.URL.DOMAIN[process.env.NODE_ENV && process.env.NODE_ENV.toUpperCase()];
  const baseUrl = window.location.origin;
  const logoutUrl = props.logoutUrl && props.logoutUrl.replace("__domain__", baseUrl);
  const meta = props.meta;
  const mixpanelPayload = {
    WORK_FLOW: MIXPANEL_CONSTANTS.MIXPANEL_WORKFLOW_MAPPING[meta && meta.CODE ? meta.CODE : 0] || "CODE_NOT_FOUND"
  };
  return (
    <div className="c-StatusModalTemplate modal show" id="singletonModal" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content">
          {meta.HEADER && <div className="modal-header font-weight-bold align-items-center">
            {meta.HEADER}
            <button type="button" className="close text-white" aria-label="Close" onClick={() => props.toggleModal(TOGGLE_ACTIONS.HIDE)}>
              <span className="close-btn" aria-hidden="true">&times;</span>
            </button>
          </div>}
          <div className={`modal-body${meta.TYPE !== "NON_STATUS" ? " text-center" : ""} p-4`}>
            {meta.image && <div className="row">
              <div className="col">
                <img src={meta.image} height={120}/>
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
                  : <a className="btn btn-sm btn-primary px-5" href={logoutUrl} onClick={() => {mixpanel.logout(MIXPANEL_CONSTANTS.LOGOUT.LOGOUT, mixpanelPayload);}}>
                    Logout
                  </a>
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
  logoutUrl: PropTypes.string,
  meta: PropTypes.object,
  toggleModal: PropTypes.func
};

const mapStateToProps = state => {
  return {
    logoutUrl: state.user.logoutUrl
  };
};

const mapDispatchToProps = {
  toggleModal
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusModalTemplate);
