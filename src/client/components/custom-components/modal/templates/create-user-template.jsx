/* eslint-disable react/jsx-handler-names */
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {saveUserInitiated} from "../../../../actions/user/user-actions";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../actions/modal-actions";
import CustomInput from "../../../custom-components/custom-input/custom-input";
import Http from "../../../../utility/Http";
import ClientUtils from "../../../../utility/ClientUtils";
import CONSTANTS from "../../../../constants/constants";
import InputFormatter from "./../../../../utility/phoneOps";
import Helper from "../../../../utility/helper";
import "../../../../styles/custom-components/modal/templates/create-user-template.scss";

class CreateUserTemplate extends React.Component {

  constructor(props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
    this.setSelectInputValue = this.setSelectInputValue.bind(this);
    this.setMultiSelectInputValue = this.setMultiSelectInputValue.bind(this);
    // this.undertakingtoggle = this.undertakingtoggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.prepopulateInputFields = this.prepopulateInputFields.bind(this);
    this.resetTemplateStatus = this.resetTemplateStatus.bind(this);
    this.onInvalidHandler = this.onInvalidHandler.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.emailDebounce = Helper.debounce(this.onEmailChange, CONSTANTS.APIDEBOUNCETIMEOUT);
    this.invalid = {emailId: false, phone: false};

    this.state = {
      form: {
        submitDisabled: true,
        isUpdateTemplate: false,
        templateUpdateComplete: false,
        isDisabled: false,
        underwritingChecked: false,
        id: "user-profile-form",
        inputData: {
          userType: {
            name: "userType",
            label: "",
            required: true,
            value: "Internal",
            type: "radio",
            options: [
              {
                id: 1,
                value: "Internal",
                label: "Internal"
              },
              {
                id: 2,
                value: "ThirdParty",
                label: "3rd Party"
              }
            ],
            disabled: false
          },
          firstName: {
            label: "First Name",
            required: true,
            value: "",
            type: "text",
            pattern: null,
            disabled: false
          },
          lastName: {
            label: "Last Name",
            required: true,
            value: "",
            type: "text",
            pattern: null,
            disabled: false
          },
          companyName: {
            label: "Company Name",
            required: true,
            value: "",
            type: "text",
            pattern: null,
            disabled: false
          },
          emailId: {
            label: "Email",
            required: true,
            value: "",
            type: "email",
            pattern: CONSTANTS.REGEX.EMAIL,
            disabled: false,
            invalidError: CONSTANTS.REGEX.EMAILERROR,
            error: "",
            isUnique: true
          },
          phone: {
            label: "Mobile Number",
            required: false,
            value: "",
            type: "text",
            pattern: CONSTANTS.REGEX.PHONE,
            disabled: false,
            invalidError: CONSTANTS.REGEX.PHONEERROR,
            maxLength: 17
          },
          role: {
            label: "Set Role",
            required: true,
            value: "",
            type: "select",
            pattern: null,
            disabled: false,
            options: [],
            tooltipContent: (
              <div className="py-2">
                <p className="position-absolute text-white tooltip-close-button">x</p>
                <ul className="m-0 pl-3 text-left font-size-12">
                  <li>Option 1:<br />Admin: can invite reporter-level users, add new brands, submit claims, and view all submitted claims.<br/>
                      Reporter: can submit claims and see submitted claims for their assigned brands.<br /></li>
                  <li>Option 2:<br />See <a href="/help" target="_blank">"How to manage user roles and permissions"</a></li>
                </ul>
              </div>
            )
          },
          brands: {
            label: "Assign Brand",
            required: true,
            value: "",
            type: "multiselect",
            pattern: null,
            disabled: false,
            options: []
          }
        },
        // undertaking: {
        //   selected: false,
        //   label: "I have a good faith belief that the use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law."
        // }
      },
      loader: false,
      fieldLoader: false,
      allSelected: false
    };
  }

  loader (type, enable) {
    this.setState(state => {
      const stateClone = {...state};
      stateClone[type] = enable;
      return stateClone;
    });
  }

  onEmailChange() {
    const emailId = this.state.form.inputData.emailId;
    if (emailId.value && emailId.error !== emailId.invalidError) {
      this.loader("fieldLoader", true);
      Http.get("/api/users/checkUnique", {email: emailId.value}).then(res => {
        this.loader("fieldLoader", false);
        let error;
        let isUnique;
        if (!res.body.unique) {
          error = "This email already exists in the Walmart Brand Portal.";
          isUnique = false;
        } else {
          error = "";
          isUnique = true;
        }
        this.setState(state => {
          state = {...state};
          const emailIdInner = state.form.inputData.emailId;
          (emailIdInner.error !== emailIdInner.invalidError) && (emailIdInner.error = error);
          emailIdInner.isUnique = isUnique;
          return state;
        }, this.checkToEnableSubmit);
      })
      .catch(err => this.loader("fieldLoader", false));
    }
  }

