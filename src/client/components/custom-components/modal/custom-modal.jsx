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
      case "CreateUserTemplate": return CreateUserTemplate;
      case "NewUserAddedTemplate": return NewUserAddedTemplate;
      case "CompanyBrandRegisteredTemplate": return CompanyBrandRegisteredTemplate;
      case "NewBrandTemplate": return NewBrandTemplate;
      case "NewClaimTemplate": return NewClaimTemplate;
      case "NewClaimAddedTemplate": return NewClaimAddedTemplate;
      case "ClaimDetailsTemplate": return ClaimDetailsTemplate;
    }
    return null;
  }

  toggleModal(toggleAction) {
    const modalElements = $(".modal");
    const backdrop = $(".modal-backdrop");
    if (backdrop.length) {
      backdrop.remove();
    }
    const options = {
      backdrop: "static",
      show: toggleAction.toLowerCase() === "show"
    };
    modalElements.modal(options);
    if (toggleAction.toLowerCase() !== "show") {
      backdrop.remove();
    }
    return modalElements;
  }

  render () {
    const CustomComponent = this.fetchTemplate(this.props.modal.template);
    return (
      CustomComponent && <CustomComponent  data={this.props.modal.data}/>
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

