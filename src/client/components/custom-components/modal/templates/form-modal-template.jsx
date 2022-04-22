/* eslint-disable max-statements, no-magic-numbers */
import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import Cookies from "electrode-cookies";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../actions/modal-actions";
import {NOTIFICATION_TYPE, showNotification} from "../../../../actions/notification/notification-actions";
import {saveBrandInitiated} from "../../../../actions/brand/brand-actions";
import {updateUserProfile} from "../../../../actions/user/user-actions";
import Http from "../../../../utility/Http";
import Helper from "../../../../utility/helper";
import Validator from "../../../../utility/validationUtil";
import ContentRenderer from "../../../../utility/ContentRenderer";
import mixpanel from "../../../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../../../constants/mixpanelConstants";
import "../../../../styles/custom-components/modal/templates/new-brand-template.scss";

class FormModalTemplate extends React.Component {

  constructor(props) {
    super(props);
    const functions = ["onChange", "resetTemplateStatus", "handleSubmit", "prepopulateInputFields", "undertakingtoggle"];
    functions.forEach(name => {
      this[name] = this[name].bind(this);
    });
    this.validateState = Validator.validateState.bind(this);
    this.getFieldRenders = ContentRenderer.getFieldRenders.bind(this);
    this.loader = Helper.loader.bind(this);
    const newPublicContactConfiguration = this.props.newPublicContactConfiguration ? this.props.newPublicContactConfiguration : {};
    this.state = {
      section: {...newPublicContactConfiguration.sectionConfig},
      form: {
        inputData: newPublicContactConfiguration.fields,
        ...newPublicContactConfiguration.formConfig
      },
      user: this.props.userProfile
    };
  }

  componentDidMount() {
    if (this.props.meta && this.props.meta.context === "edit") {
      this.prepopulateInputFields(this.state.user);
    }
  }

  prepopulateInputFields (data) {
    const form = {...this.state.form};
    const contactDetails = this.props.meta.subContext === "myInfo" ? data : data.organization.secondaryContactInformation;

    if (contactDetails) {
      form.inputData.firstName.value = this.props.meta.subContext === "myInfo" ? data.firstName
        : (data.organization.secondaryContactInformation ? data.organization.secondaryContactInformation.firstName : "");
      form.inputData.lastName.value = this.props.meta.subContext === "myInfo" ? data.lastName
        : (data.organization.secondaryContactInformation ? data.organization.secondaryContactInformation.lastName : "");
      form.inputData.phone.value = this.props.meta.subContext === "myInfo" ? data.phoneNumber
        : (data.organization.secondaryContactInformation ? data.organization.secondaryContactInformation.phone : "");
      form.inputData.email.value = this.props.meta.subContext === "myInfo" ? data.email
        :(data.organization.secondaryContactInformation ? data.organization.secondaryContactInformation.email : "");
    }

    form.templateUpdateComplete = true;
    form.isUpdateTemplate = true;
    this.setState({form});
  }

  // onKeyPress(evt, key) {
  //   if (key === "trademarkNumber" && ((evt.which < 48 || evt.which > 57) && !CONSTANTS.ALLOWED_KEY_CODES.includes(evt.which))) {
  //     evt.preventDefault();
  //   }
  // }

  undertakingtoggle (evt) {
    const state = {...this.state};
    state.form.inputData[evt.target.id].selected = !state.form.inputData[evt.target.id].selected;
    state.form.inputData[evt.target.id].error = "";
    this.setState({
      ...state
    });
  }

  onChange(evt, key) {
    if (evt && evt.target) {
      const targetVal = evt.target.value;
      this.setState(state => {
        state = {...state};
        state.form.inputData[key].value = targetVal;
        return state;
      });
    }
  }

  checkToEnableSubmit() {
    const form = {...this.state.form};
    const bool = form.isUpdateTemplate || (form.inputData.firstName.value &&
      form.inputData.lastName.value && form.inputData.email.value && form.inputData.phone.value);
    form.inputData.publiContactCreateActions.buttons.submit.disabled = !bool;
    this.setState({form});
  }