  componentDidMount() {
    if (this.props.data && !this.state.form.templateUpdateComplete) {
      this.prepopulateInputFields(this.props.data);
    }
    this.fetchRolesForUser();
    this.fetchBrandsForUser();
    const formatter = new InputFormatter();
    const handlers = formatter.on("#user-profile-form-phone-custom-input");
    this.customChangeHandler = handlers.inputHandler;
  }

  componentDidUpdate(prevProps) {
    if (this.props.data && this.props.data !== prevProps.data && !this.state.form.templateUpdateComplete) {
      this.prepopulateInputFields(this.props.data);
    }
  }

  prepopulateInputFields (data) {
    const form = {...this.state.form};
    form.inputData.firstName.value = data.firstName;
    // form.inputData.companyName.value = data.properties.isThirdPary ? data.properties.companyName : "";
    form.inputData.companyName.value = data.type === CONSTANTS.USER.USER_TYPE.THIRD_PARTY ? data.companyName : "";
    form.inputData.userType.value = data.type;
    form.inputData.lastName.value = data.lastName;
    form.inputData.emailId.value = data.email;
    form.inputData.emailId.disabled = true;
    form.inputData.phone.value = data.phoneNumber;
    form.inputData.role.value = data.role.name;
    form.inputData.brands = this.getPopulatedBrands(this.state.form.inputData.brands);
    form.templateUpdateComplete = true;

    form.isUpdateTemplate = true;
    this.setState({form});
  }

  getPopulatedBrands (brands) {
    // console.log(brands);
    if (brands.options.length) {
      if (this.props.data && this.props.data.brands) {
        brands.value = this.props.data.brands.map(brand => brand.name).join(", ");
      }

      brands.options = brands.options.map(brand => {
        brand.value = brand.name || brand.brandName;
        let selected = false;
        if (this.props.data && this.props.data.brands) {
          selected = ClientUtils.where(this.props.data.brands, {id: brand.id}) > -1;
        }
        brand.selected = selected;
        return brand;
      });
      return brands;
    } else {
      return brands;
    }
  }

  resetTemplateStatus () {
    const form = {...this.state.form};
    form.templateUpdateComplete = false;
    form.isUpdateTemplate = false;

    form.inputData.firstName.value = "";
    form.inputData.userType.value = "Internal";
    form.inputData.companyName.value = "";
    form.inputData.lastName.value = "";
    form.inputData.emailId.value = "";
    form.inputData.role.value = "";
    form.inputData.brands.value = "";
    form.inputData.brands.options = form.inputData.brands.options.map(brand => {
      brand.selected = false;
      return brand;
    });

    this.setState({form});
    this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
  }

  onInputChange (evt, key) {
    if (evt && evt.target) {
      evt.target.checkValidity();
      const target = evt.target;
      this.setState(state => {
        const targetVal = target.value;
        state = {...state};
        const inputData = state.form.inputData;
        inputData[key].value = targetVal;
        inputData[key].error = !this.invalid[key] ? "" : inputData[key].error;
        if (key === "emailId") {
          inputData.emailId.isUnique = false;
          (inputData.emailId.error !== inputData.emailId.invalidError) && (inputData.emailId.error = "");
          this.emailDebounce();
        }
        this.invalid[key] = false;
        return {
          ...state
        };
      }, this.checkToEnableSubmit);
    }
  }

  checkToEnableSubmit() {
    const form = {...this.state.form};
    const bool = !!(form.inputData.firstName.value && form.inputData.lastName.value &&
      form.inputData.emailId.value && form.inputData.emailId.isUnique !== false && !form.inputData.phone.error &&
      form.inputData.role.value && form.inputData.brands.value) && (form.inputData.userType && form.inputData.userType.value === "ThirdParty" ? !!form.inputData.companyName.value : true);
      // && form.undertaking.selected;

    form.submitDisabled = !bool;
    this.setState({form});
  }

  setSelectInputValue (value, key) {
    if (value) {
      this.setState(state => {
        state = {...state};
        state.form.inputData[key].value = value;
        return {
          ...state
        };
      }, this.checkToEnableSubmit);
    }
  }

  // eslint-disable-next-line max-params
  setMultiSelectInputValue (selectedList, key, optionId, allSelected) {
    if (selectedList && optionId) {
      this.setState(state => {
        state = {...state};
        state.allSelected = allSelected;
        state.form.inputData[key].value = selectedList.join(", ");
        return {
          ...state
        };
      }, this.checkToEnableSubmit);
    }
  }

  // undertakingtoggle () {
  //   const state = {...this.state};
  //   state.form.undertaking.selected = !state.form.undertaking.selected;
  //   this.setState({
  //     ...state
  //   }, this.checkToEnableSubmit);
  // }

