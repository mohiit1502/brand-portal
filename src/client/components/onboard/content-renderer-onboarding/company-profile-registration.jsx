import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Redirect} from "react-router";
import $ from "jquery";
import {dispatchCompanyState} from "./../../../actions/company/company-actions";
import Http from "../../../utility/Http";
import CustomInput from "../../custom-components/custom-input/custom-input";
import {showNotification} from "../../../actions/notification/notification-actions";
import {CustomInterval} from "../../../utility/timer-utils";
import CONSTANTS from "../../../constants/constants";
import Helper from "../../../utility/helper";
import FORMFIELDCONFIG from "./../../../config/formsConfig/form-field-meta";
import "../../../styles/onboard/content-renderer-onboarding/company-profile-registration.scss";
import Validator from "../../../utility/validationUtil";

class CompanyProfileRegistration extends React.Component {
  constructor(props) {
    super(props);
    const functions = ["getFieldRenders", "onChangeEvent", "uploadPrimaryDocument", "uploadAdditionalDocument", "resetCompanyRegistration", "gotoBrandRegistration", "cancelPrimaryDocumentSelection",
      "cancelAdditionalDocumentSelection", "cancelDocumentSelection", "cancelRequestCompanyAccess", "undertakingToggle", "onInvalidHandler"];
    const debounceFunctions = {"companyDebounce": "checkCompanyNameAvailability"};
    functions.forEach(name => this[name] = this[name].bind(this));
    Object.keys(debounceFunctions).forEach(name => {
      const functionToDebounce = Validator[debounceFunctions[name]] ? Validator[debounceFunctions[name]].bind(this) : this[debounceFunctions[name]];
      this[name] = Helper.debounce(functionToDebounce, CONSTANTS.APIDEBOUNCETIMEOUT);
    });
    this.invalid = {zip: false};

    this.state = this.props.companyState && Object.keys(this.props.companyState).length > 0 ? this.props.companyState : {
      redirectToBrands: false,
      form: {
        ...FORMFIELDCONFIG.SECTIONSCONFIG.COMPANYREG.sectionConfig,
        inputData: {...FORMFIELDCONFIG.SECTIONSCONFIG.COMPANYREG.fields}
      },
      tooltip: {
        docContent: (
          <div>
            <ol className="m-0 p-0">
              <ul className="m-0 pl-3 text-left font-size-12">
                <li>Upload an official copy of Business Registration Certificate</li>
                <li>Supported Documents: PDF, DOC, DOCX | Max : 8MB</li>
              </ul>
            </ol>
          </div>
        ),
        additionalDocContent: (
          <div>
            <ol className="m-0 p-0">
              <ul className="m-0 pl-3 text-left font-size-12">
                <li>Upload IP Registration Documents or Letter of Authorization</li>
                <li>Supported Documents: PDF, DOC, DOCX | Max : 8MB</li>
              </ul>
            </ol>
          </div>
        )
      }
    };
  }

  componentDidMount() {
    $("[data-toggle='tooltip']").tooltip();
  }

  undertakingToggle () {
    const state = {...this.state};
    state.form.inputData.undertakingToggle.selected = !state.form.inputData.undertakingToggle.selected;
    state.form.inputData.companyRequestApprovalActions.buttons.submit.disabled = !state.form.inputData.undertakingToggle.selected;
    this.setState(state, this.checkToEnableSubmit);
  }

  checkToEnableSubmit () {
    const form = {...this.state.form};
    const bool = form.inputData.companyName.value &&
      form.inputData.address.value &&
      form.inputData.city.value &&
      form.inputData.state.value &&
      form.inputData.zip.value &&
      // !form.inputData.businessRegistrationDoc.uploading &&
      // !form.inputData.additionalDoc.uploading &&
      !form.inputData.companyName.error &&
      !form.inputData.zip.error;
    form.isSubmitDisabled = !bool;
    form.inputData.companyOnboardingActions.buttons = {...form.inputData.companyOnboardingActions.buttons}
    form.inputData.companyOnboardingActions.buttons.submit.disabled = !bool;
    form.inputData.additionalDoc.disabled = !bool;
    form.inputData.businessRegistrationDoc.disabled = !bool;
    if (form.inputData.businessRegistrationDoc.uploading || form.inputData.additionalDoc.uploading) {
      form.inputData.companyOnboardingActions.buttons.submit.disabled = true;
    }
    this.setState({form});
  }

