import React from "react";
import { connect } from "react-redux";
import CustomInput from "../../custom-input/custom-input";

class BrandRegistration extends React.Component {

  constructor(props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
    this.gotoCompanyRegistration = this.gotoCompanyRegistration.bind(this);
    this.submitOnboardingForm = this.submitOnboardingForm.bind(this);

    this.state = {
      isSubmitDisabled: true,
      form: {
        id: "company-profile-reg",
        inputData: {
          trademarkNumber: {
            label: "Trademark Number",
            required: true,
            value: "",
            type: "text",
            pattern: null,
            disabled: false,
            subtitle: "Please input the correct number associated with your company trademark. Only USPTO registered trademarks will be accepted.",
            error: ""
          },
          brandName: {
            label: "Brand Name",
            required: true,
            value: "",
            type: "text",
            pattern: null,
            disabled: false,
            subtitle: "",
            error: ""
          },
          comments: {
            label: "Comments",
            required: false,
            value: "",
            type: "textarea",
            pattern: null,
            disabled: false,
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

  gotoCompanyRegistration () {

  }

  submitOnboardingForm () {

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
                    Thank you for sharing your company info.
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="company-registration-subtitle">
                    Now tell us about your brand
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
                    <CustomInput key={"trademarkNumber"}
                                 inputId={"trademarkNumber"}
                                 formId={this.state.form.id} label={this.state.form.inputData.trademarkNumber.label}
                                 required={this.state.form.inputData.trademarkNumber.required} value={this.state.form.inputData.trademarkNumber.value}
                                 type={this.state.form.inputData.trademarkNumber.type} pattern={this.state.form.inputData.trademarkNumber.pattern}
                                 onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.trademarkNumber.disabled}
                                 error={this.state.form.inputData.trademarkNumber.error} subtitle={this.state.form.inputData.trademarkNumber.subtitle}/>
                  </div>
                  <div className="col-2">
                    <div className="btn btn-sm btn-block btn-primary">Check</div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="col">
                    <CustomInput key={"brandName"}
                                 inputId={"brandName"}
                                 formId={this.state.form.id} label={this.state.form.inputData.brandName.label}
                                 required={this.state.form.inputData.brandName.required} value={this.state.form.inputData.brandName.value}
                                 type={this.state.form.inputData.brandName.type} pattern={this.state.form.inputData.brandName.pattern}
                                 onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.brandName.disabled}
                                 error={this.state.form.inputData.brandName.error} subtitle={this.state.form.inputData.brandName.subtitle}/>
                  </div>
                </div>
                <div className="form-row">
                  <div className="col">
                    <CustomInput key={"comments"}
                                 inputId={"comments"}
                                 formId={this.state.form.id} label={this.state.form.inputData.comments.label}
                                 required={this.state.form.inputData.comments.required} value={this.state.form.inputData.comments.value}
                                 type={this.state.form.inputData.comments.type} pattern={this.state.form.inputData.comments.pattern}
                                 onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.comments.disabled}
                                 error={this.state.form.inputData.comments.error} subtitle={this.state.form.inputData.comments.subtitle}/>
                  </div>
                </div>
                <div className="form-row mt-3">
                  <div className="col text-right">
                    <div className="btn btn-sm cancel-btn text-primary" type="button" onClick={this.gotoCompanyRegistration}>Back</div>
                    <button type="submit" className="btn btn-sm btn-primary submit-btn px-3 ml-3" disabled={this.state.isSubmitDisabled}
                            onClick={this.submitForm}> Next </button>
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

export  default  connect()(BrandRegistration);
