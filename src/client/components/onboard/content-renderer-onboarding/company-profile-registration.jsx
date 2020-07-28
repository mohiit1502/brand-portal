import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Redirect} from "react-router";
import $ from "jquery";
import {dispatchCompanyState} from "./../../../actions/company/company-actions";
import Http from "../../../utility/Http";
import CustomInput from "../../custom-components/custom-input/custom-input";
import CheckGreenIcon from "../../../images/check-grn.svg";
import {CustomInterval} from "../../../utility/timer-utils";
import ProgressBar from "../../custom-components/progress-bar/progress-bar";
import CONSTANTS from "../../../constants/constants";
import Tooltip from "../../custom-components/tooltip/tooltip";
import infoIcon from "../../../images/question.svg";
import "../../../styles/onboard/content-renderer-onboarding/company-profile-registration.scss";

class CompanyProfileRegistration extends React.Component {
  constructor(props) {
    super(props);

    this.onInputChange = this.onInputChange.bind(this);
    this.uploadPrimaryDocument = this.uploadPrimaryDocument.bind(this);
    this.uploadAdditionalDocument = this.uploadAdditionalDocument.bind(this);
    this.resetCompanyRegistration = this.resetCompanyRegistration.bind(this);
    this.gotoBrandRegistration = this.gotoBrandRegistration.bind(this);
    this.checkCompanyNameAvailability = this.checkCompanyNameAvailability.bind(this);
    this.cancelPrimaryDocumentSelection = this.cancelPrimaryDocumentSelection.bind(this);
    this.cancelAdditionalDocumentSelection = this.cancelAdditionalDocumentSelection.bind(this);
    this.cancelDocumentSelection = this.cancelDocumentSelection.bind(this);
    this.undertakingtoggle = this.undertakingtoggle.bind(this);
    this.onInvalidHandler = this.onInvalidHandler.bind(this);
    this.invalid = {zip: false};

    this.state = this.props.companyState && Object.keys(this.props.companyState).length > 0 ? this.props.companyState : {
      isSubmitDisabled: true,
      redirectToBrands: false,
      form: {
        id: "company-profile-reg",
        shouldCheckCompanyUniqueness: true,
        inputData: {
          companyName: {
            label: "Company Name",
            required: true,
            value: "",
            type: "text",
            pattern: null,
            disabled: false,
            isUnique: true,
            subtitle: "Please ensure the company name entered is correct and matches the official document records.",
            error: "",
            requestAdministratorAccess: false
          },
          address: {
            label: "Address",
            required: true,
            value: "",
            type: "text",
            pattern: null,
            disabled: true,
            subtitle: "Autocomplete Powered by Google",
            error: ""
          },
          city: {
            label: "City",
            required: true,
            value: "",
            type: "text",
            pattern: null,
            disabled: true,
            subtitle: "",
            error: ""
          },
          state: {
            label: "State",
            required: true,
            value: "",
            type: "text",
            pattern: null,
            disabled: true,
            subtitle: "",
            error: ""
          },
          zip: {
            label: "ZIP",
            required: true,
            value: "",
            type: "text",
            pattern: CONSTANTS.REGEX.ZIP,
            // pattern: "",
            patternErrorMessage: "Invalid Zip Code",
            invalidError: CONSTANTS.REGEX.ZIPERROR,
            disabled: true,
            subtitle: "",
            error: "",
            maxLength: 10
          },
          country: {
            label: "Country",
            required: true,
            value: "USA",
            type: "text",
            pattern: null,
            disabled: true,
            subtitle: "",
            error: ""
          },
          businessRegistrationDoc: {
            id: "",
            uploading: false,
            uploadPercentage: 0,
            filename: "",
            error: ""
          },
          additionalDoc: {
            id: "",
            uploading: false,
            uploadPercentage: 0,
            filename: "",
            error: ""
          }
        },
        requestAccessUndertaking: {
          selected: false,
          label: "I have read and agree to the Terms Of Use."
        }
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

  undertakingtoggle () {
    const state = {...this.state};
    state.form.requestAccessUndertaking.selected = !state.form.requestAccessUndertaking.selected;
    this.setState({
      ...state
    }, this.checkToEnableSubmit);
  }

  checkToEnableSubmit () {
    const form = {...this.state.form};
    const bool = form.inputData.companyName.value &&
      form.inputData.address.value &&
      form.inputData.city.value &&
      form.inputData.state.value &&
      form.inputData.zip.value &&
      !form.inputData.businessRegistrationDoc.uploading &&
      !form.inputData.additionalDoc.uploading &&
//       form.inputData.businessRegistrationDoc.id &&
      !form.inputData.zip.error;
    this.setState({isSubmitDisabled: !bool});
  }

  onInputChange (evt, key) {
    if (evt && evt.target) {
      const targetVal = evt.target.value;
      // eslint-disable-next-line no-unused-expressions
      evt.target.pattern && evt.target.checkValidity();
      this.setState(state => {
        state = {...state};
        if (key === "companyName") {
          // state.form.inputData[key].isUnique = false;
          this.toggleFormEnable(false, true, true);
        }
        state.form.inputData[key].value = targetVal;
        state.form.inputData[key].error = !this.invalid[key] ? "" : state.form.inputData[key].error;
        this.invalid[key] = false;
        return {
          ...state
        };
      }, this.checkToEnableSubmit);
    }
  }

  toggleFormEnable(enable, isUnique, checkCompanyUniqueness) {
    const form = {...this.state.form};
    form.inputData.companyName.isUnique = isUnique;
    form.inputData.companyName.error = enable ? form.inputData.companyName.error : "";
    form.inputData.address.disabled = !enable;
    form.inputData.city.disabled = !enable;
    form.inputData.state.disabled = !enable;
    form.inputData.zip.disabled = !enable;
    form.inputData.companyName.requestAdministratorAccess = !form.inputData.companyName.isUnique;
    form.shouldCheckCompanyUniqueness = checkCompanyUniqueness;
    this.setState({form});
  }

  async checkCompanyNameAvailability () {
    try {
      if (!this.state.form.inputData.companyName.value) {
        return;
      }
      const response = (await Http.get("/api/company/availability", {name: this.state.form.inputData.companyName.value}));
      if (!response.body.unique) {
        // eslint-disable-next-line no-throw-literal
        throw {
          error: `${response.body.name} has already been registered as brand. You can request the administraor for access. However, If you feel your brand has been misrepresented, Please contact help.brand@walmart.com for further assitance.`
        };
      }
      this.toggleFormEnable(true, true, false);
    } catch (err) {
      const form = {...this.state.form};
      form.inputData.companyName.isUnique = false;
      form.inputData.companyName.error = err.error;
      form.inputData.companyName.requestAdministratorAccess = true;
      this.setState({form});
      // console.log(err);
    }
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
      this.setState(state => {
        state = {...state};
        state.form = form;
        return state;
      }, () => this.uploadDocument(file, interval, "businessRegistrationDoc"));
    } catch (err) {
      const form = {...this.state.form};
      form.inputData.businessRegistrationDoc.uploading = false;
      this.setState({form});
      console.log(err);
    }
  }

  async uploadDocument (file, interval, type) {
    const urlMap = {businessRegistrationDoc: "/api/company/uploadBusinessDocument", additionalDoc: "/api/company/uploadAdditionalDocument"};
    this.checkToEnableSubmit();
    const formData = new FormData();
    formData.append("file", file);
    const uploadResponse = (await Http.postAsFormData(urlMap[type], formData)).body;
    interval.stop();
    window.setTimeout(() => {
      const updatedForm = {...this.state.form};
      updatedForm.inputData[type].uploading = false;
      updatedForm.inputData[type].id = uploadResponse.id;
      this.setState({updatedForm}, this.checkToEnableSubmit);
    }, 700);
  }

  cancelDocumentSelection(docKey) {
    const form = {...this.state.form};
    form.inputData[docKey].id = "";
    form.inputData[docKey].uploading = false;
    form.inputData[docKey].uploadPercentage = 0;
    form.inputData[docKey].filename = "";
    form.inputData[docKey].error = "";
    this.setState({form});
  }

  cancelPrimaryDocumentSelection () {
    this.cancelDocumentSelection("businessRegistrationDoc");
  }

  cancelAdditionalDocumentSelection() {
    this.cancelDocumentSelection("additionalDoc");
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
      this.setState(state => {
        state = {...state};
        state.form = form;
        return state;
      }, await (() => this.uploadDocument(file, interval, "additionalDoc")));
    } catch (err) {
      const form = {...this.state.form};
      form.inputData.additionalDoc.uploading = false;
      this.setState({form});
      console.log(err);
    }
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
    });
    docKeys.forEach(key => {form.inputData[key].id = "";});
    form.inputData.companyName.isUnique = true;
    form.inputData.companyName.disabled = false;
    form.inputData.companyName.requestAdministratorAccess = false;
    form.shouldCheckCompanyUniqueness = true;
    state.isSubmitDisabled = true;

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
    this.props.updateOrgData(org);
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


