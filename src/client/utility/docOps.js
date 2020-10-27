import {CustomInterval} from "./timer-utils";
import Http from "./Http";

export default class DocumentActions {

  static displayProgressAndUpload (evt, key) {
    try {
      const file = evt.target.files[0];
      const filename = file.name;
      const interval = new CustomInterval(4, (value, active) => {
        const form = {...this.state.form};
        form.inputData[key].uploadPercentage = value;
        form.inputData[key].filename = filename;
        if (!active) {
          form.inputData[key].uploadPercentage = 100;
        }
        this.setState({form});
      });
      interval.start();
      const form = {...this.state.form};
      form.inputData[key].uploading = true;
      form.inputData.companyOnboardingActions.buttons.clear.disabled = true;
      this.setState({form}, (() => DocumentActions.uploadDocument.call(this, file, interval, key)));
    } catch (err) {
      const form = {...this.state.form};
      form.inputData[key].uploading = false;
      form.inputData.companyOnboardingActions.buttons.clear.disabled = false;
      this.setState({form});
      console.log(err);
    }
  }

  static async uploadDocument (file, interval, type) {
    try {
      const urlMap = {businessRegistrationDoc: "/api/company/uploadBusinessDocument", additionalDoc: "/api/company/uploadAdditionalDocument"};
      this.checkToEnableSubmit();
      const formData = new FormData();
      formData.append("file", file);
      // const uploadResponse = (await Http.postAsFormData(urlMap[type], formData)).body;
      const uploadResponse = (await Http.postAsFormData(urlMap[type], formData, null, null, this.props.showNotification)).body;
      interval.stop();
      window.setTimeout(() => {
        const updatedForm = {...this.state.form};
        updatedForm.inputData[type].uploading = false;
        updatedForm.inputData.companyOnboardingActions.buttons.clear.disabled = false;
        updatedForm.inputData[type].id = uploadResponse.id;
        this.setState({updatedForm}, this.checkToEnableSubmit);
      }, 700);
    } catch (e) {
      console.log(e);
    }
  }

  static cancelSelection(docKey) {
    const state = {...this.state}
    const form = {...state.form};
    state.form = form;
    form.inputData[docKey].id = "";
    form.inputData[docKey].uploading = false;
    form.inputData.companyOnboardingActions.buttons.clear.disabled = false;
    form.inputData[docKey].uploadPercentage = 0;
    form.inputData[docKey].filename = "";
    form.inputData[docKey].error = "";
    this.setState(state);
  }
}
