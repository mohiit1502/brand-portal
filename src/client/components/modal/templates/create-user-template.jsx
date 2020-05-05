import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {saveUser} from "../../../actions/user/edit-user-actions";
import {TOGGLE_ACTIONS} from "../../../actions/modal-actions";
import "../../../styles/modal/templates/create-user-template.scss";
import CustomInput from "../../custom-input/custom-input";
import Http from "../../../utility/Http";
import Cookies from "electrode-cookies";
import ClientUtils from "../../../utility/ClientUtils";


class CreateUserTemplate extends React.Component {

  constructor(props) {
    super(props);
    this.saveChanges = this.saveChanges.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.setSelectInputValue = this.setSelectInputValue.bind(this);
    this.setMultiSelectInputValue = this.setMultiSelectInputValue.bind(this);
    this.undertakingtoggle = this.undertakingtoggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      form: {
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
                value: "Internal"
              },
              {
                id: 2,
                value: "3rd Party"
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
            label: "Email ID",
            required: true,
            value: "",
            type: "email",
            pattern: null,
            disabled: false
          },
          phone: {
            label: "Mobile Number",
            required: false,
            value: "",
            type: "text",
            pattern: null,
            disabled: false
          },
          role: {
            label: "Set Role",
            required: true,
            value: "",
            type: "select",
            pattern: null,
            disabled: false,
            options: []
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
        undertaking: {
          selected: false,
          label: "I have a good faith belief that the use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law."
        }
      }
    };
  }

  componentDidMount() {
    this.fetchRolesForUser();
    this.fetchBrandsForUser();
  }

  async handleSubmit(evt) {
    evt.preventDefault();

    const loginId = this.state.form.inputData.emailId.value;
    const brands = this.state.form.inputData.brands.options.filter(v => v.selected).map(v => ({id: v.id}));
    const isThirdParty = this.state.form.inputData.userType.value.toLowerCase() !== "internal";
    const firstName = this.state.form.inputData.firstName.value;
    const lastName = this.state.form.inputData.lastName.value;
    const role = {
      id: this.state.form.inputData.role.options[ClientUtils.where(this.state.form.inputData.role.options, {value: this.state.form.inputData.role.value})].id
    };

    const payload = {
      user: {
        loginId,
        firstName,
        lastName,
        brands,
        role,
        phoneCountry: "+1",
        phoneNumber: this.state.form.inputData.phone.value
      }
    };

    if (isThirdParty) {
      payload.user = {
        ...payload.user,
        properties: {
        isThirdPary: isThirdParty,
          companyName: this.state.form.inputData.companyName.value
      }};
    }

    const url = "/api/users";
    Http.post(url, payload)
      .then(res => {
        this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
      });
  }

  async fetchRolesForUser () {
    const form = {...this.state.form};

    return Http.get("/api/newUser/roles")
      .then(res => {
        form.inputData.role.options = res.roles;

        form.inputData.role.options.map(v => {v.value = v.name; });

        this.setState({form});

      });
  }

  async fetchBrandsForUser () {
    const form = {...this.state.form};

    return Http.get("/api/newUser/brands")
      .then(res => {
        form.inputData.brands.options = res;

        form.inputData.brands.options.map(v => {v.value = v.name; v.selected = false;});

        this.setState({form});
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

  setSelectInputValue (value, key) {
    if (value) {
      this.setState(state => {
        state = {...state};
        state.form.inputData[key].value = value;
        return {
          ...state
        };
      });
    }
  }

  setMultiSelectInputValue (selectedList, key, optionId) {
    if (selectedList && optionId) {
      this.setState(state => {
        state = {...state};
        state.form.inputData[key].value = selectedList.join(", ");
        return {
          ...state
        };
      });
    }
  }

  undertakingtoggle () {
    const state = {...this.state};
    state.form.undertaking.selected = !state.form.undertaking.selected;
    this.setState({
      ...state
    });
  }

  saveChanges() {
    this.props.saveUser();
  }


  render() {
    return (
      <div className="modal fade show" id="singletonModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header align-items-center">
              Add a New User
              <button type="button" className="close text-white" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body text-left">
              <form onSubmit={this.handleSubmit} className="h-100 pt-3">
                <div className="row">
                  <div className="col">
                    <div className="text-secondary font-size-14 mb-2">Select type of user</div>
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
                <div className="row mt-4">
                  <div className="col-4">
                    <CustomInput key={"firstName"}
                      inputId={"firstName"}
                      formId={this.state.form.id} label={this.state.form.inputData.firstName.label}
                      required={this.state.form.inputData.firstName.required} value={this.state.form.inputData.firstName.value}
                      type={this.state.form.inputData.firstName.type} pattern={this.state.form.inputData.firstName.pattern}
                      onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.firstName.disabled} />
                  </div>
                  <div className="col-4">
                    <CustomInput key={"lastName"}
                      inputId={"lastName"}
                      formId={this.state.form.id} label={this.state.form.inputData.lastName.label}
                      required={this.state.form.inputData.lastName.required} value={this.state.form.inputData.lastName.value}
                      type={this.state.form.inputData.lastName.type} pattern={this.state.form.inputData.lastName.pattern}
                      onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.lastName.disabled} />
                  </div>
                </div>
                {
                  this.state.form.inputData.userType.value.toLowerCase() !== "internal" &&
                  <div className="row">
                    <div className="col-4">
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

                <div className="row">
                  <div className="col-4">
                    <CustomInput key={"emailId"}
                      inputId={"emailId"}
                      formId={this.state.form.id} label={this.state.form.inputData.emailId.label}
                      required={this.state.form.inputData.emailId.required} value={this.state.form.inputData.emailId.value}
                      type={this.state.form.inputData.emailId.type} pattern={this.state.form.inputData.emailId.pattern}
                      onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.emailId.disabled} />
                  </div>
                  <div className="col-4">
                    <CustomInput key={"phone"}
                      inputId={"phone"}
                      formId={this.state.form.id} label={this.state.form.inputData.phone.label}
                      required={this.state.form.inputData.phone.required} value={this.state.form.inputData.phone.value}
                      type={this.state.form.inputData.phone.type} pattern={this.state.form.inputData.phone.pattern}
                      onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.phone.disabled} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <CustomInput key={"role"}
                      inputId={"role"}
                      formId={this.state.form.id} label={this.state.form.inputData.role.label}
                      required={this.state.form.inputData.role.required} value={this.state.form.inputData.role.value}
                      type={this.state.form.inputData.role.type} pattern={this.state.form.inputData.role.pattern}
                      onChangeEvent={this.setSelectInputValue} disabled={this.state.form.inputData.role.disabled}
                      dropdownOptions={this.state.form.inputData.role.options}/>
                  </div>
                  <div className="col-4">
                    <CustomInput key={"brands"}
                      inputId={"brands"}
                      formId={this.state.form.id} label={this.state.form.inputData.brands.label}
                      required={this.state.form.inputData.brands.required} value={this.state.form.inputData.brands.value}
                      type={this.state.form.inputData.brands.type} pattern={this.state.form.inputData.brands.pattern}
                      onChangeEvent={this.setMultiSelectInputValue} disabled={this.state.form.inputData.brands.disabled}
                      dropdownOptions={this.state.form.inputData.brands.options}/>
                  </div>
                </div>
                <div className="row">
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
                <div className="row mt-3">
                  <div className="col text-right">
                    <div className="btn btn-sm cancel-btn text-primary" type="button" data-dismiss="modal">Cancel</div>
                    <button type="submit" className="btn btn-sm btn-secondary submit-btn px-3 ml-3">Invite</button>
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
  saveUser: PropTypes.func
};

const mapStateToProps = state => {
  return {
    userEdit: state.userEdit
  };
};

const mapDispatchToProps = {
  saveUser
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateUserTemplate);