  render() {
    if (this.state.redirectToBrands) {
      return <Redirect to={CONSTANTS.ROUTES.ONBOARD.BRAND_REGISTER} />;
    }

    return (
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-12">
          <div className="row title-row mb-4">
            <div className="col">
              <div className="row">
                <div className="col">
                  <div className="company-registration-title">
                    Create Company Profile
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="company-registration-subtitle">
                    Provide the information in the form below to create your company profile .
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row company-reg-form-row">
            <div className="col">
              <form onSubmit={this.gotoBrandRegistration}>
                <div className="form-row">
                  <div className="col-10">
                    <CustomInput key={"companyName"}
                      inputId={"companyName"}
                      formId={this.state.form.id} label={this.state.form.inputData.companyName.label}
                      required={this.state.form.inputData.companyName.required} value={this.state.form.inputData.companyName.value}
                      type={this.state.form.inputData.companyName.type} pattern={this.state.form.inputData.companyName.pattern}
                      onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.companyName.disabled}
                      error={this.state.form.inputData.companyName.error} subtitle={this.state.form.inputData.companyName.subtitle}/>
                  </div>
                  <div className="col-2">
                    <div className={`btn btn-sm btn-block ${this.state.form.inputData.companyName.isUnique && !this.state.form.shouldCheckCompanyUniqueness ? "btn-success" : "btn-primary"}${!this.state.form.inputData.companyName.value ? " disabled" : ""}`}
                      onClick={this.checkCompanyNameAvailability}>
                      {this.state.form.inputData.companyName.isUnique && !this.state.form.shouldCheckCompanyUniqueness ? <img className="check-green-icon-white-bg" src={CheckGreenIcon} /> : "Check"}
                    </div>
                  </div>
                </div>
                {
                  !this.state.form.inputData.companyName.requestAdministratorAccess &&
                  <React.Fragment>
                    <div className="form-row">
                      <div className="col">
                        <CustomInput key={"address"}
                          inputId={"address"}
                          formId={this.state.form.id} label={this.state.form.inputData.address.label}
                          required={this.state.form.inputData.address.required} value={this.state.form.inputData.address.value}
                          type={this.state.form.inputData.address.type} pattern={this.state.form.inputData.address.pattern}
                          onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.address.disabled}
                          error={this.state.form.inputData.address.error} subtitle={this.state.form.inputData.address.subtitle}/>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="col">
                        <CustomInput key={"city"}
                          inputId={"city"}
                          formId={this.state.form.id} label={this.state.form.inputData.city.label}
                          required={this.state.form.inputData.city.required} value={this.state.form.inputData.city.value}
                          type={this.state.form.inputData.city.type} pattern={this.state.form.inputData.city.pattern}
                          onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.city.disabled}
                          error={this.state.form.inputData.city.error} subtitle={this.state.form.inputData.city.subtitle}/>
                      </div>
                      <div className="col">
                        <CustomInput key={"state"}
                          inputId={"state"}
                          formId={this.state.form.id} label={this.state.form.inputData.state.label}
                          required={this.state.form.inputData.state.required} value={this.state.form.inputData.state.value}
                          type={this.state.form.inputData.state.type} pattern={this.state.form.inputData.state.pattern}
                          onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.state.disabled}
                          error={this.state.form.inputData.state.error} subtitle={this.state.form.inputData.state.subtitle}/>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="col">
                        <CustomInput key={"zip"}
                          inputId={"zip"}
                          formId={this.state.form.id} label={this.state.form.inputData.zip.label}
                          required={this.state.form.inputData.zip.required} value={this.state.form.inputData.zip.value}
                          type={this.state.form.inputData.zip.type} pattern={this.state.form.inputData.zip.pattern} onInvalidHandler={this.onInvalidHandler}
                          onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.zip.disabled} patternErrorMessage={this.state.form.inputData.zip.patternErrorMessage}
                          error={this.state.form.inputData.zip.error} subtitle={this.state.form.inputData.zip.subtitle} maxLength={this.state.form.inputData.zip.maxLength}/>
                      </div>
                      <div className="col">
                        <CustomInput key={"country"}
                          inputId={"country"}
                          formId={this.state.form.id} label={this.state.form.inputData.country.label}
                          required={this.state.form.inputData.country.required} value={this.state.form.inputData.country.value}
                          type={this.state.form.inputData.country.type} pattern={this.state.form.inputData.country.pattern}
                          onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.country.disabled}
                          error={this.state.form.inputData.country.error} subtitle={this.state.form.inputData.country.subtitle}/>
                      </div>
                    </div>
                    <div className="form-row primary-file-upload mb-3">
                      <div className="col">
                        <div className="file-upload-title mb-2">
                          Please provide business registration documents if you are a corporation (optional) <Tooltip placement={"right"} content={this.state.tooltip.docContent} icon={infoIcon}/>
                        </div>
                        {
                          !this.state.form.inputData.businessRegistrationDoc.uploading && !this.state.form.inputData.businessRegistrationDoc.id &&
                          <label className={`btn btn-sm btn-primary upload-btn mb-2${this.state.isSubmitDisabled || this.state.form.shouldCheckCompanyUniqueness ? " disabled" : ""}`}>
                            Upload
                            <input type="file" className="d-none" onChange={this.uploadPrimaryDocument} disabled={this.state.isSubmitDisabled || this.state.form.shouldCheckCompanyUniqueness} />
                          </label>
                        }
                        {
                          this.state.form.inputData.businessRegistrationDoc.uploading && !this.state.form.inputData.businessRegistrationDoc.id &&
                          <ProgressBar filename={this.state.form.inputData.businessRegistrationDoc.filename} uploadPercentage={this.state.form.inputData.businessRegistrationDoc.uploadPercentage} />
                        }
                        {
                          !this.state.form.inputData.businessRegistrationDoc.uploading && this.state.form.inputData.businessRegistrationDoc.id &&
                          <div className={`uploaded-file-label form-control mb-2`}>
                            {this.state.form.inputData.businessRegistrationDoc.filename}

                            <span aria-hidden="true" className="cancel-file-selection-btn float-right cursor-pointer" onClick={this.cancelPrimaryDocumentSelection}>&times;</span>
                          </div>
                        }
                      </div>
                    </div>
                    <div className="form-row additional-file-upload mb-3">
                      <div className="col">
                        <div className="file-upload-title mb-2">
                          Additonal document (optional) <Tooltip placement={"right"} content={this.state.tooltip.additionalDocContent} icon={infoIcon}/>
                        </div>
                        {
                          !this.state.form.inputData.additionalDoc.uploading && !this.state.form.inputData.additionalDoc.id &&
                          <label className={`btn btn-sm btn-primary upload-btn mb-2${this.state.isSubmitDisabled || this.state.form.shouldCheckCompanyUniqueness ? " disabled" : ""}`}>
                            Upload
                            <input type="file" className="d-none" multiple={true} onChange={this.uploadAdditionalDocument} disabled={this.state.isSubmitDisabled || this.state.form.shouldCheckCompanyUniqueness } />
                          </label>
                        }
                        {
                          this.state.form.inputData.additionalDoc.uploading && !this.state.form.inputData.additionalDoc.id &&
                          <ProgressBar filename={this.state.form.inputData.additionalDoc.filename} uploadPercentage={this.state.form.inputData.additionalDoc.uploadPercentage} />
                        }
                        {
                          !this.state.form.inputData.additionalDoc.uploading && this.state.form.inputData.additionalDoc.id &&
                          <div className={`uploaded-file-label form-control mb-2`}>
                            {this.state.form.inputData.additionalDoc.filename}

                            <span aria-hidden="true" className="cancel-file-selection-btn float-right cursor-pointer" onClick={this.cancelAdditionalDocumentSelection}>&times;</span>
                          </div>
                        }
                      </div>
                    </div>
                    <div className="form-row mt-3">
                      <div className="col text-right">
                        <div className="btn btn-sm cancel-btn text-primary" type="button" onClick={this.resetCompanyRegistration}>Clear</div>
                        <button type="submit" className="btn btn-sm btn-primary submit-btn px-3 ml-3" disabled={this.state.isSubmitDisabled || this.state.form.shouldCheckCompanyUniqueness } > Next </button>
                      </div>
                    </div>
                  </React.Fragment> ||
                  <React.Fragment>
                    <div className="form-row mt-5">
                      <div className="col">
                        <div className="form-check">
                          <input type="checkbox" id="user-undertaking" className="form-check-input user-undertaking" checked={this.state.form.requestAccessUndertaking.selected} required={true}
                            onChange={this.undertakingtoggle}/>
                          <label className="form-check-label user-undertaking-label" htmlFor="user-undertaking">
                            {this.state.form.requestAccessUndertaking.label}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="form-row mt-3">
                      <div className="col text-right">
                        <div className="btn btn-sm cancel-btn text-primary" type="button">Cancel</div>
                        <button type="submit" className="btn btn-sm btn-primary submit-btn px-3 ml-3"
                          disabled={!this.state.form.requestAccessUndertaking.selected}> Request Access </button>
                      </div>
                    </div>
                  </React.Fragment>
                }

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
  updateOrgData: PropTypes.func,
  modal: PropTypes.object
};

const mapStateToProps = state => {
  return {
    companyState: state.company && state.company.companyState
  };
};

const mapDispatchToProps = {
  dispatchCompanyState
};


export default connect(mapStateToProps, mapDispatchToProps)(CompanyProfileRegistration);
