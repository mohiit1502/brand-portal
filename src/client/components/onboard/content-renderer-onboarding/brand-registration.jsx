/* eslint-disable no-throw-literal */
/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Redirect} from "react-router";
import {dispatchBrandState, dispatchNewRequest, dispatchSteps} from "./../../../actions/company/company-actions";
import {TOGGLE_ACTIONS, toggleModal} from "../../../actions/modal-actions";
import {updateUserProfile} from "../../../actions/user/user-actions";
import Http from "../../../utility/Http";
import CustomInput from "../../custom-components/custom-input/custom-input";
import CONSTANTS from "../../../constants/constants";
// import StorageSrvc, {STORAGE_TYPES} from "../../../utility/StorageSrvc";

const console = window.console;
class BrandRegistration extends React.Component {

  constructor(props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
    this.gotoCompanyRegistration = this.gotoCompanyRegistration.bind(this);
    this.submitOnboardingForm = this.submitOnboardingForm.bind(this);
    this.undertakingtoggle = this.undertakingtoggle.bind(this);
    this.checkTrademarkValidity = this.checkTrademarkValidity.bind(this);
    // this.storageSrvc = new StorageSrvc(STORAGE_TYPES.SESSION_STORAGE);


    this.state = this.props.brandState && Object.keys(this.props.brandState).length > 0 ? this.props.brandState : {
      isSubmitDisabled: true,
      redirectToCompanyReg: !this.props.org,
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
            isValid: false,
            subtitle: "Please input the correct number associated with your company trademark. Only USPTO registered trademarks will be accepted.",
            error: "",
            onBlurEvent: this.checkTrademarkValidity
          },
          brandName: {
            label: "Brand Name",
            required: true,
            value: "",
            type: "text",
            pattern: null,
            disabled: false,
            subtitle: "",
            error: "",
            isUnique: false,
            onBlurEvent: e => {
              this.setState(state => {
                state = {...state};
                // state.form.inputData.brandName.error = "Brand Name is not Unique";
                state.form.inputData.brandName.isUnique = false;
                return {
                  ...state
                };
              }, this.checkToEnableSubmit);
              Http.get("/api/brands/checkUnique", {brandName: e.target.value}).then(res => {
                if (!res.body.unique) {
                  this.setState(state => {
                    state = {...state};
                    state.form.inputData.brandName.error = "Brand Name is not Unique";
                    state.form.inputData.brandName.isUnique = false;
                    return {
                      ...state
                    };
                  }, this.checkToEnableSubmit);
                } else {
                  this.setState(state => {
                    state = {...state};
                    state.form.inputData.brandName.error = "";
                    state.form.inputData.brandName.isUnique = true;
                    return {
                      ...state
                    };
                  }, this.checkToEnableSubmit);
                }
              });
            }
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
        },
        undertaking: {
          selected: false,
          label: "I have read and agree to the Terms Of Use."
        }
      }
    };
  }

  checkToEnableSubmit () {
    const form = {...this.state.form};
    const bool = form.inputData.trademarkNumber.isValid &&
      form.inputData.trademarkNumber.value &&
      form.inputData.brandName.value &&
      form.undertaking.selected &&
      !form.shouldCheckTrademarkValid;
    this.setState({isSubmitDisabled: !bool});
  }

  onInputChange (evt, key) {
    if (evt && evt.target) {
      const targetVal = evt.target.value;
      this.setState(state => {
        state = {...state};
        if (key === "trademarkNumber") {
          state.form.shouldCheckTrademarkValid = true;
        }
        state.form.inputData[key].value = targetVal;
        return {
          ...state
        };
      }, this.checkToEnableSubmit);
    }
  }

  undertakingtoggle () {
    const state = {...this.state};
    state.form.undertaking.selected = !state.form.undertaking.selected;
    this.setState({
      ...state
    }, this.checkToEnableSubmit);
  }

  gotoCompanyRegistration () {
    const steps = this.props.steps ? [...this.props.steps] : [];
    steps && steps[1] && (steps[1].complete = false);
    this.props.dispatchBrandState(this.state);
    this.props.dispatchSteps(steps);
    this.setState({redirectToCompanyReg: true});
  }

  async updateProfileInfo () {
    try {
      const profile = (await Http.get("/api/userInfo")).body;
      // this.storageSrvc.setJSONItem("userProfile", profile);
      this.props.updateUserProfile(profile);
    } catch (e) {
      console.error(e);
    }
  }

  async submitOnboardingForm(evt) {
    evt.preventDefault();
    try {
      const brand = {
        trademarkNumber: this.state.form.inputData.trademarkNumber.value,
        name: this.state.form.inputData.brandName.value,
        comments: ""
      };
      if (this.state.form.inputData.comments.value) {
        brand.comments = this.state.form.inputData.comments.value;
      }
      const data = {
        org: this.props.org,
        brand
      };

      await Http.post("/api/org/register", data);

      const meta = { templateName: "CompanyBrandRegisteredTemplate" };
      this.updateProfileInfo();
      this.props.dispatchNewRequest(true);
      this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
    } catch (err) {
      console.log(err);
    }

  }

  async checkTrademarkValidity () {
    const form = {...this.state.form};
    try {
      if (!this.state.form.inputData.trademarkNumber.value) return;
      const response = (await Http.get(`/api/brand/trademark/validity/${this.state.form.inputData.trademarkNumber.value}`)).body;
      if (!response.valid) {throw {error: `${response.ipNumber} is not a valid Trademark Number.`};}
      form.inputData.trademarkNumber = {...form.inputData.trademarkNumber, isValid: true, error: ""};
      form.shouldCheckTrademarkValid = false;
      this.setState({form}, this.checkToEnableSubmit);
    } catch (err) {
      console.log(err);
      form.inputData.trademarkNumber = {...form.inputData.trademarkNumber, isValid: false, error: err.error};
      form.shouldCheckTrademarkValid = true;
      this.setState({form}, this.checkToEnableSubmit);
    }
  }


  render() {
    if (this.state.redirectToCompanyReg) {
      return <Redirect to={CONSTANTS.ROUTES.ONBOARD.COMPANY_REGISTER} />;
    }
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
                  <div className="col-12">
                    <CustomInput key={"trademarkNumber"}
                      inputId={"trademarkNumber"}
                      formId={this.state.form.id} label={this.state.form.inputData.trademarkNumber.label}
                      required={this.state.form.inputData.trademarkNumber.required} value={this.state.form.inputData.trademarkNumber.value}
                      type={this.state.form.inputData.trademarkNumber.type} pattern={this.state.form.inputData.trademarkNumber.pattern}
                      onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.trademarkNumber.disabled} onBlurEvent={this.state.form.inputData.trademarkNumber.onBlurEvent}
                      error={this.state.form.inputData.trademarkNumber.error} subtitle={this.state.form.inputData.trademarkNumber.subtitle}/>
                  </div>
                  {/* <div className="col-2">
                    <div className={`btn btn-sm btn-block ${this.state.form.inputData.trademarkNumber.isValid && !this.state.form.shouldCheckTrademarkValid ? "btn-success" : "btn-primary"}`}
                      onClick={this.checkTrademarkValidity}>
                      {this.state.form.inputData.trademarkNumber.isValid && !this.state.form.shouldCheckTrademarkValid ? <img className="check-green-icon-white-bg" src={CheckGreenIcon} /> : "Check"}
                    </div>
                  </div> */}
                </div>
                <div className="form-row">
                  <div className="col">
                    <CustomInput key={"brandName"}
                      inputId={"brandName"}
                      formId={this.state.form.id} label={this.state.form.inputData.brandName.label}
                      required={this.state.form.inputData.brandName.required} value={this.state.form.inputData.brandName.value}
                      type={this.state.form.inputData.brandName.type} pattern={this.state.form.inputData.brandName.pattern}
                      onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.brandName.disabled} onBlurEvent={this.state.form.inputData.brandName.onBlurEvent}
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
                <div className="form-row mt-5">
                  <div className="col">
                    <div className="form-check">
                      <input type="checkbox" id="user-undertaking" className="form-check-input user-undertaking" checked={this.state.form.undertaking.selected} required={true}
                        onChange={this.undertakingtoggle}/>
                      <label className="form-check-label user-undertaking-label" htmlFor="user-undertaking">
                        {this.state.form.undertaking.label}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-row mt-3">
                  <div className="col text-right">
                    <div className="btn btn-sm cancel-btn text-primary" type="button" onClick={this.gotoCompanyRegistration}>Back</div>
                    <button type="submit" className="btn btn-sm btn-primary submit-btn px-3 ml-3" disabled={this.state.isSubmitDisabled}
                      onClick={this.submitOnboardingForm}> Submit </button>
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

BrandRegistration.propTypes = {
  brandState: PropTypes.object,
  dispatchBrandState: PropTypes.func,
  dispatchNewRequest: PropTypes.func,
  dispatchSteps: PropTypes.func,
  steps: PropTypes.array,
  toggleModal: PropTypes.func,
  updateUserProfile: PropTypes.func,
  org: PropTypes.PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ])
};

const mapStateToProps = state => {
  return {
    brandState: state.company && state.company.brandState,
    steps: state.company && state.company.steps,
    userProfile: state.userProfile
  };
};

const mapDispatchToProps = {
  dispatchBrandState,
  dispatchNewRequest,
  dispatchSteps,
  toggleModal,
  updateUserProfile
};

export  default  connect(mapStateToProps, mapDispatchToProps)(BrandRegistration);
