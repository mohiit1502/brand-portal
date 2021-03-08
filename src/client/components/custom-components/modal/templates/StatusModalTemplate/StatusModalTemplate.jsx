/* eslint-disable react/prop-types */
// eslint-disable-next-line filenames/match-regex
import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import "./StatusModalTemplate.component.scss";

const StatusModalTemplate = props => {

  // const baseUrl = CONSTANTS.URL.DOMAIN[process.env.NODE_ENV && process.env.NODE_ENV.toUpperCase()];
  const baseUrl = window.location.origin;
  const logoutUrl = props.logoutUrl && props.logoutUrl.replace("__domain__", baseUrl);

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
            <div className="row mt-2">
              <div className="col">
                <span className="status-description">
                  {props.meta.MESSAGE}
                </span>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col">
                <a className="btn btn-sm btn-primary px-5" href={logoutUrl}>Logout</a>
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
