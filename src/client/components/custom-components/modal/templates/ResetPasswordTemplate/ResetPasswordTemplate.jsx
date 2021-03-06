/* eslint-disable filenames/match-regex, no-unused-expressions */
import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import Helper from "../../../../../utility/helper";
import Http from "../../../../../utility/Http";
import ContentRenderer from "../../../../../utility/ContentRenderer";
import {NOTIFICATION_TYPE, showNotification} from "../../../../../actions/notification/notification-actions";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../../actions/modal-actions";
import CONSTANTS from "../../../../../constants/constants";
import "./ResetPasswordTemplate.component.scss";
import mixpanel from "../../../../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../../../../constants/mixpanelConstants";

class ResetPasswordTemplate extends Component {
  constructor(props) {
    super(props);
    const functions = ["bubbleValue", "onChange", "resetTemplateStatus", "handleSubmit", "validateForm"];
    functions.forEach(name => {
      this[name] = this[name].bind(this);
    });
    this.loader = Helper.loader.bind(this);
    this.getFieldRenders = ContentRenderer.getFieldRenders.bind(this);
    const resetPasswordConfiguration = this.props.resetPasswordConfiguration ? this.props.resetPasswordConfiguration : {};
    this.state = {
      section: {...resetPasswordConfiguration.sectionConfig},
      form: {
        inputData: resetPasswordConfiguration.fields,
        ...resetPasswordConfiguration.formConfig
      }
    };
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

  onChange(evt, key) {
    if (evt && evt.target) {
      const targetVal = evt.target.value;
      this.setState(state => {
        state = {...state};
        if (key === "currentPassword" && state.form.error === state.form.incorrectPasswordError) {
          state.form.error = false;
        }
        if (key === "newPassword" || key === "confirmNewPassword") {
          (state.form.error === state.form.old5PasswordsError || state.form.error === state.form.passwordPolicyMessage) && (state.form.error = false);
          state.form.inputData.errorSub.error = state.form.passwordsDifferent ? state.form.passwordMismatchError : "";
        }
        state.form.inputData[key].value = targetVal;
        state.form.inputData[key].isDirty = true;
        return state;
      }, this.checkToEnableSubmit);
    }
  }

  validateForm () {
    const form = {...this.state.form};
    const inputData = {...form.inputData};
    let hasError = false;
    form.inputData = inputData;
    Object.keys(inputData).forEach(inputKey => {
      const inputObj = inputData[inputKey];
      if (inputObj.type === "text" || inputObj.type === "password" && !inputObj.value && inputObj.required) {
        hasError = true;
        inputObj.error = inputObj.validators && inputObj.validators.validateRequired && inputObj.validators.validateRequired.error;
      }
    });
    hasError = hasError || form.passwordsDifferent || form.error;
    if (hasError) {
      this.props.showNotification(NOTIFICATION_TYPE.ERROR, form.toastMessageExistingErrors);
    }
    hasError && this.setState({form});
    return hasError;
  }

  /* eslint-disable consistent-return */
  async handleSubmit(evt) {
    evt.preventDefault();
    const form = this.state.form;
    if (!this.validateForm()) {
      const currentPassword = form.inputData.currentPassword.value;
      const newPassword = form.inputData.newPassword.value;
      const payload = {oldPassword: currentPassword, newPassword};
      const url = form.apiPath;

      this.loader("form", true);
      const mixpanelPayload = {
        API: url,
        WORK_FLOW: "EDIT_USER_PROFILE"
      };
      return Http.post(url, payload, null, null, this.props.showNotification, this.state.form.passwordChangedMessage, this.state.form.failureMessage)
        .then(() => {
          this.resetTemplateStatus();
          this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
          this.loader("form", false);
          mixpanelPayload.API_SUCCESS = true;
        })
        /* eslint-disable complexity */
        .catch(err => {
          this.loader("form", false);
          err = err.error;
          if (err.status === CONSTANTS.STATUS_CODE_400) {
            if (form.falconPasswordMismatchError && err.message && err.message.toLowerCase() === form.falconPasswordMismatchError.toLowerCase()) {
              this.setState(state => {
                state = {...state};
                state.form.error = state.form.incorrectPasswordError;
                return true;
              });
            } else if (form.falconSamePasswordError && err.message && err.message.toLowerCase() === form.falconSamePasswordError.toLowerCase() && !form.passwordsDifferent) {
              this.setState(state => {
                state = {...state};
                state.form.error = form.old5PasswordsError;
                return true;
              });
            } else if (form.falconPasswordPolicyError && err.message && err.message.toLowerCase() === form.falconPasswordPolicyError.toLowerCase()) {
              this.setState(state => {
                state = {...state};
                state.form.error = form.passwordPolicyMessage;
                return true;
              });
            }
          }
          mixpanelPayload.API_SUCCESS = false;
          mixpanelPayload.ERROR = err.message ? err.message : err;
        })
        .finally(() => {
          mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_PROFILE.CHANGE_PASSWORD.CHANGE_PASSWORD, mixpanelPayload);
        });
    }
  }

  resetTemplateStatus() {
    const form = {...this.state.form};
    form.inputData.currentPassword.value = "";
    form.inputData.newPassword.value = "";
    form.inputData.confirmNewPassword.value = "";

    form.inputData.currentPassword.isDirty = false;
    form.inputData.newPassword.isDirty = false;
    form.inputData.confirmNewPassword.isDirty = false;

    form.inputData.currentPassword.error = "";
    form.inputData.newPassword.error = "";
    form.inputData.confirmNewPassword.error = "";

    form.inputData.errorSub.error = "";

    this.setState({form});
    this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
    mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_PROFILE.CHANGE_PASSWORD.CANCEL_CHANGE_PASSWORD, {WORK_FLOW: "EDIT_USER_PROFILE"});
  }

  render() {
    const section = this.state.section;
    const form = this.state.form;
    return (
      <div className="c-ResetPasswordTemplate modal fade show" id="singletonModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header align-items-center">
              {section.sectionTitle}
              {/* eslint-disable react/jsx-handler-names */}
              <button type="button" className="close text-white" aria-label="Close" onClick={this.resetTemplateStatus}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className={`modal-body text-left${this.state.form.loader ? " loader" : ""}`}>
              <form onSubmit={this.handleSubmit} className="h-100 px-2">
                <p>{form.formHeading}</p>
                {form.passwordGuidance && <small className={`form-text font-size-12 custom-input-help-text mb-3`} style={{color: "#777"}}>{ form.passwordGuidance }</small>}
                {form.error && <small className={`form-text custom-input-help-text text-danger mb-3 pl-3`}>{ form.error }</small>}
                {this.getFieldRenders()}
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


ResetPasswordTemplate.propTypes = {
  modal: PropTypes.object,
  toggleModal: PropTypes.func,
  data: PropTypes.object,
  resetPasswordConfiguration: PropTypes.object,
  showNotification: PropTypes.func
};

const mapStateToProps = state => {
  return {
    resetPasswordConfiguration: state.content && state.content.metadata && state.content.metadata.SECTIONSCONFIG && state.content.metadata.SECTIONSCONFIG.RESETPASSWORD,
    modal: state.modal
  };
};

const mapDispatchToProps = {
  toggleModal,
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPasswordTemplate);
