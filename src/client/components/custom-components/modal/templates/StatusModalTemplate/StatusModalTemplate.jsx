// eslint-disable-next-line filenames/match-regex
import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {toggleModal} from "../../../../../actions/modal-actions";
import CONSTANTS from "../../../../../constants/constants";
import "./StatusModalTemplate.component.scss";

const StatusModalTemplate = props => {

  const baseUrl = CONSTANTS.URL.DOMAIN[process.env.NODE_ENV && process.env.NODE_ENV.toUpperCase()];
  const logoutUrl = CONSTANTS.URL.LOGOUT.replace("__domain__", baseUrl);

  return (
    <div className="c-StatusModalTemplate modal show" id="singletonModal" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-body text-center p-5">
            <div className="row">
              <div className="col">
                <img src={props.meta.image} height={87}/>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col">
                <span className="status-header">
                  {props.meta.TITLE}
                </span>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col">
                <span className="status-description">
                  {props.meta.MESSAGE}
                </span>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col">
                {/*<div className="btn btn-sm btn-outline-primary px-5" onClick={() => this.props.toggleModal(TOGGLE_ACTIONS.HIDE)}>Okay</div>*/}
                <a className="btn btn-sm btn-outline-primary px-5" href={logoutUrl}>Okay</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

StatusModalTemplate.props = {
  data: PropTypes.object,
  meta: PropTypes.object,
  modal: PropTypes.object,
  toggleModal: PropTypes.func
};

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = {
  toggleModal
};

export default connect(mapStateToProps, mapDispatchToProps)(StatusModalTemplate);
