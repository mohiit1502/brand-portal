import React from "react";
import { connect } from "react-redux";
import "../../styles/content-renderer-onboarding/company-profile-registration.scss";
import CustomInput from "../custom-input/custom-input";

class CompanyProfileRegistration extends React.Component {

  constructor(props) {
    super(props);

    this.onInputChange = this.onInputChange.bind(this);
    this.uploadPrimaryDocument = this.uploadPrimaryDocument.bind(this);
    this.uploadAdditionalDocument = this.uploadAdditionalDocument.bind(this);
    this.resetCompanyRegistration = this.resetCompanyRegistration.bind(this);
    this.gotoBrandRegistration = this.gotoBrandRegistration.bind(this);

    this.state = {
      isSubmitDisabled: true,
      form: {
        id: "company-profile-reg",
        inputData: {
          companyName: {
            label: "Company Name",
            required: true,
            value: "",
            type: "text",
            pattern: null,
            disabled: false,
            subtitle: "Please ensure the company name entered is correct and matches the official document records.",
            error: ""
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
            pattern: null,
            disabled: true,
            subtitle: "",
            error: ""
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
          }
        }
      }
    };
  }

  onInputChange (evt, key) {
    if (evt && evt.target) {
      const targetVal = evt.target.value;
      this.setState(state => {
        state = {...state};
        state.form.inputData[key].value = targetVal;
        return {
          ...state
        };
      });
    }
  }

  uploadPrimaryDocument (evt) {
    console.log(evt.target.files);
  }

  uploadAdditionalDocument (evt) {
    alert(2);
  }

  resetCompanyRegistration () {

  }


  gotoBrandRegistration () {

  }


  render() {
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
              <form>
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
                    <div className="btn btn-sm btn-block btn-primary">Check</div>
                  </div>
                </div>
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
                      type={this.state.form.inputData.zip.type} pattern={this.state.form.inputData.zip.pattern}
                      onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.zip.disabled}
                      error={this.state.form.inputData.zip.error} subtitle={this.state.form.inputData.zip.subtitle}/>
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
                    <div className="file-upload-title">
                      Please provide business registration documents if you are a corporation
                    </div>
                    <label className="btn btn-sm btn-primary upload-btn">
                      Upload
                      <input type="file" className="d-none" onChange={this.uploadPrimaryDocument}/>
                    </label>
                  </div>
                </div>
                <div className="form-row additional-file-upload mb-3">
                  <div className="col">
                    <div className="file-upload-title">
                      Additonal document (optional)
                    </div>
                    <label className="btn btn-sm btn-primary upload-btn">
                      Upload
                      <input type="file" className="d-none" onChange={this.uploadAdditionalDocument}/>
                    </label>
                  </div>
                </div>
                <div className="form-row mt-3">
                  <div className="col text-right">
                    <div className="btn btn-sm cancel-btn text-primary" type="button" onClick={this.resetCompanyRegistration}>Cancel</div>
                    <button type="submit" className="btn btn-sm btn-primary submit-btn px-3 ml-3" disabled={this.state.isSubmitDisabled}
                      onClick={this.gotoBrandRegistration}> Next </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export  default  connect()(CompanyProfileRegistration);
