/* eslint-disable filenames/match-regex */
import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import { TOGGLE_ACTIONS, toggleModal, dispatchDiscardChanges } from "../../actions/modal-actions";
import AlertIcon from "../../images/alertIconNew.svg"
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
    <div className="c-Alert modal show" id="singletonModal" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-body text-center p-4">
            <div className="row">
              <div className="col">
                 <img src={AlertIcon} height={87}/>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col">
                <p className="status-header font-weight-bold">
                  You have unsaved changes!
                </p>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col">
                <span className="status-description">
                  If you proceed you may lose the changes that you may have made on this form.<br/>
                  Click "Discard" to confirm and discard your changes, click "Cancel" to stay and continue.
                </span>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col">
                {/*<div className="btn btn-sm btn-outline-primary px-5" onClick={() => this.props.toggleModal(TOGGLE_ACTIONS.HIDE)}>Okay</div>*/}
                <input type="button" className="btn btn-sm btn-outline-primary mr-3" value="Cancel"  onClick={cancelDiscardChanges} />
                <input type="button" className="btn btn-primary" value="Discard" onClick={discardChanges} />
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
