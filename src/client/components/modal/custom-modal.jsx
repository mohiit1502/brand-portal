import "bootstrap";
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import $ from "jquery";
import {TOGGLE_ACTIONS} from "../../actions/modal-actions";
import CreateUserTemplate from "../../components/modal/templates/create-user-template";

class CustomModal extends React.Component {


  constructor (props) {
    super(props);
    this.toggleModal = this.toggleModal.bind(this);
    this.defaultTemplate = this.defaultTemplate.bind(this);
  }

  componentDidMount() {

  }

  componentDidUpdate() {
    const toggleAction = this.props.modal.enable ? TOGGLE_ACTIONS.SHOW : TOGGLE_ACTIONS.HIDE;
    this.toggleModal(toggleAction);
  }

  defaultTemplate() {
    return (<div className="modal fade show" id="exampleModalCenter" tabIndex="-1" role="dialog">
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
    </div>);
  }

  fetchTemplate(key) {
    switch (key) {
      case "CreateUserTemplate" : return CreateUserTemplate;
    }
    return null;
  }

  toggleModal(toggleAction) {
    return $(".modal").modal(toggleAction);
  }

  render () {
    const CustomComponent = this.fetchTemplate(this.props.modal.template);
    return (
      CustomComponent && <CustomComponent toggleModal={this.toggleModal}/>
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