  async handleSubmit(evt) {
    const mixpanelClickEventPayload = {
      IS_UPDATE_BRAND: this.state.form && this.state.form.isUpdateTemplate,
      WORK_FLOW: this.state.form && this.state.form.isUpdateTemplate ? "EDIT_CONTACT_INFO" : "ADD_NEW_CONTACT_INFO"
    };
    mixpanel.trackEvent(MIXPANEL_CONSTANTS.NEW_BRAND_TEMPLATE_EVENTS.SUBMIT_BRAND_CLICKED, mixpanelClickEventPayload);
    if (this.props.meta.subContext) {
      evt.preventDefault();
      const firstName = this.state.form.inputData.firstName.value;
      const lastName = this.state.form.inputData.lastName.value;
      const loginId = this.state.form.inputData.email.value;
      const phone = this.state.form.inputData.phone.value;
      const payload = this.props.meta.subContext === "myInfo" ? {user: {firstName, lastName, loginId, phoneNumber: phone}}
        : {
          "orgId": this.state.user.organization.id,
          "org": {
            "secondaryContactInformation": {firstName, lastName, email: loginId, phone}
          }
        };
      const url = this.props.meta.subContext === "myInfo" ? `/api/users/${this.props.userProfile.email}` : `/api/org/updateContactInfo`;

      if (!this.validateState()) {
        const mixpanelPayload = {
          API: url,
          ORG_ID: this.state.user.organization.id
        };
        this.loader("form", true);
        return Http.put(url, payload)
          .then(res => {
            if (res.status === 200) {
              const user = JSON.parse(JSON.stringify(this.state.user));
              if (this.props.meta.subContext === "myInfo") {
                user.firstName = firstName;
                user.lastName = lastName;
                user.email = loginId;
                user.phoneNumber = phone;
              } else {
                const contactInfo = this.props.meta.context === "edit" ? user.organization.secondaryContactInformation : {};
                user.organization.secondaryContactInformation = contactInfo;
                contactInfo.firstName = firstName;
                contactInfo.lastName = lastName;
                contactInfo.email = loginId;
                contactInfo.phone = phone;
              }
              this.props.updateUserProfile(user);
            }
            this.resetTemplateStatus();
            this.props.showNotification(NOTIFICATION_TYPE.SUCCESS, `Request completed successfully.`);
            this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
            this.loader("form", false);
            //   mixpanelPayload.API_SUCCESS = true;
          })
          .catch(err => {
            this.loader("form", false);
            mixpanelPayload.API_SUCCESS = false;
            // this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
            mixpanelPayload.ERROR = err.message ? err.message : err;
            this.props.showNotification(NOTIFICATION_TYPE.ERROR, `Something went wrong, please try again!`);
          })
          .finally(() => {
            //   mixpanel.trackEvent(MIXPANEL_CONSTANTS.NEW_BRAND_TEMPLATE_EVENTS.BRAND_DETAILS_SUBMISSION, mixpanelPayload);
          });
      }
    }
  }

  resetTemplateStatus (e) {
    const form = {...this.state.form};
    form.inputData.firstName.value = "";
    form.inputData.lastName.value = "";
    form.inputData.email.value = "";
    form.inputData.phone.value = "";
    form.inputData.user_undertaking.value = "";
    form.inputData.user_undertaking.selected = false;

    form.inputData.firstName.error = "";
    form.inputData.lastName.error = "";
    form.inputData.email.error = "";
    form.inputData.phone.error = "";
    form.inputData.user_undertaking.error = "";

    this.setState({form});
    this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
    if (e) {
    //   const mixpanelPayload = {
    //     WORK_FLOW: this.state.form.isUpdateTemplate ? "VIEW_BRAND_LIST" : "ADD_NEW_BRAND"
    //   };
    //   mixpanel.trackEvent(MIXPANEL_CONSTANTS.NEW_BRAND_TEMPLATE_EVENTS.CANCEL_SUBMIT_BRAND_DETAILS, mixpanelPayload);
    }
  }

  /* eslint-disable react/jsx-handler-names */
  render() {
    const form = this.state.form;
    const section = this.state.section;
    return (
      <div className="modal show new-brand-modal" id="singletonModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header align-items-center">
              {
                (this.props.meta && this.props.meta.title) || (form.isUpdateTemplate ? section.sectionTitleEdit : section.sectionTitleNew)
              }
              <button type="button" className="close text-white" aria-label="Close" onClick={this.resetTemplateStatus}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className={`modal-body p-0 text-left${this.state.form.loader && " loader"}`}>
              <div className="row px-4">
                <div className="col pb-1 pt-4">
                  <p>{form.formHeading}</p>
                </div>
              </div>
              <form onSubmit={this.handleSubmit} className="h-100 px-4">
                {this.getFieldRenders()}
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

FormModalTemplate.propTypes = {
  clientType: PropTypes.string,
  data: PropTypes.object,
  meta: PropTypes.object,
  modal: PropTypes.object,
  newPublicContactConfiguration: PropTypes.object,
  saveBrandInitiated: PropTypes.func,
  showNotification: PropTypes.func,
  toggleModal: PropTypes.func,
  updateUserProfile: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    clientType: Cookies.get("client_type"),
    modal: state.modal,
    newPublicContactConfiguration: state.content && state.content.metadata && state.content.metadata.FORMSCONFIG && state.content.metadata.FORMSCONFIG.CONTACTINFO,
    userProfile: state.user.profile
  };
};

const mapDispatchToProps = {
  toggleModal,
  saveBrandInitiated,
  showNotification,
  updateUserProfile
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormModalTemplate);