  // eslint-disable-next-line max-statements
  async handleSubmit(evt) {
    evt.preventDefault();

    let brands = this.state.form.inputData.brands.options.filter(v => v.selected);
    const allIndex = brands.findIndex(brand => brand.name.toLowerCase() === "all");
    // eslint-disable-next-line no-unused-expressions
    !this.state.allSelected && allIndex !== -1 && (brands = brands.filter(brand => brand.name.toLowerCase() !== "all"));

    const loginId = this.state.form.inputData.emailId.value;
    brands = brands.map(v => ({id: v.id}));
    const isThirdParty = this.state.form.inputData.userType.value.toLowerCase() !== "internal";
    const firstName = this.state.form.inputData.firstName.value;
    const lastName = this.state.form.inputData.lastName.value;
    // console.log(this.state.form.inputData.role.options);
    const selectedRole = this.state.form.inputData.role.options[ClientUtils.where(this.state.form.inputData.role.options, {value: this.state.form.inputData.role.value})];
    const role = {
      id: selectedRole.id,
      name: selectedRole.name
    };

    const payload = {
      user: {
        email: loginId,
        firstName,
        lastName,
        brands,
        role,
        phoneCountry: "+1",
        phoneNumber: this.state.form.inputData.phone.value,
        type: isThirdParty ? "ThirdParty" : "Internal"
      }
    };

    if (isThirdParty) {
      payload.user.companyName = this.state.form.inputData.companyName.value;
    }

    const url = "/api/users";
    this.loader("loader", true);
    if (this.state.form.isUpdateTemplate) {
      return Http.put(`${url}/${payload.user.email}`, payload)
        .then(() => {
          this.resetTemplateStatus();
          this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
          this.props.saveUserInitiated();
          this.loader("loader", false);
        })
        .catch(err => {
          this.loader("loader", false);
          console.log(err);
        });
    } else {

      return Http.post(url, payload)
        .then(res => {
          this.resetTemplateStatus();
          this.props.saveUserInitiated();
          const meta = { templateName: "NewUserAddedTemplate", data: {...res.body.user} };
          this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  async fetchRolesForUser () {
    this.loader("loader", true);
    return Http.get("/api/newUser/roles")
      .then(res => {
        const form = {...this.state.form};
        form.inputData.role.options = res.body.roles;
        form.inputData.role.options.map(v => {v.value = v.name; });
        this.setState({form});
        this.loader("loader", false);
      });
  }

  async fetchBrandsForUser () {
    this.loader("loader", true);
    return Http.get("/api/newUser/brands")
      .then(res => {
        const form = {...this.state.form};
        form.inputData.brands.options = res.body.brands;
        form.inputData.brands.options = form.inputData.brands.options.map(v => {v.value = v.brandName; v.selected = false; return v;});
        // console.log(form.inputData.brands.options);
        form.inputData.brands = this.getPopulatedBrands(form.inputData.brands);
        this.setState({form});
        this.loader("loader", false);
      });
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
    return (
      <div className="modal show create-user-modal" id="singletonModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header align-items-center">
              {
                this.state.form.isUpdateTemplate ? "Edit User" : "Invite a New User"
              }
              <button type="button" className="close text-white" aria-label="Close" onClick={this.resetTemplateStatus}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className={`modal-body text-left ${this.state.loader && "loader"}`}>
              <form onSubmit={this.handleSubmit} className="h-100 px-2" style={{paddingLeft: "0"}}>
                <div className="row userType">
                  <div className="col">
                    <div className="text-secondary font-size-14 mb-2">Select the type of user you are inviting</div>
                    <div>
                      <CustomInput key={"userType"}
                        inputId={"userType"} radioOptions={this.state.form.inputData.userType.options}
                        formId={this.state.form.id} label={this.state.form.inputData.userType.label}
                        required={this.state.form.inputData.userType.required} value={this.state.form.inputData.userType.value}
                        type={this.state.form.inputData.userType.type}
                        onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.userType.disabled} />
                    </div>
                  </div>
                </div>
                <div className="row form-prompt">
                  <div className="col">
                    <p>Please complete the following fields to invite a new user.</p>
                  </div>
                </div>
                <div className="row fname-lname">
                  <div className="col-6">
                    <CustomInput key={"firstName"}
                      inputId={"firstName"}
                      formId={this.state.form.id} label={this.state.form.inputData.firstName.label}
                      required={this.state.form.inputData.firstName.required} value={this.state.form.inputData.firstName.value}
                      type={this.state.form.inputData.firstName.type} pattern={this.state.form.inputData.firstName.pattern}
                      onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.firstName.disabled} />
                  </div>
                  <div className="col-6">
                    <CustomInput key={"lastName"}
                      inputId={"lastName"}
                      formId={this.state.form.id} label={this.state.form.inputData.lastName.label}
                      required={this.state.form.inputData.lastName.required} value={this.state.form.inputData.lastName.value}
                      type={this.state.form.inputData.lastName.type} pattern={this.state.form.inputData.lastName.pattern}
                      onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.lastName.disabled} />
                  </div>
                </div>
                {
                  this.state.form.inputData.userType.value && this.state.form.inputData.userType.value.toLowerCase() !== "internal" &&
                  <div className="row company">
                    <div className="col-6">
                      <CustomInput key={"companyName"}
                        inputId={"companyName"}
                        formId={this.state.form.id} label={this.state.form.inputData.companyName.label}
                        required={this.state.form.inputData.companyName.required} value={this.state.form.inputData.companyName.value}
                        type={this.state.form.inputData.companyName.type} pattern={this.state.form.inputData.companyName.pattern}
                        onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.companyName.disabled} />
                    </div>
                    <div className="col" />
                  </div>
                }

                <div className="row contact-details">
                  <div className="col-6">
                    <CustomInput key={"emailId"}
                      inputId={"emailId"}
                      formId={this.state.form.id} label={this.state.form.inputData.emailId.label}
                      required={this.state.form.inputData.emailId.required} value={this.state.form.inputData.emailId.value}
                      type={this.state.form.inputData.emailId.type} pattern={this.state.form.inputData.emailId.pattern} onInvalidHandler={this.onInvalidHandler}
                      error={this.state.form.inputData.emailId.error} onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.emailId.disabled}
                      loader={this.state.fieldLoader} />
                  </div>
                  <div className="col-6">
                    <CustomInput key={"phone"}
                      inputId={"phone"}
                      formId={this.state.form.id} label={this.state.form.inputData.phone.label}
                      required={this.state.form.inputData.phone.required} value={this.state.form.inputData.phone.value}
                      type={this.state.form.inputData.phone.type} pattern={this.state.form.inputData.phone.pattern} customChangeHandler={this.customChangeHandler}
                      onInvalidHandler={this.onInvalidHandler} error={this.state.form.inputData.phone.error} maxLength={this.state.form.inputData.phone.maxLength}
                      onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.phone.disabled} />
                  </div>
                </div>
                <div className="row role-and-brand">
                  <div className="col-6">
                    <CustomInput key={"role"}
                      inputId={"role"} formId={this.state.form.id} label={this.state.form.inputData.role.label} required={this.state.form.inputData.role.required}
                      value={this.state.form.inputData.role.value} type={this.state.form.inputData.role.type} pattern={this.state.form.inputData.role.pattern}
                      onChangeEvent={this.setSelectInputValue} disabled={this.state.form.inputData.role.disabled} dropdownOptions={this.state.form.inputData.role.options}
                      tooltipContent={this.state.form.inputData.role.tooltipContent} />
                  </div>
                  <div className="col-6">
                    <CustomInput key={"brands"}
                      inputId={"brands"}
                      formId={this.state.form.id} label={this.state.form.inputData.brands.label}
                      required={this.state.form.inputData.brands.required} value={this.state.form.inputData.brands.value}
                      type={this.state.form.inputData.brands.type} pattern={this.state.form.inputData.brands.pattern}
                      onChangeEvent={this.setMultiSelectInputValue} disabled={this.state.form.inputData.brands.disabled}
                      dropdownOptions={this.state.form.inputData.brands.options}/>
                  </div>
                </div>
                {/* <div className="row">
                  <div className="col">
                    <div className="form-check">
                      <input type="checkbox" id="user-undertaking" className="form-check-input user-undertaking" checked={this.state.form.undertaking.selected} required={true}
                        onChange={this.undertakingtoggle}/>
                      <label className="form-check-label user-undertaking-label" htmlFor="user-undertaking">
                        {this.state.form.undertaking.label}
                      </label>
                    </div>
                  </div>
                </div> */}
                <div className="row action-footer">
                  <div className="col text-right">
                    <div className="btn btn-sm cancel-btn text-primary" type="button" onClick={this.resetTemplateStatus}>Cancel</div>
                    <button type="submit" className="btn btn-sm btn-primary submit-btn px-3 ml-3" disabled={this.state.form.submitDisabled}>
                      {
                        this.state.form.isUpdateTemplate ? "Save" : "Invite"
                      }
                    </button>
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

CreateUserTemplate.propTypes = {
  toggleModal: PropTypes.func,
  saveUserInitiated: PropTypes.func,
  data: PropTypes.object
};

const mapStateToProps = state => {
  return {
    userEdit: state.userEdit
  };
};

const mapDispatchToProps = {
  saveUserInitiated,
  toggleModal
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateUserTemplate);
