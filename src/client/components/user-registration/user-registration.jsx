import React from "react";
import { connect } from "react-redux";
import "../../styles/user-registration/user-registration.scss";
import BootstrapInput from "./bootstrap-input";

class UserRegistration extends React.Component {

  constructor (props) {
    super(props);

    this.onInputChange = this.onInputChange.bind(this);

    this.state = {
      loginRedirectLink: "/api/login/falcon-redirect",
      form: {
        id: "user-reg-form",
        inputData: {
          firstName: {
            label: "First Name",
            required: true,
            value: "",
            type: "text",
            pattern: null
          },
          lastName: {
            label: "Last Name",
            required: true,
            value: "",
            type: "text",
            pattern: null
          },
          email: {
            label: "Email Address",
            required: true,
            value: "",
            type: "email",
            pattern: null
          },
          phone: {
            label: "Phone Number",
            required: false,
            value: "",
            type: "text",
            pattern: null
          },
          password: {
            label: "Password",
            required: true,
            value: "",
            type: "password",
            pattern: null
          },
          confirmPassword: {
            label: "Confirm Password",
            required: true,
            value: "",
            type: "password",
            pattern: null
          }
        }
      }
    };

    this.submitRegistrationForm = this.submitRegistrationForm.bind(this);
  }

  onInputChange (evt, key) {

    if (evt && evt.target && evt.target.value) {
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

  submitRegistrationForm () {

    console.log("hi");
  }

  render () {

    const disabledSubmitClass = "btn-light text-secondary input-border cursor-default";
    const enabledSubmitClass = "btn-dark text-white";

    return (
      <div className="view-container register-user-container">
        <div className="row h-100 bg-white">
          <div className="register-user-left-panel col-sm-3 bg-navy-blue">
            <h3 className="text-white text-center mt-5 pt-5">Walmart</h3>
          </div>
          <div className="register-user-form-panel col-sm-9">
            <div className="row align-self-center h-100 align-items-center justify-content-center">
              <div className="form-content-col col-md-5 col-11 text-center p-4">

                <div className="row form-header-row">
                  <div className="col text-left">
                    <span className="create-profile-header text-left">Create User Profile</span>
                  </div>
                </div>

                <div className="row form-description-row my-2">
                  <div className="col text-left">
                    <span className="create-profile-description text-left">
                      Provide the information in the form below to create your profile. A user profile is must for registering your brand.
                    </span>
                  </div>
                </div>

                <div className="row form-inputs-row">
                  <div className="col text-left">
                    <form autoComplete="off">
                      {
                        Object.keys(this.state.form.inputData).map(key => {
                          const formInput = this.state.form.inputData[key];
                          return (
                            <BootstrapInput key={key} inputId={key} formId={this.state.form.id} label={formInput.label}
                              required={formInput.required} value={formInput.value}
                              type={formInput.type} pattern={formInput.pattern} onChangeEvent={this.onInputChange} />
                          );
                        })
                      }
                      <div className="row mt-5">
                        <div className="col">
                          <button type="submit" className={`${enabledSubmitClass} submit-btn btn btn-block no-border-radius`} >
                            CREATE ACCOUNT
                          </button>
                        </div>
                      </div>

                      <div className="row mt-2">
                        <div className="col text-center text-secondary">
                          OR
                        </div>
                      </div>

                      <div className="row mt-2">
                        <div className="col text-center text-secondary">
                          Already have an account?
                        </div>
                      </div>

                      <div className="row">
                        <div className="col">
                          <a className={`${enabledSubmitClass} submit-btn btn btn-block no-border-radius`} href={this.state.loginRedirectLink}>
                            LOG IN
                          </a>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userRegistration: state.userRegistration
  };
};

export default connect(
  mapStateToProps,
  dispatch => ({dispatch})
)(UserRegistration);
