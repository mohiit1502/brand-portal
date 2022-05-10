import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Cookies from "electrode-cookies";

import { TOGGLE_ACTIONS, toggleModal} from "../../../../../actions/modal-actions";
import {showNotification} from "../../../../../actions/notification/notification-actions";

import Helper from "../../../../../utility/helper";
import ContentRenderer from "../../../../../utility/ContentRenderer";
import Validator from "../../../../../utility/validationUtil";
import mixpanel from "../../../../../utility/mixpanelutils";

import MIXPANEL_CONSTANTS from "../../../../../constants/mixpanelConstants";
import "../../../../../styles/home/content-renderer/user/profile/user-profile.scss";

class UserProfile extends React.Component {

  constructor (props) {
    super(props);
    const functions = ["displayChangePassword", "displayContactModal", "displayManageProfileNotification"];
    functions.forEach(name => {
      this[name] = this[name].bind(this);
    });
    this.validateState = Validator.validateState.bind(this);
    this.getSectionRenders = ContentRenderer.getSectionRenders.bind(this);
    this.loader = Helper.loader.bind(this);
    this.onInvalid = Validator.onInvalid.bind(this);
    this.invalid = {firstName: false, lastName: false, companyName: false, phone: false};
    const userProfileSectionConfig = this.props.userProfileSectionConfig ? this.props.userProfileSectionConfig : {};

    this.state = {
      isSeller: Cookies.get("bp_client_type") === "seller",
      loader: false,
      sectionsConfig: {...userProfileSectionConfig}
    };
  }

  displayManageProfileNotification () {
    let template = this.props.modalsMeta && this.props.modalsMeta.PASSWORD_RESET_SELLER;
    template = {templateName: "StatusModalTemplate", image: "", ...template};
    this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...template});
    mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_PROFILE.CHANGE_PASSWORD.DISPLAY_SELLER_MANAGE_PROFILE, {WORK_FLOW: "EDIT_USER_PROFILE"});
  }

  displayChangePassword() {
    const meta = { templateName: "ResetPasswordTemplate" };
    this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
    mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_PROFILE.CHANGE_PASSWORD.DISPLAY_CHANGE_PASSWORD, {WORK_FLOW: "EDIT_USER_PROFILE"});
  }

  displayContactModal() {
    const meta = { templateName: "FormModalTemplate", context: "edit"};
    this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
  }

  /* eslint-disable react/jsx-handler-names */
  render () {
      return <div className={`user-profile-content h-100 ml-4 mt-5${this.state.loader ? " loader" : ""}`}>
        {this.getSectionRenders()}
      </div>
  }
}

UserProfile.propTypes = {
  dispatchDiscardChanges: PropTypes.func,
  modalsMeta: PropTypes.object,
  shouldDiscard: PropTypes.bool,
  showNotification: PropTypes.func,
  toggleModal: PropTypes.func,
  userProfile: PropTypes.object,
  updateUserProfile: PropTypes.func,
  userProfileSectionConfig: PropTypes.object
};

const mapStateToProps = state => {
  return {
    modalsMeta: state.content.metadata ? state.content.metadata.MODALSCONFIG : {},
    userProfileSectionConfig: state.content && state.content.metadata && state.content.metadata.SECTIONSCONFIG && state.content.metadata.SECTIONSCONFIG.PROFILE,
    shouldDiscard: state.modal.shouldDiscard,
    userProfile: state.user.profile
  };
};

const mapDispatchToProps = {
  showNotification,
  toggleModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile);
