/* eslint-disable react/jsx-handler-names, no-unused-expressions, max-statements, complexity */
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Cookies from "electrode-cookies";
import {saveUserInitiated} from "../../../../actions/user/user-actions";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../actions/modal-actions";
import {showNotification} from "../../../../actions/notification/notification-actions";
import Http from "../../../../utility/Http";
import ClientUtils from "../../../../utility/ClientUtils";
import InputFormatter from "./../../../../utility/phoneOps";
import Helper from "../../../../utility/helper";
import Validator from "../../../../utility/validationUtil";
import ContentRenderer from "../../../../utility/ContentRenderer";
import CONSTANTS from "../../../../constants/constants";
import "../../../../styles/custom-components/modal/templates/create-user-template.scss";
import mixpanel from "../../../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../../../constants/mixpanelConstants";

class CreateUserTemplate extends React.Component {

  constructor(props) {
    super(props);
    const functions = ["bubbleValue", "onChange", "setSelectInputValue", "setMultiSelectInputValue", "handleSubmit", "prepopulateInputFields", "handleSubmit", "resetTemplateStatus"];
    const debounceFunctions = {emailDebounce: "onEmailChange"};
    functions.forEach(name => {
      this[name] = this[name].bind(this);
    });
    Object.keys(debounceFunctions).forEach(name => {
      const functionToDebounce = Validator[debounceFunctions[name]] ? Validator[debounceFunctions[name]].bind(this) : this[debounceFunctions[name]];
      this[name] = Helper.debounce(functionToDebounce, CONSTANTS.APIDEBOUNCETIMEOUT);
    });
    this.onInvalid = Validator.onInvalid.bind(this);
    this.invalid = {emailId: false, phone: false};
    this.getFieldRenders = ContentRenderer.getFieldRenders.bind(this);
    this.loader = Helper.loader.bind(this);
    const newUserContent = this.props.newUserContent ? this.props.newUserContent : {};

    this.state = {
      clientType: Cookies.get("client_type"),
      section: {...newUserContent.sectionConfig},
      form: {
        ...newUserContent.formConfig,
        inputData: {...newUserContent.fields}
      },
      uniquenessCheckStatus: "",
      loader: false,
      fieldLoader: false,
      allSelected: false
    };

    this.state.form.inputData.role.tooltipContent = (
            <div className="py-2">
              <b className="position-absolute text-white tooltip-close-button">x</b>
              <p className="mt-2 pl-2 text-left font-size-12">
                <b>Admin:</b> Can invite reporter-level users, add new brands, submit claims, and view all submitted claims.<br/>
                <br />
                <b>Reporter:</b> Can submit claims and see submitted claims for their assigned brands.<br />
              </p>
            </div>);
    const formatter = new InputFormatter();
    const handlers = formatter.on(`#${this.state.section.id}-${this.state.form.inputData.phone.inputId}-custom-input`);
    this.prebounceChangeHandler = handlers.inputHandler;
  }

  componentDidMount() {
    if (this.props.data && !this.state.form.templateUpdateComplete) {
      this.prepopulateInputFields(this.props.data);
    }
    this.fetchRolesForUser();
    this.fetchBrandsForUser();
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
    form.inputData.phone.value = (data.phoneNumber === "0000000000") || (data.phoneNumber === "(000) 000-0000") ? "" : data.phoneNumber;
    form.inputData.role.value = data.role.name;
    form.inputData.brands = this.getPopulatedBrands(this.state.form.inputData.brands);
    form.templateUpdateComplete = true;

    form.isUpdateTemplate = true;
    this.setState({form});
  }