  onChangeEvent (evt, key) {
    if (evt && evt.target) {
      const targetVal = evt.target.value;
      evt.target.pattern && evt.target.checkValidity();
      this.setState(state => {
        state = {...state};
        if (key === "companyName") {
          // state.form.inputData[key].isUnique = false;
          evt.persist();
          state.form.inputData.companyName.fieldOk = false;
          state.form.isSubmitDisabled = true;
          state.form.inputData.companyOnboardingActions.buttons = {...state.form.inputData.companyOnboardingActions.buttons}
          state.form.inputData.companyOnboardingActions.buttons.submit.disabled = true;
          state.form.inputData.additionalDoc.disabled = true;
          state.form.inputData.businessRegistrationDoc.disabled = true;
          this.toggleFormEnable(false, false);
          this.companyDebounce(evt);
        }
        state.form.inputData[key].value = targetVal;
        state.form.inputData[key].error = !this.invalid[key] ? "" : state.form.inputData[key].error;
        this.invalid[key] = false;
        return state;
      }, key !== "companyName" ? this.checkToEnableSubmit : null);
    }
  }

  toggleFormEnable(enable, isUnique) {
    const form = {...this.state.form};
    form.inputData.companyName.isUnique = isUnique;
    form.inputData.companyName.error = !enable ? form.inputData.companyName.error : "";
    form.inputData.address.disabled = !enable;
    form.inputData.city.disabled = !enable;
    form.inputData.state.disabled = !enable;
    form.inputData.zip.disabled = !enable;
    form.requestAdministratorAccess = !form.inputData.companyName.isUnique;
    this.setState({form});
  }

  uploadPrimaryDocument (evt) {
    try {
      const file = evt.target.files[0];
      const filename = file.name;
      const interval = new CustomInterval(4, (value, active) => {
        const form = {...this.state.form};
        form.inputData.businessRegistrationDoc.uploadPercentage = value;
        form.inputData.businessRegistrationDoc.filename = filename;
        if (!active) {
          form.inputData.businessRegistrationDoc.uploadPercentage = 100;
        }
        this.setState({form});
      });
      interval.start();
      const form = {...this.state.form};
      form.inputData.businessRegistrationDoc.uploading = true;
      form.inputData.companyOnboardingActions.buttons.clear.disabled = true;
      this.setState({form}, () => this.uploadDocument(file, interval, "businessRegistrationDoc"));
    } catch (err) {
      const form = {...this.state.form};
      form.inputData.businessRegistrationDoc.uploading = false;
      form.inputData.companyOnboardingActions.buttons = {...form.inputData.companyOnboardingActions.buttons}
      form.inputData.companyOnboardingActions.buttons.clear.disabled = false;
      this.setState({form});
      console.log(err);
    }
  }

  async uploadAdditionalDocument (evt) {
    try {
      const file = evt.target.files[0];
      const filename = file.name;
      const interval = new CustomInterval(4, (value, active) => {
        const form = {...this.state.form};
        form.inputData.additionalDoc.uploadPercentage = value;
        form.inputData.additionalDoc.filename = filename;
        if (!active) {
          form.inputData.additionalDoc.uploadPercentage = 100;
        }
        this.setState({form});
      });
      interval.start();
      const form = {...this.state.form};
      form.inputData.additionalDoc.uploading = true;
      form.inputData.companyOnboardingActions.buttons.clear.disabled = true;
      this.setState({form}, await (() => this.uploadDocument(file, interval, "additionalDoc")));
    } catch (err) {
      const form = {...this.state.form};
      form.inputData.additionalDoc.uploading = false;
      form.inputData.companyOnboardingActions.buttons.clear.disabled = false;
      this.setState({form});
      console.log(err);
    }
  }

