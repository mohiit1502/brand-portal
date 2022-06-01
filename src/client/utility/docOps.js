/* eslint-disable no-magic-numbers, no-undef, no-unused-expressions */
import {CustomInterval} from "./timer-utils";
import Http from "./Http";
import mixpanel from "../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../constants/mixpanelConstants";
import {NOTIFICATION_TYPE} from "../actions/notification/notification-actions";

export default class DocumentActions {

  // eslint-disable-next-line max-statements
  static displayProgressAndUpload (evt, key, callback) {
    const form = {...this.state.form};
    const otherType = form.inputData[key].otherType;
    const submitButton = form.submitButton;
    const contextSpecificArgs = {actionsToDisable: form.actionsToDisable, endpoint: form.inputData[key].endpoint, formActions: form.formActions,
      key, otherType, submitButton, callback};
    try {
      const file = evt.target.files[0];
      const filename = file.name;
      const fileSize = file.size;
      let allowedFileSize = form.inputData[key].allowedFileSize;
      let allowedFileNameRegex = form.inputData[key].allowedFileNameRegex;
      if (allowedFileSize) {
        allowedFileSize = allowedFileSize * 1024 * 1024;
        if (fileSize > allowedFileSize) {
          this.setState(state => {
            state.form.inputData[key].error = state.form.inputData[key].fileValidationError;
            return state;
          })
          return;
        }
      }
      if (allowedFileNameRegex) {
        const fileNameRegex = new RegExp(allowedFileNameRegex);
        if (!fileNameRegex.test(filename)) {
          this.setState(state => {
            state.form.inputData[key].error = state.form.inputData[key].fileValidationError;
            return state;
          })
          return;
        }
      }
      form.inputData[key].filename = filename;
      const interval = new CustomInterval(4, (value, active) => {
        const formInner = {...this.state.form};
        formInner.inputData[key].uploadPercentage = value;
        !active && (formInner.inputData[key].uploadPercentage = 100);
        this.setState({formInner});
      });
      interval.start();
      form.inputData[key].uploading = true;
      form.actionsToDisable && form.actionsToDisable.forEach(action => {form.inputData[form.formActions].buttons[action].disabled = true;});
      this.setState({form}, (() => DocumentActions.uploadDocument.call(this, file, interval, contextSpecificArgs)));
    } catch (err) {
      form.inputData[key].uploading = false;
      otherType && form.actionsToDisable && form.actionsToDisable.forEach(action => {form.inputData[form.formActions].buttons[action].disabled = form.inputData[otherType].uploading;});
      this.setState({form});
    }
  }

  /* eslint-disable max-statements */
  static async uploadDocument (file, interval, contextSpecificArgs) {
    const {actionsToDisable, endpoint, formActions, key, otherType, submitButton, callback} = contextSpecificArgs;
    const mixpanelPayload = {
      DOCUMENT_TYPE: key,
      FILE_TYPE: file.type,
      FILE_SIZE: file.size,
      WORK_FLOW: "COMPANY_ONBOARDING"
    };
    const form = {...this.state.form};
    try {
      mixpanelPayload.API = endpoint;
      this.checkToEnableSubmit && this.checkToEnableSubmit();
      const formData = new FormData();
      formData.append("file", file);
      const uploadResponse = (await Http.postAsFormData(endpoint, formData, {clientType: this.state.clientType}, null, this.props.showNotification, "Document uploaded successfully!")).body;
      interval.stop();
      window.setTimeout(() => {
        const updatedForm = {...this.state.form};
        updatedForm.inputData[key].uploading = false;
        otherType && actionsToDisable && actionsToDisable.forEach(action => {updatedForm.inputData[formActions].buttons[action].disabled = updatedForm.inputData[otherType].uploading;});
        updatedForm.inputData[key].id = uploadResponse.id;
        callback && callback();
        this.setState({updatedForm}, this.checkToEnableSubmit);
      }, 700);
      mixpanelPayload.API_SUCCESS = true;
    } catch (e) {
      form.inputData[key].uploading = false;
      otherType && actionsToDisable && actionsToDisable.forEach(action => {form.inputData[formActions].buttons[action].disabled = form.inputData[otherType].uploading;});
      formActions && (form.inputData[formActions].buttons[submitButton || "submit"].disabled = false);
      this.props.showNotification(NOTIFICATION_TYPE.ERROR, "Couldn't upload the document, please try again.");
      this.setState({form}, this.checkToEnableSubmit);
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = e.message ? e.message : e;
    }
    mixpanel.trackEvent(MIXPANEL_CONSTANTS.FILE_UPLOAD_EVENTS.UPLOAD_DOCUMENT, mixpanelPayload);
  }

  static cancelSelection(docKey) {
    const state = {...this.state};
    const form = {...state.form};
    const formActions = form.formActions;
    const actionsToDisable = form.actionsToDisable;
    state.form = form;
    form.inputData[docKey].id = "";
    form.inputData[docKey].uploading = false;
    actionsToDisable && actionsToDisable.forEach(action => {form.inputData[formActions].buttons[action].disabled = false;});
    form.inputData[docKey].uploadPercentage = 0;
    form.inputData[docKey].filename = "";
    form.inputData[docKey].error = "";
    this.setState(state);
    const mixpanelPayload = {
      DOCUMENT_TYPE: docKey,
      WORK_FLOW: "COMPANY_ONBOARDING"
    };
    mixpanel.trackEvent(MIXPANEL_CONSTANTS.FILE_UPLOAD_EVENTS.CANCEL_DOCUMENT, mixpanelPayload);
  }
}
