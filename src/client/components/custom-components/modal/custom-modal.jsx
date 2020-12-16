import "bootstrap";
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import $ from "jquery";
import {TOGGLE_ACTIONS} from "../../../actions/modal-actions";
import CreateUserTemplate from "./templates/create-user-template";
import NewUserAddedTemplate from "./templates/new-user-added-template";
import CompanyBrandRegisteredTemplate from "./templates/company-brand-registered-template";
import NewBrandTemplate from "./templates/new-brand-template";
import NewClaimTemplate from "./templates/new-claim-template";
import NewClaimAddedTemplate from "./templates/new-claim-added-template";
import ClaimDetailsTemplate from "./templates/claim-details-template";
import CompanyVerificationPendingTemplate from "./templates/company-verification-pending-template";
import StatusModalTemplate from "./templates/StatusModalTemplate/StatusModalTemplate";
import Alert from "../../Alert/Alert";
import {DateSelector, ResetPasswordTemplate} from "../../index";


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


  fetchTemplate(key) {
    switch (key) {
      case "Alert": return Alert;
      case "DateSelectorTemplate": return DateSelector;
      case "ClaimDetailsTemplate": return ClaimDetailsTemplate;
      case "CompanyBrandRegisteredTemplate": return CompanyBrandRegisteredTemplate;
      case "CompanyVerificationPendingTemplate": return CompanyVerificationPendingTemplate;
      case "CreateUserTemplate": return CreateUserTemplate;
      case "NewBrandTemplate": return NewBrandTemplate;
      case "NewClaimAddedTemplate": return NewClaimAddedTemplate;
      case "NewClaimTemplate": return NewClaimTemplate;
      case "NewUserAddedTemplate": return NewUserAddedTemplate;
      case "ResetPasswordTemplate": return ResetPasswordTemplate;
      case "StatusModalTemplate": return StatusModalTemplate;
    }
    return null;
  }

  toggleModal(toggleAction) {
    const modalElements = $(".modal");
    const backdropModals = {
      "NewUserAddedTemplate": false,
      "StatusModalTemplate": false,
      "DateSelectorTemplate": true,
    };
    const backdrop = $(".modal-backdrop");
    if (backdrop) {
      backdrop.remove();
    }
    const options = {
      backdrop: backdropModals[this.props.modal.templateName] !== undefined ? backdropModals[this.props.modal.templateName] : "static",
      keyboard: false,
      show: toggleAction.toLowerCase() === "show"
    };
    modalElements.modal(options);
    if (toggleAction.toLowerCase() !== "show") {
      backdrop.remove();
    }
    return modalElements;
  }

  render () {
    const CustomComponent = this.fetchTemplate(this.props.modal.templateName);
    const meta = {...this.props.modal};
    return (
      CustomComponent && <CustomComponent data={this.props.modal.data} meta={meta} />
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

