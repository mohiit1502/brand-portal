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
import FORMFIELDCONFIG from "../../../config/formsConfig/form-field-meta";
import Validator from "../../../utility/validationUtil";

const console = window.console;
class BrandRegistration extends React.Component {

  constructor(props) {
    super(props);
    const functions = ["onChangeEvent", "gotoCompanyRegistration", "submitOnboardingForm", "undertakingtoggle"];
    const debounceFunctions = {"brandDebounce": "checkBrandUniqueness", "trademarkDebounce": "checkTrademarkValidity"};
    functions.forEach(name => this[name] = this[name].bind(this));
    Object.keys(debounceFunctions).forEach(name => {
      const functionToDebounce = Validator[debounceFunctions[name]] ? Validator[debounceFunctions[name]].bind(this) : this[debounceFunctions[name]];
      this[name] = Helper.debounce(functionToDebounce, CONSTANTS.APIDEBOUNCETIMEOUT);
    });
    this.loader = Helper.loader.bind(this);
    this.state = this.props.brandState && Object.keys(this.props.brandState).length > 0 ? this.props.brandState : {
      isSubmitDisabled: true,
      redirectToCompanyReg: !this.props.org,
      form: {
        id: FORMFIELDCONFIG.SECTIONSCONFIG.BRANDREG.sectionConfig.name,
        inputData: FORMFIELDCONFIG.SECTIONSCONFIG.BRANDREG.fields,
        loader: FORMFIELDCONFIG.SECTIONSCONFIG.BRANDREG.loader
      }
    };
  }

  checkToEnableSubmit () {
    const form = {...this.state.form};
    const bool = form.inputData.trademarkNumber.isValid &&
      form.inputData.trademarkNumber.value &&
      form.inputData.brandName.value &&
      form.inputData.brandName.isUnique &&
      form.inputData.undertaking.selected;
    this.setState({isSubmitDisabled: !bool});
  }

  onKeyPress(evt, key) {
    if (key === "trademarkNumber" && ((evt.which < 48 || evt.which > 57) && !CONSTANTS.ALLOWED_KEY_CODES.includes(evt.which))) {
      evt.preventDefault();
    }
  }

  onChangeEvent (evt, key) {
    if (evt && evt.target) {
      const targetVal = evt.target.value;
      this.setState(state => {
        state = {...state};
        if (key === "trademarkNumber") {
          this.trademarkDebounce();
          state.form.inputData.trademarkNumber.error = "";
          state.form.inputData.trademarkNumber.isValid = false;
        }
        if (key === "brandName") {
          this.brandDebounce({brandName: targetVal});
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
    state.form.inputData.undertaking.selected = !state.form.inputData.undertaking.selected;
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
      this.loader("form", true);
      const inputData = this.state.form.inputData;
      const brand = {
        trademarkNumber: inputData.trademarkNumber.value,
        name: inputData.brandName.value,
        comments: ""
      };
      if (inputData.comments.value) {
        brand.comments = inputData.comments.value;
      }
      const data = {
        org: this.props.org,
        brand
      };

      await Http.post("/api/org/register", data);
      this.loader("form", false);
      const meta = { templateName: "CompanyBrandRegisteredTemplate" };
      this.updateProfileInfo();
      this.props.dispatchNewRequest(true);
      this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
    } catch (err) {
      this.loader("form", false);
    }
  }

  getFieldRenders() {
    const {form} = this.state;
    return form.inputData && Object.keys(form.inputData).map((id, key) => {
      const fieldObj = form.inputData[id];
      return fieldObj.inputId ? (
        <div className="form-row" key={key}>
          <div className="col">
            <CustomInput formId={form.id} onChangeEvent={this.onChangeEvent} onKeyPress={this.onKeyPress} {...fieldObj} />
          </div>
        </div>
      ) : null;
    }).filter(item => item !== null);
  }

  render() {
    if (this.state.redirectToCompanyReg) {
      return <Redirect to={CONSTANTS.ROUTES.ONBOARD.COMPANY_REGISTER} />;
    }

    const form = this.state.form;
    const inputData = form.inputData;

    return (
      <div className={`row justify-content-center ${this.state.form.loader && "loader"}`}>
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
                {this.getFieldRenders()}
                <div className="form-row mt-5">
                  <div className="col">
                    <div className="form-check">
                      <input type="checkbox" id="user-undertaking" className="form-check-input user-undertaking" checked={inputData.undertaking.selected} required={true}
                        onChange={this.undertakingtoggle}/>
                      <label className="form-check-label user-undertaking-label" htmlFor="user-undertaking">
                        {inputData.undertaking.label}
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
