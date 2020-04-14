import React from "react";
import { connect } from "react-redux";
import bootstrap from "bootstrap";
import PropTypes from "prop-types";
import $ from "jquery";
import {TOGGLE_ACTIONS} from "../../actions/modal-actions";

class CustomModal extends React.Component {


  constructor (props) {
    super(props);
    this.toggleModal = this.toggleModal.bind(this);
  }

  componentDidMount() {

  }

  componentDidUpdate() {

    const toggleAction = this.props.modal.enable ? TOGGLE_ACTIONS.SHOW : TOGGLE_ACTIONS.HIDE;
    this.toggleModal(toggleAction);
  }

  toggleModal(toggleAction) {
    return $(".modal").modal(toggleAction);
  }

  render () {
    return (
      <div className="modal fade show" id="exampleModalCenter" tabIndex="-1" role="dialog"
        aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title mx-auto" id="exampleModalCenterTitle">
                Thank you for Registering!
              </h5>
              {/*<button type="button" className="close" aria-label="Close"  onClick={() => this.toggleModal(TOGGLE_ACTIONS.HIDE)}>*/}
              {/*  <span aria-hidden="true">&times;</span>*/}
              {/*</button>*/}
            </div>
            <div className="modal-body text-center">
              You still have remaining steps to complete your account activation process. Please check XXXX.XXXX@XXX.com and click the email sent to you to activate your account.
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary"  onClick={() => this.toggleModal(TOGGLE_ACTIONS.HIDE)}>Close</button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
CustomModal.propTypes = {
  modal: PropTypes.object
};

const mapStateToProps = state => {
  return {
    modal: state.modal
  };
};

export default connect(
  mapStateToProps,
  dispatch => ({dispatch})
)(CustomModal);

