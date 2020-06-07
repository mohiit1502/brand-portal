import "bootstrap";
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import $ from "jquery";
import {TOGGLE_ACTIONS} from "../../../actions/modal-actions";
import CreateUserTemplate from "./templates/create-user-template";
import NewUserAddedTemplate from "./templates/new-user-added-template";
import CompanyBrandRegisteredTemplate from "./templates/company-brand-registered-template";

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
    }
    return null;
  }

  toggleModal(toggleAction) {
    const modalElements = $(".modal");
    const backdrop = $(".modal-backdrop");
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

