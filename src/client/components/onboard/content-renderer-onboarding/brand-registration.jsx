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
import Helper from "../../../utility/helper";
import CONSTANTS from "../../../constants/constants";
import * as staticContent from "./../../../images";
// import StorageSrvc, {STORAGE_TYPES} from "../../../utility/StorageSrvc";

const console = window.console;
class BrandRegistration extends React.Component {

  constructor(props) {
    super(props);
    this.loader = this.loader.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.gotoCompanyRegistration = this.gotoCompanyRegistration.bind(this);
    this.submitOnboardingForm = this.submitOnboardingForm.bind(this);
    this.undertakingtoggle = this.undertakingtoggle.bind(this);
    this.checkTrademarkValidity = this.checkTrademarkValidity.bind(this);
    this.checkBrandUniqueness = this.checkBrandUniqueness.bind(this);
    this.trademarkDebounce = Helper.debounce(this.checkTrademarkValidity, CONSTANTS.APIDEBOUNCETIMEOUT);
    this.brandDebounce = Helper.debounce(this.checkBrandUniqueness, CONSTANTS.APIDEBOUNCETIMEOUT);
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
            subtitle: "Please input the trademark registration number. Only USPTO registered trademarks are accepted.",
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
            isUnique: false
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
          label: "I have read and agree to the Walmart Brand Portal "
        }
      },
      loader: false,
      trademarkFieldLoader: false,
      brandFieldLoader: false
    };
  }

  loader (type, enable) {
    this.setState(state => {
      const stateClone = {...state};
      stateClone[type] = enable;
      return stateClone;
    });
  }

  checkToEnableSubmit () {
    const form = {...this.state.form};
    const bool = form.inputData.trademarkNumber.isValid &&
      form.inputData.trademarkNumber.value &&
      form.inputData.brandName.value &&
      form.inputData.brandName.isUnique &&
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
          this.trademarkDebounce();
          state.form.inputData.trademarkNumber.error = "";
          state.form.shouldCheckTrademarkValid = true;
        }
        if (key === "brandName") {
          this.brandDebounce();
          state.form.inputData.brandName.error = "";
          state.form.inputData.brandName.isUnique = false;
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
    this.props.updateOrgData(this.state, "brand");
    this.props.dispatchBrandState(this.state);
    this.props.dispatchSteps(steps);
    this.setState({redirectToCompanyReg: true});
  }

  async updateProfileInfo () {
    try {
      const profile = (await Http.get("/api/userInfo")).body;
      this.props.updateUserProfile(profile);
    } catch (e) {
      console.error(e);
    }
  }

  async submitOnboardingForm(evt) {
    evt.preventDefault();
    try {
      this.loader("loader", true);
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
      this.loader("loader", false);
      const meta = { templateName: "CompanyBrandRegisteredTemplate" };
      this.updateProfileInfo();
      this.props.dispatchNewRequest(true);
      this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
    } catch (err) {
      console.log(err);
      this.loader("loader", false);
    }

  }

  checkBrandUniqueness() {
    this.loader("brandFieldLoader", true);
    Http.get("/api/brands/checkUnique", {brandName: this.state.form.inputData.brandName.value}).then(res => {
      if (!res.body.unique) {
        this.setState(state => {
          state = {...state};
          state.form.inputData.brandName.error = `${res.body.name} is already registered with a Walmart Brand Portal account. For more information please contact ipinvest@walmart.com.`;
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
      this.loader("brandFieldLoader", false);
    })
    .catch(e => {
      this.loader("brandFieldLoader", false);
    });
  }

  async checkTrademarkValidity () {
    const form = {...this.state.form};
    try {
      if (!this.state.form.inputData.trademarkNumber.value) return;
      this.loader("trademarkFieldLoader", true);
      const response = (await Http.get(`/api/brand/trademark/validity/${this.state.form.inputData.trademarkNumber.value}`)).body;
      if (!response.valid) {throw {error: `${response.ipNumber} is already registered with a Walmart Brand Portal account. For more information please contact ipinvest@walmart.com.`};}
      form.inputData.trademarkNumber = {...form.inputData.trademarkNumber, isValid: true, error: ""};
      form.shouldCheckTrademarkValid = false;
      this.setState({form}, this.checkToEnableSubmit);
      this.loader("trademarkFieldLoader", false);
    } catch (err) {
      form.inputData.trademarkNumber = {...form.inputData.trademarkNumber, isValid: false, error: err.error};
      form.shouldCheckTrademarkValid = true;
      this.setState({form}, this.checkToEnableSubmit);
      this.loader("trademarkFieldLoader", false);
    }
  }


  render() {
    if (this.state.redirectToCompanyReg) {
      return <Redirect to={CONSTANTS.ROUTES.ONBOARD.COMPANY_REGISTER} />;
    }
    return (
      <div className={`row justify-content-center ${this.state.loader && "loader"}`}>
        <div className="col-lg-6 col-md-8 col-12">
          <div className="row title-row mb-4">
            <div className="col">
              <div className="row">
                <div className="col">
                  <div className="company-registration-title">
                    Thank you for sharing your company information.
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="company-registration-subtitle">
                    Now please tell us about your brand. If you own multiple brands, please select one which will be verified upon submission.
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
                      inputId={"trademarkNumber"} formId={this.state.form.id} label={this.state.form.inputData.trademarkNumber.label} required={this.state.form.inputData.trademarkNumber.required}
                      value={this.state.form.inputData.trademarkNumber.value} type={this.state.form.inputData.trademarkNumber.type} pattern={this.state.form.inputData.trademarkNumber.pattern}
                      onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.trademarkNumber.disabled} error={this.state.form.inputData.trademarkNumber.error}
                      subtitle={this.state.form.inputData.trademarkNumber.subtitle} loader={this.state.trademarkFieldLoader} />
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
                      inputId={"brandName"} formId={this.state.form.id} label={this.state.form.inputData.brandName.label} required={this.state.form.inputData.brandName.required}
                      value={this.state.form.inputData.brandName.value} type={this.state.form.inputData.brandName.type} pattern={this.state.form.inputData.brandName.pattern}
                      onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.brandName.disabled} loader={this.state.brandFieldLoader}
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
                        {/* <span><a href="./../../../images/Brand Portal - Terms of Use FINAL (Sept 15 2020).pdf" target="_blank">Terms of Use.</a></span> */}
                        <span><a href={staticContent.TOU} target="_blank">Terms of Use.</a></span>
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
  updateOrgData: PropTypes.func,
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
    userProfile: state.user.profile
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
