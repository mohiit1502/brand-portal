/* eslint-disable filenames/match-regex */
import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import { TOGGLE_ACTIONS, toggleModal, dispatchDiscardChanges } from "../../actions/modal-actions";
import "./Alert.component.scss";

const Alert = props => {

  const discardChanges = () => {
    props.dispatchDiscardChanges(true);
    props.toggleModal(TOGGLE_ACTIONS.HIDE);
  };

  const cancelDiscardChanges = () => {
    props.dispatchDiscardChanges(false);
    props.toggleModal(TOGGLE_ACTIONS.HIDE);
  };

  return (
    <div className="modal show" id="singletonModal" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-body py-3 px-5">
            <div className="row">
              <div className="col">
                {/* <img src={CheckGreenIcon} height={87}/> */}
              </div>
            </div>
            <div className="row mt-4">
              <div className="col">
                <p className="status-header font-weight-bold">
                  You have unsaved changes!
                </p>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col">
                <p>If you proceed you may lose the changes that you may have made on this form.</p>
                <p>Click "Discard" to confirm and discard your changes, click "Cancel" to stay and continue.</p>
              </div>
            </div>
            <div className="row my-3 text-right">
              <div className="col">
                {/*<div className="btn btn-sm btn-outline-primary px-5" onClick={() => this.props.toggleModal(TOGGLE_ACTIONS.HIDE)}>Okay</div>*/}
                <input type="button" className="btn btn-primary mr-3" value="Cancel"  onClick={cancelDiscardChanges} />
                <input type="button" className="btn btn-danger" value="Discard" onClick={discardChanges} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Alert.propTypes = {
  dispatchDiscardChanges: PropTypes.func,
  toggleModal: PropTypes.func,
  viewerState: PropTypes.bool
};

const mapDispatchToProps = {
  dispatchDiscardChanges,
  toggleModal
};

export default connect(null, mapDispatchToProps)(Alert);