  async uploadDocument (file, interval, type) {
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

  cancelDocumentSelection(docKey) {
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

  cancelPrimaryDocumentSelection () {
    this.cancelDocumentSelection("businessRegistrationDoc");
  }

  cancelAdditionalDocumentSelection() {
    this.cancelDocumentSelection("additionalDoc");
  }

  cancelRequestCompanyAccess () {
    this.setState(state => {
      state = {...state};
      state.form.requestAdministratorAccess = false;
      return state;
    })
  }

  resetCompanyRegistration () {
    const state = {...this.state};
    const form = state.form = {...state.form};
    const inputKeys = ["companyName", "address", "city", "state", "zip"];
    const docKeys = ["businessRegistrationDoc", "additionalDoc"];
    inputKeys.forEach(key => {
      form.inputData[key].disabled = true;
      form.inputData[key].error = "";
      form.inputData[key].value = "";
      form.inputData[key].fieldOk = false;
    });
    docKeys.forEach(key => {
      form.inputData[key].id = "";
      form.inputData[key].uploadPercentage = 0;
    });
    form.inputData.companyName.isUnique = true;
    form.inputData.companyName.disabled = false;
    form.requestAdministratorAccess = false;
    form.isSubmitDisabled = true;
    form.inputData.companyOnboardingActions.buttons = {...state.form.inputData.companyOnboardingActions.buttons}
    form.inputData.companyOnboardingActions.buttons.submit.disabled = true;
    form.inputData.additionalDoc.disabled = true;
    form.inputData.businessRegistrationDoc.disabled = true;

    this.setState(state);
  }


  gotoBrandRegistration (evt) {
    evt.preventDefault();
    const org = {
      name: this.state.form.inputData.companyName.value,
      address: this.state.form.inputData.address.value,
      city: this.state.form.inputData.city.value,
      state: this.state.form.inputData.state.value,
      zip: this.state.form.inputData.zip.value,
      countryCode: this.state.form.inputData.country.value,
      businessRegistrationDocId: this.state.form.inputData.businessRegistrationDoc.id
    };
    if (this.state.form.inputData.additionalDoc.id) {
      org.additionalDocId = this.state.form.inputData.additionalDoc.id;
    }
    this.props.updateOrgData(org, "company");
    this.setState({redirectToBrands: true});
    this.props.dispatchCompanyState(this.state);
  }

  onInvalidHandler (evt, key) {
    const form = this.state.form;
    const matchedField = Object.keys(form.inputData).find(idKey => idKey === key);
    if (matchedField) {
      const matchedObj = form.inputData[matchedField];
      matchedObj.error = matchedObj.invalidError;
      this.invalid[key] = true;
      this.setState({form});
    }
  }

  layoutFields (inputData, id) {
    const laidoutFields = [];
    inputData && Object.keys(inputData).forEach(id => {
      const field = inputData[id];
      let layout = inputData[id].layout;
      layout = field.layout && field.layout.indexOf(".") > -1 ? layout.split(".") : [];
      const row = layout[0];
      const order = layout[1];
      const span = layout[2];
      let currentRowArray = laidoutFields[row - 1];
      if (!currentRowArray) {
        for (let i = 0; i < row; i++) {
          !laidoutFields[i] && laidoutFields.push([]);
        }
        currentRowArray = laidoutFields[row - 1];
      }
      const fieldMeta = {row, order, span, field};
      currentRowArray.push(fieldMeta);
    });

    laidoutFields.filter(item => item.length !== 0);

    laidoutFields && laidoutFields.forEach(row => {
      row.sort((item1, item2) => item1.order > item2.order);
    });

    return laidoutFields && laidoutFields.map((fieldRow, key1) => {
      return (
        <div className="form-row" key={key1}>
          {
            fieldRow && fieldRow.map((fieldMeta, key2) => {
              fieldMeta = {...fieldMeta};
              const colClass = fieldMeta.span === "12" ? "col" : `col-${fieldMeta.span}`;
              return (
                <div className={colClass} key={key1 + "-" + key2}>
                  <CustomInput formId={id} onChangeEvent={this.onChangeEvent} onKeyPress={this.onKeyPress} {...fieldMeta.field} parentRef={this} />
                </div>
              )
            })
          }
        </div>
      )
    });
  }

  getFieldRenders() {
    const form = {...this.state.form};
    if (form.conditionalRenders) {
      let conditionalRenders = [];
      Object.keys(form.conditionalRenders).map(fragmentKey => {
        const fragmentId = form.conditionalRenders[fragmentKey].id;
        const fragmentFields = form.conditionalRenders[fragmentKey].complyingFields;
        const fragmentCondition = form.conditionalRenders[fragmentKey].condition;
        const path = `${fragmentCondition.locator}.${fragmentCondition.flag}`
        const flagValue = Helper.search(path, this.state);
        if (flagValue === fragmentCondition.value) {
          const inputData = {...form.inputData};
          Object.keys(form.inputData).forEach(key => !fragmentFields.includes(key) && delete inputData[key]);
          conditionalRenders.push(this.layoutFields(inputData, form.id))
        }
      })
      return conditionalRenders;
    } else {
      return this.layoutFields(form.inputData, form.id);
    }
  }

  render() {
    if (this.state.redirectToBrands) {
      return <Redirect to={CONSTANTS.ROUTES.ONBOARD.BRAND_REGISTER} />;
    }

    const form = this.state.form;
    const inputData = form.inputData;

    return (
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-12">
          <div className="row title-row mb-4">
            <div className="col">
              <div className="row">
                <div className="col">
                  <div className="company-registration-title">
                    {form.sectionTitle}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="company-registration-subtitle">
                    {form.sectionSubTitle}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row company-reg-form-row">
            <div className="col">
              <form onSubmit={this.gotoBrandRegistration}>
                {/*<div className="form-row">*/}
                {/*  <div className="col">*/}
                {/*    <CustomInput key={"companyName"}*/}
                {/*                 inputId={"companyName"} formId={form.id} label={inputData.companyName.label}*/}
                {/*                 required={inputData.companyName.required}*/}
                {/*                 value={inputData.companyName.value} type={inputData.companyName.type}*/}
                {/*                 pattern={inputData.companyName.pattern}*/}
                {/*                 onChangeEvent={this.onChangeEvent} disabled={inputData.companyName.disabled}*/}
                {/*                 error={inputData.companyName.error}*/}
                {/*                 subtitle={inputData.companyName.subtitle} loader={inputData.companyName.loader}*/}
                {/*                 fieldOk={inputData.companyName.fieldOk} />*/}
                {/*  </div>*/}
                {/*</div>*/}
                { this.getFieldRenders()}
                {/*{*/}
                {/*  // TODO CODE: USERAPPROVAL - Uncomment below line once user approval flow is in progress*/}
                {/*  // !form.requestAdministratorAccess &&*/}
                {/*  <React.Fragment>*/}
                {/*    <div className="form-row">*/}
                {/*      <div className="col">*/}
                {/*        <CustomInput key={"address"}*/}
                {/*                     inputId={"address"}*/}
                {/*                     formId={form.id} label={inputData.address.label}*/}
                {/*                     required={inputData.address.required} value={inputData.address.value}*/}
                {/*                     type={inputData.address.type} pattern={inputData.address.pattern}*/}
                {/*                     onChangeEvent={this.onChangeEvent} disabled={inputData.address.disabled}*/}
                {/*                     error={inputData.address.error} subtitle={inputData.address.subtitle}/>*/}
                {/*      </div>*/}
                {/*    </div>*/}
                {/*    <div className="form-row">*/}
                {/*      <div className="col">*/}
                {/*        <CustomInput key={"city"}*/}
                {/*                     inputId={"city"}*/}
                {/*                     formId={form.id} label={inputData.city.label}*/}
                {/*                     required={inputData.city.required} value={inputData.city.value}*/}
                {/*                     type={inputData.city.type} pattern={inputData.city.pattern}*/}
                {/*                     onChangeEvent={this.onChangeEvent} disabled={inputData.city.disabled}*/}
                {/*                     error={inputData.city.error} subtitle={inputData.city.subtitle}/>*/}
                {/*      </div>*/}
                {/*      <div className="col">*/}
                {/*        <CustomInput key={"state"}*/}
                {/*                     inputId={"state"}*/}
                {/*                     formId={form.id} label={inputData.state.label}*/}
                {/*                     required={inputData.state.required} value={inputData.state.value}*/}
                {/*                     type={inputData.state.type} pattern={inputData.state.pattern}*/}
                {/*                     onChangeEvent={this.onChangeEvent} disabled={inputData.state.disabled}*/}
                {/*                     error={inputData.state.error} subtitle={inputData.state.subtitle}/>*/}
                {/*      </div>*/}
                {/*    </div>*/}
                {/*    <div className="form-row">*/}
                {/*      <div className="col">*/}
                {/*        <CustomInput key={"zip"}*/}
                {/*                     inputId={"zip"}*/}
                {/*                     formId={form.id} label={inputData.zip.label}*/}
                {/*                     required={inputData.zip.required} value={inputData.zip.value}*/}
                {/*                     type={inputData.zip.type} pattern={inputData.zip.pattern}*/}
                {/*                     onInvalidHandler={this.onInvalidHandler}*/}
                {/*                     onChangeEvent={this.onChangeEvent} disabled={inputData.zip.disabled}*/}
                {/*                     patternErrorMessage={inputData.zip.patternErrorMessage}*/}
                {/*                     error={inputData.zip.error} subtitle={inputData.zip.subtitle}*/}
                {/*                     maxLength={inputData.zip.maxLength}/>*/}
                {/*      </div>*/}
                {/*      <div className="col">*/}
                {/*        <CustomInput key={"country"}*/}
                {/*                     inputId={"country"}*/}
                {/*                     formId={form.id} label={inputData.country.label}*/}
                {/*                     required={inputData.country.required} value={inputData.country.value}*/}
                {/*                     type={inputData.country.type} pattern={inputData.country.pattern}*/}
                {/*                     onChangeEvent={this.onChangeEvent} disabled={inputData.country.disabled}*/}
                {/*                     error={inputData.country.error} subtitle={inputData.country.subtitle}/>*/}
                {/*      </div>*/}
                {/*    </div>*/}
                {/*    <div className="form-row primary-file-upload mb-3">*/}
                {/*      <div className="col">*/}
                {/*        <div className="file-upload-title mb-2">*/}
                {/*          Business registration documents (optional) <Tooltip placement={"right"}*/}
                {/*                                                              content={this.state.tooltip.docContent}*/}
                {/*                                                              icon={infoIcon}/>*/}
                {/*        </div>*/}
                {/*        {*/}
                {/*          !inputData.businessRegistrationDoc.uploading && !inputData.businessRegistrationDoc.id &&*/}
                {/*          <label*/}
                {/*            className={`btn btn-sm btn-primary upload-btn mb-2${this.state.form.isSubmitDisabled ? " disabled" : ""}`}>*/}
                {/*            Upload*/}
                {/*            <input type="file" className="d-none" onChange={this.uploadPrimaryDocument}*/}
                {/*                   disabled={this.state.form.isSubmitDisabled}/>*/}
                {/*          </label>*/}
                {/*        }*/}
                {/*        {*/}
                {/*          inputData.businessRegistrationDoc.uploading && !inputData.businessRegistrationDoc.id &&*/}
                {/*          <ProgressBar filename={inputData.businessRegistrationDoc.filename}*/}
                {/*                       uploadPercentage={inputData.businessRegistrationDoc.uploadPercentage}/>*/}
                {/*        }*/}
                {/*        {*/}
                {/*          !inputData.businessRegistrationDoc.uploading && inputData.businessRegistrationDoc.id &&*/}
                {/*          <div className={`uploaded-file-label form-control mb-2`}>*/}
                {/*            {inputData.businessRegistrationDoc.filename}*/}

                {/*            <span aria-hidden="true" className="cancel-file-selection-btn float-right cursor-pointer"*/}
                {/*                  onClick={this.cancelPrimaryDocumentSelection}>&times;</span>*/}
                {/*          </div>*/}
                {/*        }*/}
                {/*      </div>*/}
                {/*    </div>*/}
                {/*    <div className="form-row additional-file-upload mb-3">*/}
                {/*      <div className="col">*/}
                {/*        <div className="file-upload-title mb-2">*/}
                {/*          Additional documents (optional) <Tooltip placement={"right"}*/}
                {/*                                                   content={this.state.tooltip.additionalDocContent}*/}
                {/*                                                   icon={infoIcon}/>*/}
                {/*        </div>*/}
                {/*        {*/}
                {/*          !inputData.additionalDoc.uploading && !inputData.additionalDoc.id &&*/}
                {/*          <label*/}
                {/*            className={`btn btn-sm btn-primary upload-btn mb-2${this.state.form.isSubmitDisabled ? " disabled" : ""}`}>*/}
                {/*            Upload*/}
                {/*            <input type="file" className="d-none" multiple={true}*/}
                {/*                   onChange={this.uploadAdditionalDocument}*/}
                {/*                   disabled={this.state.form.isSubmitDisabled}/>*/}
                {/*          </label>*/}
                {/*        }*/}
                {/*        {*/}
                {/*          inputData.additionalDoc.uploading && !inputData.additionalDoc.id &&*/}
                {/*          <ProgressBar filename={inputData.additionalDoc.filename}*/}
                {/*                       uploadPercentage={inputData.additionalDoc.uploadPercentage}/>*/}
                {/*        }*/}
                {/*        {*/}
                {/*          !inputData.additionalDoc.uploading && inputData.additionalDoc.id &&*/}
                {/*          <div className={`uploaded-file-label form-control mb-2`}>*/}
                {/*            {inputData.additionalDoc.filename}*/}

                {/*            <span aria-hidden="true" className="cancel-file-selection-btn float-right cursor-pointer"*/}
                {/*                  onClick={this.cancelAdditionalDocumentSelection}>&times;</span>*/}
                {/*          </div>*/}
                {/*        }*/}
                {/*      </div>*/}
                {/*    </div>*/}
                {/*    <ButtonsPanel {...inputData.companyOnboardingActions} parentRef={this} />*/}
                {/*  </React.Fragment> ||*/}
                {/*  <React.Fragment>*/}
                {/*    <CheckBox {...inputData.undertakingToggle} parentRef={this}/>*/}
                {/*    <ButtonsPanel {...inputData.companyRequestApprovalActions} parentRef={this} />*/}
                {/*    /!*<div className="form-row mt-5">*!/*/}
                {/*    /!*  <div className="col">*!/*/}
                {/*    /!*    <div className="form-check">*!/*/}
                {/*    /!*      <input type="checkbox" id="user-undertaking" className="form-check-input user-undertaking"*!/*/}
                {/*    /!*             checked={form.requestAccessUndertaking.selected} required={true}*!/*/}
                {/*    /!*             onChange={this.undertakingToggle}/>*!/*/}
                {/*    /!*      <label className="form-check-label user-undertaking-label" htmlFor="user-undertaking">*!/*/}
                {/*    /!*        {form.requestAccessUndertaking.label}*!/*/}
                {/*    /!*      </label>*!/*/}
                {/*    /!*    </div>*!/*/}
                {/*    /!*  </div>*!/*/}
                {/*    /!*</div>*!/*/}
                {/*    /!*<div className="form-row mt-3">*!/*/}
                {/*    /!*  <div className="col text-right">*!/*/}
                {/*    /!*    <div className="btn btn-sm cancel-btn text-primary">Cancel</div>*!/*/}
                {/*    /!*    <button type="submit" className="btn btn-sm btn-primary submit-btn px-3 ml-3"*!/*/}
                {/*    /!*            disabled={!form.undertakingToggle.selected}> Request Access*!/*/}
                {/*    /!*    </button>*!/*/}
                {/*    /!*  </div>*!/*/}
                {/*    /!*</div>*!/*/}
                {/*  </React.Fragment>*/}
                {/*}*/}

              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CompanyProfileRegistration.propTypes = {
  companyState: PropTypes.object,
  dispatchCompanyState: PropTypes.func,
  showNotification: PropTypes.func,
  updateOrgData: PropTypes.func,
  modal: PropTypes.object
};

const mapStateToProps = state => {
  return {
    companyState: state.company && state.company.companyState
  };
};

const mapDispatchToProps = {
  dispatchCompanyState,
  showNotification
};


export default connect(mapStateToProps, mapDispatchToProps)(CompanyProfileRegistration);
