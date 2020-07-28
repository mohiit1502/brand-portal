import React from "react";
import { connect } from "react-redux";
import "../../../../../styles/home/content-renderer/user/profile/user-profile.scss";
import PropTypes from "prop-types";
import CustomInput from "../../../../custom-components/custom-input/custom-input";
import Http from "../../../../../utility/Http";
import {updateUserProfile} from "../../../../../actions/user/user-actions";
// import StorageSrvc, {STORAGE_TYPES} from "../../../../../utility/StorageSrvc";
import CONSTANTS from "../../../../../constants/constants";
import restConfig from "./../../../../../config/rest";

class UserProfile extends React.Component {

  // storageSrvc;

  constructor (props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.disableInput = this.disableInput.bind(this);
    this.toggleUnderwritingCheck = this.toggleUnderwritingCheck.bind(this);
    this.saveUser = this.saveUser.bind(this);
    // this.storageSrvc = new StorageSrvc(STORAGE_TYPES.SESSION_STORAGE);
    // console.log(this.props.userProfile)
    this.state = {
      pageLoading: true,
      form: {
        isDisabled: true,
        underwritingChecked: false,
        id: "user-profile-form",
        inputData: {
          firstName: {
            label: "First Name",
            required: true,
            value: this.props.userProfile.firstName,
            type: "text",
            pattern: null,
            disabled: true
          },
          lastName: {
            label: "Last Name",
            required: true,
            value: this.props.userProfile.lastName,
            type: "text",
            pattern: null,
            disabled: true
          },
          companyName: {
            label: "Company Name",
            required: true,
            value: this.props.userProfile.organization.name,
            type: "text",
            pattern: null,
            disabled: true
          },
          emailId: {
            label: "Email ID",
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
            type: "text",
            pattern: null,
            disabled: true
          }
        }
      }
    };
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {

    console.log(prevProps , this.props);
    if (prevProps !== this.props) {
      this.setFormData(this.props.userProfile);
    }
  }


  setFormData(obj) {
    const form = {...this.state.form};
    form.inputData.firstName.value = obj.firstName;
    form.inputData.firstName.disabled = true;
    form.inputData.lastName.value = obj.lastName;
    form.inputData.lastName.disabled = true;
    form.inputData.companyName.value = obj.type === "ThirdParty" ? obj.companyName : "";
    form.inputData.companyName.disabled = true;
    form.inputData.emailId.value = obj.loginId;
    form.inputData.emailId.disabled = true;
    form.inputData.phone.value = obj.phoneNumber;
    form.inputData.phone.disabled = true;

    this.setState({
      form,
      pageLoading: false
    });
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

  disableInput (disable) {
    disable = !!disable;

    const form = {...this.state.form};

    form.isDisabled = disable;

    form.inputData.firstName.disabled = disable;
    form.inputData.lastName.disabled = disable;
    form.inputData.companyName.disabled = disable;
    //form.inputData.emailId.disabled = disable;
    form.inputData.phone.disabled = disable;

    this.setState({
      form
    });

  }

  toggleUnderwritingCheck () {
    const form = {...this.state.form};
    form.underwritingChecked = !form.underwritingChecked;
    this.setState({form});
  }

  async saveUser (evt) {
    evt.preventDefault();

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

    return Http.put(`${url}/${payload.user.loginId}`, payload)
      .then(async res => {
        this.props.updateUserProfile(res.body);
        // TODO check requirement of below
        // this.storageSrvc.setJSONItem("userProfile", res.body);
        this.props.updateUserProfile(res.body);
        this.disableInput(true);
      });
  }

  render () {
    return (
      <div className="row user-profile-content h-100">
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
                          inputId={"firstName"}
                          formId={this.state.form.id} label={this.state.form.inputData.firstName.label}
                          required={this.state.form.inputData.firstName.required} value={this.state.form.inputData.firstName.value}
                          type={this.state.form.inputData.firstName.type} pattern={this.state.form.inputData.firstName.pattern}
                          onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.firstName.disabled} />
                      </div>
                      <div className="col-xl-3 col-5">
                        <CustomInput key={"lastName"}
                          inputId={"lastName"}
                          formId={this.state.form.id} label={this.state.form.inputData.lastName.label}
                          required={this.state.form.inputData.lastName.required} value={this.state.form.inputData.lastName.value}
                          type={this.state.form.inputData.lastName.type} pattern={this.state.form.inputData.lastName.pattern}
                          onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.lastName.disabled} />
                      </div>
                    </div>
                    {this.props.userProfile.type === CONSTANTS.USER.USER_TYPE.THIRD_PARTY && <div className="row">
                      <div className="col-xl-3 col-5">
                        <CustomInput key={"companyName"}
                          inputId={"companyName"}
                          formId={this.state.form.id} label={this.state.form.inputData.companyName.label}
                          required={this.state.form.inputData.companyName.required} value={this.state.form.inputData.companyName.value}
                          type={this.state.form.inputData.companyName.type} pattern={this.state.form.inputData.companyName.pattern}
                          onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.companyName.disabled} />
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
                          inputId={"phone"}
                          formId={this.state.form.id} label={this.state.form.inputData.phone.label}
                          required={this.state.form.inputData.phone.required} value={this.state.form.inputData.phone.value}
                          type={this.state.form.inputData.phone.type} pattern={this.state.form.inputData.phone.pattern}
                          onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.phone.disabled} />
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
                    <div className="row pt-5">
                      <div className="col-xl-6 col-10">
                        {
                          this.state.form.isDisabled ? <div><br/><br/></div> :
                            <label>
                              <input type="checkbox" className="mr-2" checked={this.state.form.underwritingChecked} onChange={this.toggleUnderwritingCheck}/>
                              I have a good faith belief that the use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.
                            </label>

                        }
                      </div>
                    </div>
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
                                <button type="submit" className="btn btn-primary btn-sm no-border-radius px-4 font-size-14" disabled={!this.state.form.underwritingChecked}>
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
  userProfile: PropTypes.object,
  updateUserProfile: PropTypes.func
};

const mapStateToProps = state => {
  return {
    userProfile: state.userProfile
  };
};

const mapDispatchToProps = {
  updateUserProfile
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile);
