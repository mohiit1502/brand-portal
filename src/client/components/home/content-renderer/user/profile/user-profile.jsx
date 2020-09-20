import React from "react";
import { connect } from "react-redux";
import "../../../../../styles/home/content-renderer/user/profile/user-profile.scss";
import PropTypes from "prop-types";
import CustomInput from "../../../../custom-components/custom-input/custom-input";
import Http from "../../../../../utility/Http";
import {updateUserProfile} from "../../../../../actions/user/user-actions";
import {dispatchDiscardChanges, TOGGLE_ACTIONS, toggleModal} from "../../../../../actions/modal-actions";
import InputFormatter from "../../../../../utility/phoneOps";
import CONSTANTS from "../../../../../constants/constants";
import restConfig from "./../../../../../config/rest";

class UserProfile extends React.Component {

  // storageSrvc;

  constructor (props) {
    super(props);
    this.isDirty = this.isDirty.bind(this);
    this.loader = this.loader.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.disableInput = this.disableInput.bind(this);
    // this.toggleUnderwritingCheck = this.toggleUnderwritingCheck.bind(this);
    this.saveUser = this.saveUser.bind(this);
    this.onInvalidHandler = this.onInvalidHandler.bind(this);
    this.validateUser = this.validateUser.bind(this);
    this.invalid = {firstName: false, lastName: false, companyName: false, phone: false};

    this.state = {
      pageLoading: true,
      loader: false,
      form: {
        isDisabled: true,
        // underwritingChecked: false,
        id: "user-profile-form",
        inputData: {
          firstName: {
            label: "First Name",
            required: true,
            value: this.props.userProfile.firstName,
            type: "text",
            pattern: CONSTANTS.REGEX.ONECHAR,
            invalidError: "Please enter First Name",
            disabled: true
          },
          lastName: {
            label: "Last Name",
            required: true,
            value: this.props.userProfile.lastName,
            type: "text",
            pattern: CONSTANTS.REGEX.ONECHAR,
            invalidError: "Please enter Last Name",
            disabled: true
          },
          companyName: {
            label: "Company Name",
            required: true,
            value: this.props.userProfile.organization.name,
            invalidError: "Please enter the Company Name",
            type: "text",
            pattern: CONSTANTS.REGEX.ONECHAR,
            disabled: true
          },
          emailId: {
            label: "Email",
            required: true,
            value: this.props.userProfile.email,
            type: "email",
            pattern: null,
            disabled: true
          },
          phone: {
            label: "Mobile Number",
            required: false,
            value: this.props.userProfile.phoneNumber,
            invalidError: "Please select a valid Phone Number",
            type: "text",
            pattern: CONSTANTS.REGEX.PHONE,
            disabled: true,
            maxLength: 17
          }
        }
      }
    };
  }

