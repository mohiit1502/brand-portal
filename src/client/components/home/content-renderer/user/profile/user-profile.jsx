import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Http from "../../../../../utility/Http";
import {updateUserProfile} from "../../../../../actions/user/user-actions";
import {dispatchDiscardChanges, TOGGLE_ACTIONS, toggleModal} from "../../../../../actions/modal-actions"
import {showNotification} from "../../../../../actions/notification/notification-actions"
import InputFormatter from "../../../../../utility/phoneOps";
import Helper from "../../../../../utility/helper";
import ContentRenderer from "../../../../../utility/ContentRenderer";
import Validator from "../../../../../utility/validationUtil";
// import FORMFIELDCONFIG from "./../../../../../config/formsConfig/form-field-meta";
import "../../../../../styles/home/content-renderer/user/profile/user-profile.scss";
import CONSTANTS from "../../../../../constants/constants";
import mixpanel from "../../../../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../../../../constants/mixpanelConstants";
import Cookies from "electrode-cookies";

class UserProfile extends React.Component {

  constructor (props) {
    super(props);
    const functions = ["bubbleValue", "displayChangePassword", "displayManageProfileNotification", "isDirty", "onChange", "setFormData", "disableInput", "saveUser"];
    functions.forEach(name => this[name] = this[name].bind(this));
    this.validateState = Validator.validateState.bind(this);
    this.getFieldRenders = ContentRenderer.getFieldRenders.bind(this);
    this.loader = Helper.loader.bind(this);
    this.onInvalid = Validator.onInvalid.bind(this);
    this.invalid = {firstName: false, lastName: false, companyName: false, phone: false};
    const userProfileConfiguration = this.props.userProfileContent ? this.props.userProfileContent : {}

    this.state = {
      section: {...userProfileConfiguration.sectionConfig},
      form: {
        ...userProfileConfiguration.formConfig,
        inputData: {...userProfileConfiguration.fields},
        // underwritingChecked: false,
      },
      isSeller: Cookies.get("client_type") === "seller"
    };

    const formatter = new InputFormatter();
    const handlers = formatter.on(`#${this.state.section.id}-${this.state.form.inputData.phone.inputId}-custom-input`);
    this.prebounceChangeHandler = handlers.inputHandler;

    Object.keys(this.state.form.inputData).forEach(itemKey => {
      const item = this.state.form.inputData[itemKey];
      this.state.form.inputData[itemKey].value = Helper.search(item.initValuePath, this.props.userProfile);
      if  (itemKey === "phone") {
        const value = this.state.form.inputData[itemKey].value;
        this.state.form.inputData[itemKey].value = (value === "0000000000") || (value === "(000) 000-0000") ? "" : value;
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setFormData(this.props.userProfile);
    }
  }

  isDirty () {
    const {firstName: originalFName, lastName: originalLName, email: originalEmail, phoneNumber: originalPhone, companyName: originalCompany} = this.props.userProfile;
    const {firstName: {value: currentFName}, lastName: {value: currentLName}, emailId: {value: currentEmail}, phone: {value: currentPhone}} = this.state.form.inputData;
    const currentCompany = this.state.form.inputData.company ? this.state.form.inputData.company.value : "";
    const originalPhoneModified = (originalPhone === "0000000000" || originalPhone === "(000) 000-0000") ? "" : originalPhone;
    return originalFName !== currentFName || originalLName !== currentLName || originalEmail !== currentEmail || originalPhoneModified !== currentPhone || (originalCompany && currentCompany && originalCompany !== currentCompany);
      // || ((!originalCompany && currentCompany) || (originalCompany && !currentCompany) || (originalCompany !== currentCompany));
  }

  setFormData(obj) {
    if (this.props.shouldDiscard) {
      const form = {...this.state.form};
      form.isDisabled = true;
      form.inputData.firstName.value = obj.firstName;
      form.inputData.lastName.value = obj.lastName;
      form.inputData.companyName.value = obj.type === "ThirdParty" ? obj.companyName : "";
      form.inputData.emailId.value = obj.email;
      form.inputData.phone.value = (obj.phoneNumber === "0000000000") || (obj.phoneNumber === "(000) 000-0000") ? "" : obj.phoneNumber;

      Object.keys(form.inputData).forEach(key => {
        if (key !== "emailId") {
          const item = form.inputData[key];
          item.disabled = true;
          item.error = "";
        }
      });

      this.setState({form});
      this.props.dispatchDiscardChanges(false);
    }
  }

  bubbleValue (evt, key, error) {
    const targetVal = evt.target.value;
    this.setState(state => {
      state = {...state};
      state.form.inputData[key].value = targetVal;
      state.form.inputData[key].error = error;
      return state;
    });
  }

  onChange (evt, key) {
    if (evt && evt.target) {
      if (evt.target.pattern && evt.target.checkValidity()) {
        this.invalid[key] = false;
      }
      const targetVal = evt.target.value;
      this.setState(state => {
        state = {...state};
        const inputData = state.form.inputData;
        state.form.inputData[key].value = targetVal;
        inputData[key].error = !this.invalid[key] ? "" : inputData[key].error;
        this.invalid[key] = false;
        return {
          ...state
        };
      });
    }
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

  disableInput (disable) {
    disable = !!disable;
    if (disable && this.isDirty()) {
      const meta = { templateName: "Alert" };
      this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_PROFILE.EDIT_USER_PROFILE.CANCEL_EDIT_PROFILE, {WORK_FLOW: "EDIT_USER_PROFILE"});
    } else {
      const form = {...this.state.form};
      form.isDisabled = disable;
      form.inputData.phone.disabled = disable;
      Object.keys(form.inputData).forEach(key => {
        if (key !== "emailId") {
          const item = form.inputData[key];
          item.disabled = disable;
          item.error = "";
        }
      });
      this.setState({form});
      if (!disable) mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_PROFILE.EDIT_USER_PROFILE.EDIT_PROFILE, {WORK_FLOW: "EDIT_USER_PROFILE"});
    }
  }

  // toggleUnderwritingCheck () {
  //   const form = {...this.state.form};
  //   form.underwritingChecked = !form.underwritingChecked;
  //   this.setState({form});
  // }

  async saveUser (evt) {
    evt.preventDefault();

    if (!this.validateState()) {
      this.loader("form", true);
      const loginId = this.state.form.inputData.emailId.value;
      const firstName = this.state.form.inputData.firstName.value;
      const lastName = this.state.form.inputData.lastName.value;
      const phoneNumber = this.state.form.inputData.phone.value ? this.state.form.inputData.phone.value : "0000000000"; //[note:to handle VIP phone number validation]
      const payload = {
        user: {
          loginId,
          firstName,
          lastName,
          phoneNumber,
          properties: {
            companyName: this.state.form.inputData.companyName.value
          }
        }
      };

      const url = this.state.form.apiPath;
      if (this.isDirty()) {
        const mixpanelPayload = {
          API: url,
          WORK_FLOW: "EDIT_USER_PROFILE"
        };
        return Http.put(`${url}/${payload.user.loginId}`, payload, null, null, this.props.showNotification, this.state.form.profileSaveMessage)
          .then(async res => {
            this.loader("form", false);
            this.props.updateUserProfile(res.body);
            this.disableInput(true);
            mixpanelPayload.API_SUCCESS = true;
          })
          .catch(err => {
            this.loader("form", false);
            mixpanelPayload.API_SUCCESS = false;
            mixpanelPayload.ERROR = err.message ? err.message : err;
          })
          .finally(() => {
            mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_PROFILE.EDIT_USER_PROFILE.SAVE_PROFILE, mixpanelPayload);
          });
      } else {
        this.loader("form", false);
        this.disableInput(true);
      }
    }
    return null;
  }

  render () {
    return (
      <div className={`user-profile-content h-100${this.state.form.loader ? " loader" : ""}`}>
        <header className={this.state.section.headerClasses}>{this.state.section.sectionTitle}</header>
        <form className={this.state.section.formClasses} autoComplete="off" onSubmit={this.saveUser} style={{marginRight: "50%"}}>
          {this.getFieldRenders()}
        </form>
      </div>
    );
  }
}

UserProfile.propTypes = {
  dispatchDiscardChanges: PropTypes.func,
  shouldDiscard: PropTypes.bool,
  showNotification: PropTypes.func,
  toggleModal: PropTypes.func,
  userProfile: PropTypes.object,
  updateUserProfile: PropTypes.func
};

const mapStateToProps = state => {
  return {
    modalsMeta: state.content.metadata ? state.content.metadata.MODALSCONFIG : {},
    userProfileContent: state.content && state.content.metadata && state.content.metadata.SECTIONSCONFIG && state.content.metadata.SECTIONSCONFIG.USERPROFILE,
    shouldDiscard: state.modal.shouldDiscard,
    userProfile: state.user.profile
  };
};

const mapDispatchToProps = {
  dispatchDiscardChanges,
  showNotification,
  toggleModal,
  updateUserProfile
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile);