  getPopulatedBrands (brands) {
    // console.log(brands);
    if (brands.dropdownOptions.length) {
      if (this.props.data && this.props.data.brands) {
        brands.value = this.props.data.brands.map(brand => brand.name).join(", ");
      }

      brands.dropdownOptions = brands.dropdownOptions.map(brand => {
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

  resetTemplateStatus (e) {
    const form = {...this.state.form};
    form.templateUpdateComplete = false;
    form.isUpdateTemplate = false;

    form.inputData.firstName.value = "";
    form.inputData.userType.value = "Internal";
    form.inputData.companyName.value = "";
    form.inputData.lastName.value = "";
    form.inputData.emailId.value = "";
    form.inputData.phone.value = "";
    form.inputData.role.value = "";
    form.inputData.brands.value = "";
    form.inputData.brands.dropdownOptions = form.inputData.brands.dropdownOptions.map(brand => {
      brand.selected = false;
      return brand;
    });

    form.inputData.firstName.error = "";
    form.inputData.userType.error = "Internal";
    form.inputData.companyName.error = "";
    form.inputData.lastName.error = "";
    form.inputData.emailId.error = "";
    form.inputData.phone.error = "";

    form.inputData.emailId.loader = false;
    form.inputData.emailId.fieldOk = false;
    form.inputData.emailId.disabled = false;
    form.inputData.emailId.isUnique = true;

    form.inputData.userActions.buttons.submit.disabled = true;
    this.setState({form});
    this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
    if (e) {
      const mixpanelPayload = {WORK_FLOW: this.state.form && this.state.form.isUpdateTemplate ? "VIEW_USER_LIST" : "INVITE_NEW_USER"};
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.INVITE_NEW_USER_TEMPLATE_EVENTS.CANCEL_SUBMIT_USER_DETAILS, mixpanelPayload);
    }
  }

  bubbleValue (evt, key, error) {
    const targetVal = evt.target.value;
    this.setState(state => {
      state = {...state};
      state.form.inputData[key].value = targetVal;
      state.form.inputData[key].error = error;
      return state;
    }, this.checkToEnableSubmit);
  }

  onChange (evt, key) {
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
          inputData.emailId.fieldOk = false;
          (inputData.emailId.error !== CONSTANTS.ERRORMESSAGES.EMAILERROR) && (inputData.emailId.error = "");
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

    form.inputData.userActions.buttons.submit.disabled = !bool;
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

  async handleSubmit(evt) {
    evt.preventDefault();
    const mixpanelClickEventPayload = {
      IS_UPDATE_USER: this.state.form && this.state.form.isUpdateTemplate,
      WORK_FLOW: this.state.form && this.state.form.isUpdateTemplate ? "VIEW_USER_LIST" : "INVITE_NEW_USER"
    };
    mixpanel.trackEvent(MIXPANEL_CONSTANTS.INVITE_NEW_USER_TEMPLATE_EVENTS.SUBMIT_CREATED_USER_CLICKED, mixpanelClickEventPayload);
    const brandsSelected = this.state.form.inputData.brands.dropdownOptions.filter(v => v.selected);
    const brands = brandsSelected.filter(brand => brand.name.toLowerCase() !== "all").map(v => ({id: v.id}));
    const loginId = this.state.form.inputData.emailId.value;
    const isThirdParty = this.state.form.inputData.userType.value.toLowerCase() !== "internal";
    const firstName = this.state.form.inputData.firstName.value;
    const lastName = this.state.form.inputData.lastName.value;
    const selectedRole = this.state.form.inputData.role.dropdownOptions[ClientUtils.where(this.state.form.inputData.role.dropdownOptions, {value: this.state.form.inputData.role.value})];
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
        organization: this.props.userProfile.organization,
        role,
        phoneCountry: "+1",
        phoneNumber: this.state.form.inputData.phone.value ? this.state.form.inputData.phone.value : "0000000000", //[note:to handle VIP phone number validation]
        type: isThirdParty ? CONSTANTS.USER.USER_TYPE.THIRD_PARTY : CONSTANTS.USER.USER_TYPE.INTERNAL
      }
    };

    isThirdParty && (payload.user.companyName = this.state.form.inputData.companyName.value);
    const url = "/api/users";
    this.loader("form", true);
    const mixpanelPayload = {
      API: url,
      INVITEE_COMPANY_NAME: this.props.userProfile && this.props.userProfile.organization && this.props.userProfile.organization.name,
      INVITEE_EMAIL: loginId,
      INVITEE_BRANDS: brandsSelected && brandsSelected.filter(brand => brand.name.toLowerCase() !== "all").map(v => {return v.value;}),
      INVITEE_ROLE: role && role.name,
      IS_UPDATE_USER: this.state.form && this.state.form.isUpdateTemplate,
      WORK_FLOW: this.state.form && this.state.form.isUpdateTemplate ? "VIEW_USER_LIST" : "INVITE_NEW_USER"
    };
    if (this.state.form.isUpdateTemplate) {
      return Http.put(`${url}/${payload.user.email}`, payload, {clientType: this.state.clientType}, null, this.props.showNotification, "User has been updated successfully", "Unable to update the user!")
        .then(() => {
          this.resetTemplateStatus();
          this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
          this.props.saveUserInitiated();
          this.loader("form", false);
          mixpanelPayload.API_SUCCESS = true;
        })
        .catch(err => {
          this.loader("form", false);
          mixpanelPayload.API_SUCCESS = false;
          mixpanelPayload.ERROR = err.message ? err.message : err;
        })
        .finally(() => {
          mixpanel.trackEvent(MIXPANEL_CONSTANTS.INVITE_NEW_USER_TEMPLATE_EVENTS.USER_DETAILS_SUBMISSION, mixpanelPayload);
        });
    } else {
      return Http.post(url, payload, null, null, this.props.showNotification, "", `Unable to invite user, please try with a different mail ID`)
        .then(res => {
          this.resetTemplateStatus();
          this.props.saveUserInitiated();
          const meta = { templateName: "NewUserAddedTemplate", data: {...res.body.user} };
          this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
          this.loader("form", false);
          mixpanelPayload.API_SUCCESS = true;
        })
        .catch(err => {
          this.loader("form", false);
          mixpanelPayload.API_SUCCESS = false;
          mixpanelPayload.ERROR = err.message ? err.message : err;
        })
        .finally(() => {
          mixpanel.trackEvent(MIXPANEL_CONSTANTS.INVITE_NEW_USER_TEMPLATE_EVENTS.USER_DETAILS_SUBMISSION, mixpanelPayload);
        });
    }
  }

  async fetchRolesForUser () {
    this.loader("form", true);
    Http.get("/api/newUser/roles")
      .then(res => {
        const form = {...this.state.form};
        form.inputData.role.dropdownOptions = res.body.roles;
        form.inputData.role.dropdownOptions.map(v => {v.value = v.name; });
        this.setState({form});
        this.loader("form", false);
      });
  }

  async fetchBrandsForUser () {
    this.loader("form", true);
    Http.get("/api/newUser/brands")
      .then(res => {
        const form = {...this.state.form};
        form.inputData.brands.dropdownOptions = res.body.brands;
        form.inputData.brands.dropdownOptions = form.inputData.brands.dropdownOptions.map(v => {v.value = v.brandName; v.selected = false; return v;});
        // console.log(form.inputData.brands.dropdownOptions);
        form.inputData.brands = this.getPopulatedBrands(form.inputData.brands);
        this.setState({form});
        this.loader("form", false);
      });
  }

  render() {
    const form = this.state.form;
    const section = this.state.section;
    return (
      <div className="modal show create-user-modal" id="singletonModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header align-items-center">
              {this.state.form.isUpdateTemplate ? section.sectionTitleEdit : section.sectionTitleNew}
              <button type="button" className="close text-white" aria-label="Close" onClick={this.resetTemplateStatus}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className={`modal-body text-left ${form.loader && "loader"}`}>
              <div className="text-secondary font-size-14 mb-2 pl-2">{form.formHeading}</div>
              <form onSubmit={this.handleSubmit} className="h-100 px-2 pl-0">
                {this.getFieldRenders()}
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateUserTemplate.propTypes = {
  newUserContent: PropTypes.object,
  toggleModal: PropTypes.func,
  saveUserInitiated: PropTypes.func,
  showNotification: PropTypes.func,
  data: PropTypes.object,
  userProfile: PropTypes.object
};

const mapStateToProps = state => {
  return {
    newUserContent: state.content && state.content.metadata && state.content.metadata.FORMSCONFIG && state.content.metadata.FORMSCONFIG.NEWUSER,
    userProfile: state.user.profile
  };
};

const mapDispatchToProps = {
  saveUserInitiated,
  showNotification,
  toggleModal
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateUserTemplate);
