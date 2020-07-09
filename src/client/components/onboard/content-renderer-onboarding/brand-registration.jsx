import React from "react";
import { connect } from "react-redux";
import CustomInput from "../../custom-components/custom-input/custom-input";
import CheckGreenIcon from "../../../images/check-grn.svg";
import {Redirect} from "react-router";
import CONSTANTS from "../../../constants/constants";
import Http from "../../../utility/Http";
import PropTypes from "prop-types";
import {TOGGLE_ACTIONS, toggleModal} from "../../../actions/modal-actions";
import {updateUserProfile} from "../../../actions/user/user-actions";
import StorageSrvc, {STORAGE_TYPES} from "../../../utility/StorageSrvc";

class BrandRegistration extends React.Component {

  constructor(props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
    this.gotoCompanyRegistration = this.gotoCompanyRegistration.bind(this);
    this.submitOnboardingForm = this.submitOnboardingForm.bind(this);
    this.undertakingtoggle = this.undertakingtoggle.bind(this);
    this.checkTrademarkValidity = this.checkTrademarkValidity.bind(this);
    this.storageSrvc = new StorageSrvc(STORAGE_TYPES.SESSION_STORAGE);


    this.state = {
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
        },
        undertaking: {
          selected: false,
          label: "I have read and agree to the Terms Of Use."
        }
      }
    };
  }

  componentDidUpdate(prevProps) {

  }

  checkToEnableSubmit () {
    const form = {...this.state.form};
    const bool = form.inputData.trademarkNumber.isValid &&
      form.inputData.trademarkNumber.value &&
      form.inputData.brandName.value &&
      form.undertaking.selected;
    this.setState({isSubmitDisabled: !bool});
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
    this.setState({redirectToCompanyReg: true});
  }

  async updateProfileInfo () {
    try {
      const profile = (await Http.get("/api/userInfo")).body;
      this.storageSrvc.setJSONItem("userProfile", profile);
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

      const response = (await Http.post("/api/org/register", data)).body;

      const meta = { templateName: "CompanyBrandRegisteredTemplate" };
      this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
      this.updateProfileInfo();
    } catch (err) {
      console.log(err);
    }

  }

  async checkTrademarkValidity () {
    try {
      if (!this.state.form.inputData.trademarkNumber.value) {
        return;
      }
      const response = (await Http.get(`/api/brand/trademark/validity/${this.state.form.inputData.trademarkNumber.value}`)).body;
      if (!response.valid) {
        throw {error: `${response.ipNumber} is not a valid Trademark Number.`};
      }
      const form = {...this.state.form};
      form.inputData.trademarkNumber.isValid = true;
      form.inputData.trademarkNumber.error = "";
      this.setState({form}, this.checkToEnableSubmit);
    } catch (err) {
      console.log(err);
      const form = {...this.state.form};
      form.inputData.trademarkNumber.isValid = false;
      form.inputData.trademarkNumber.error = err.error;
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
                    <div className={`btn btn-sm btn-block ${this.state.form.inputData.trademarkNumber.isValid ? "btn-success" : "btn-primary"}`}
                      onClick={this.checkTrademarkValidity}>
                      {this.state.form.inputData.trademarkNumber.isValid ? <img className="check-green-icon-white-bg" src={CheckGreenIcon} /> : "Check"}
                    </div>
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
                <div className="form-row mt-5">
                  <div className="col text-right">
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
  toggleModal: PropTypes.func,
  updateUserProfile: PropTypes.func,
  org: PropTypes.PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ])
};

const mapStateToProps = state => {
  return {
    userProfile: state.userProfile
  };
};

const mapDispatchToProps = {
  toggleModal,
  updateUserProfile
};

export  default  connect(mapStateToProps, mapDispatchToProps)(BrandRegistration);