  componentDidMount() {
    const formatter = new InputFormatter();
    const handlers = formatter.on("#user-profile-form-phone-custom-input");
    this.customChangeHandler = handlers.inputHandler;
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setFormData(this.props.userProfile);
    }
  }

  loader (enable) {
    this.setState(state => {
      const stateClone = {...state};
      stateClone.loader = enable;
      return stateClone;
    });
  }

  isDirty () {
    const {firstName: originalFName, lastName: originalLName, email: originalEmail, phoneNumber: originalPhone, companyName: originalCompany} = this.props.userProfile;
    const {firstName: {value: currentFName}, lastName: {value: currentLName}, emailId: {value: currentEmail}, phone: {value: currentPhone}} = this.state.form.inputData;
    const currentCompany = this.state.form.inputData.company ? this.state.form.inputData.company.value : "";

    return originalFName !== currentFName || originalLName !== currentLName || originalEmail !== currentEmail || originalPhone !== currentPhone || (originalCompany && currentCompany && originalCompany !== currentCompany);
      // || ((!originalCompany && currentCompany) || (originalCompany && !currentCompany) || (originalCompany !== currentCompany));
  }

  setFormData(obj) {
    if (this.props.shouldDiscard) {
      const form = {...this.state.form};
      form.isDisabled = true;
      form.inputData.firstName.value = obj.firstName;
      form.inputData.lastName.value = obj.lastName;
      form.inputData.companyName.value = obj.type === "ThirdParty" ? obj.companyName : "";
      form.inputData.emailId.value = obj.email;
      form.inputData.phone.value = obj.phoneNumber;

      Object.keys(form.inputData).forEach(key => {
        if (key !== "emailId") {
          const item = form.inputData[key];
          item.disabled = true;
          item.error = "";
        }
      });

      this.setState({
        form,
        pageLoading: false
      });
      this.props.dispatchDiscardChanges(false);
    }
  }

  onInputChange (evt, key) {
    if (evt && evt.target) {
      if (evt.target.checkValidity()) {
        this.invalid[key] = false;
      }
      const targetVal = evt.target.value;
      this.setState(state => {
        state = {...state};
        const inputData = state.form.inputData;
        state.form.inputData[key].value = targetVal;
        inputData[key].error = !this.invalid[key] ? "" : inputData[key].error;
        this.invalid[key] = false;
        return {
          ...state
        };
      });
    }
  }

  disableInput (disable) {
    disable = !!disable;
    if (disable && this.isDirty()) {
      const meta = { templateName: "Alert" };
      this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
    } else {
      const form = {...this.state.form};
      form.isDisabled = disable;
      // form.inputData.firstName.disabled = disable;
      // form.inputData.lastName.disabled = disable;
      // form.inputData.companyName.disabled = disable;
      //form.inputData.emailId.disabled = disable;
      form.inputData.phone.disabled = disable;
      Object.keys(form.inputData).forEach(key => {
        if (key !== "emailId") {
          const item = form.inputData[key];
          item.disabled = disable;
          item.error = "";
        }
      });

      this.setState({form});
    }

  }

  // toggleUnderwritingCheck () {
  //   const form = {...this.state.form};
  //   form.underwritingChecked = !form.underwritingChecked;
  //   this.setState({form});
  // }

  async saveUser (evt) {
    evt.preventDefault();

    if (!this.validateUser()) {
      this.loader(true);
      const loginId = this.state.form.inputData.emailId.value;
      const firstName = this.state.form.inputData.firstName.value;
      const lastName = this.state.form.inputData.lastName.value;
      const phoneNumber = this.state.form.inputData.phone.value;
      const payload = {
        user: {
          loginId,
          firstName,
          lastName,
          phoneNumber,
          properties: {
            companyName: this.state.form.inputData.companyName.value
          }
        }
      };


      const url = "/api/users";

      if (this.isDirty()) {
        return Http.put(`${url}/${payload.user.loginId}`, payload)
          .then(async res => {
            this.loader(false);
            this.props.updateUserProfile(res.body);
            this.disableInput(true);
          })
          .catch(() => this.loader(false));
      } else {
        this.loader(false);
        this.disableInput(true);
      }
    }

    return null;
  }

  validateUser () {
    const form = {...this.state.form};
    let hasError = false;
    Object.keys(form.inputData).forEach(key => {
      const obj = {...form.inputData[key]};
      form.inputData[key] = obj;
      if (obj && obj.required && !obj.value) {
        if (key === "companyName" && this.props.userProfile && this.props.userProfile.type === "Internal") {
          return;
        }
        obj.error = obj.invalidError;
        hasError = true;
      } else {
        obj.error = "";
      }
    });
    this.setState({form});
    return hasError;
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

  render () {
    return (
      <div className={`row user-profile-content h-100${this.state.loader ? " loader" : ""}`}>
        <div className="col h-100">
          <div className="row content-header-row p-4 h-10">
            <div className="col">
              <h3>User Profile</h3>
            </div>
          </div>
          <div className="row content-row p-4 mt-4 h-90">
            <div className="col">
              <form className="h-100" autoComplete="off" onSubmit={this.saveUser}>
                <div className="row h-60">
                  <div className="col h-100">
                    <div className="row">
                      <div className="col-xl-3 col-5">
                        <CustomInput key={"firstName"}
                          inputId={"firstName"} pattern={this.state.form.inputData.firstName.pattern} onInvalidHandler={this.onInvalidHandler} preventHTMLRequiredValidation={true}
                          formId={this.state.form.id} label={this.state.form.inputData.firstName.label} error={this.state.form.inputData.firstName.error}
                          required={this.state.form.inputData.firstName.required} value={this.state.form.inputData.firstName.value}
                          type={this.state.form.inputData.firstName.type} pattern={this.state.form.inputData.firstName.pattern}
                          onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.firstName.disabled} />
                      </div>
                      <div className="col-xl-3 col-5">
                        <CustomInput key={"lastName"}
                          inputId={"lastName"} pattern={this.state.form.inputData.lastName.pattern} onInvalidHandler={this.onInvalidHandler} preventHTMLRequiredValidation={true}
                          formId={this.state.form.id} label={this.state.form.inputData.lastName.label} error={this.state.form.inputData.lastName.error}
                          required={this.state.form.inputData.lastName.required} value={this.state.form.inputData.lastName.value}
                          type={this.state.form.inputData.lastName.type} pattern={this.state.form.inputData.lastName.pattern}
                          onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.lastName.disabled} />
                      </div>
                    </div>
                    {this.props.userProfile.type === CONSTANTS.USER.USER_TYPE.THIRD_PARTY && <div className="row">
                      <div className="col-xl-3 col-5">
                        <CustomInput key={"companyName"}
                          inputId={"companyName"} pattern={this.state.form.inputData.companyName.pattern} onInvalidHandler={this.onInvalidHandler}
                          formId={this.state.form.id} label={this.state.form.inputData.companyName.label} preventHTMLRequiredValidation={true}
                          required={this.state.form.inputData.companyName.required} value={this.state.form.inputData.companyName.value}
                          type={this.state.form.inputData.companyName.type} pattern={this.state.form.inputData.companyName.pattern}
                          onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.companyName.disabled}
                          error={this.state.form.inputData.companyName.error} />
                      </div>
                    </div>}
                    <div className="row">
                      <div className="col-xl-3 col-5">
                        <CustomInput key={"emailId"}
                          inputId={"emailId"}
                          formId={this.state.form.id} label={this.state.form.inputData.emailId.label}
                          required={this.state.form.inputData.emailId.required} value={this.state.form.inputData.emailId.value}
                          type={this.state.form.inputData.emailId.type} pattern={this.state.form.inputData.emailId.pattern}
                          onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.emailId.disabled} />
                      </div>
                      <div className="col-xl-3 col-5">
                        <CustomInput key={"phone"}
                          inputId={"phone"} pattern={this.state.form.inputData.phone.pattern} onInvalidHandler={this.onInvalidHandler}
                          formId={this.state.form.id} label={this.state.form.inputData.phone.label} customChangeHandler={this.customChangeHandler}
                          required={this.state.form.inputData.phone.required} value={this.state.form.inputData.phone.value}
                          type={this.state.form.inputData.phone.type} pattern={this.state.form.inputData.phone.pattern}
                          onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.phone.disabled} preventHTMLRequiredValidation={true}
                          error={this.state.form.inputData.phone.error}  maxLength={this.state.form.inputData.phone.maxLength} />
                      </div>
                    </div>
                    {!restConfig.IS_MVP && <div className="row mb-5 password-reset-row">
                      <div className="col-3">
                        <div className="btn btn-primary btn-sm no-border-radius px-3">
                          Password Reset
                        </div>
                        <span className="badge badge-pill bg-white text-blue ml-2 cursor-pointer"> ? </span>
                      </div>
                    </div>}
                  </div>
                </div>
                <div className="row h-40">
                  <div className="col h-100">
                    {/* <div className="row pt-5">
                      <div className="col-xl-6 col-10">
                        {
                          this.state.form.isDisabled ? <div><br/><br/></div> :
                            <label>
                              <input type="checkbox" className="mr-2" checked={this.state.form.underwritingChecked} onChange={this.toggleUnderwritingCheck}/>
                              I have a good faith belief that the use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.
                            </label>

                        }
                      </div>
                    </div> */}
                    <div className="row pt-5">
                        <div className="col-xl-3 col-5" />
                      <div className="col-xl-3 col-5 text-right">
                        {
                          this.state.form.isDisabled ?
                            (
                              <div className="btn btn-primary btn-sm no-border-radius px-4" onClick={() => this.disableInput(false)}>
                                Edit
                              </div>
                            ) :
                            (
                              <span>
                                <div className="btn btn-link font-size-14 px-4 mr-3" onClick={() => this.disableInput(true)}>Cancel</div>
                                {/* <button type="submit" className="btn btn-primary btn-sm no-border-radius px-4 font-size-14" disabled={!this.state.form.underwritingChecked}> */}
                                <button type="submit" className="btn btn-primary btn-sm no-border-radius px-4 font-size-14">
                                  Save
                                </button>
                              </span>
                            )
                        }

                      </div>
                    </div>
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

UserProfile.propTypes = {
  dispatchDiscardChanges: PropTypes.bool,
  shouldDiscard: PropTypes.bool,
  toggleModal: PropTypes.func,
  userProfile: PropTypes.object,
  updateUserProfile: PropTypes.func
};

const mapStateToProps = state => {
  return {
    shouldDiscard: state.modal.shouldDiscard,
    userProfile: state.user.profile
  };
};

const mapDispatchToProps = {
  dispatchDiscardChanges,
  toggleModal,
  updateUserProfile
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile);
