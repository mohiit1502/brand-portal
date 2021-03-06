/* eslint-disable max-statements, no-magic-numbers */
import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import Cookies from "electrode-cookies";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../actions/modal-actions";
import {NOTIFICATION_TYPE, showNotification} from "../../../../actions/notification/notification-actions";
import {saveBrandInitiated} from "../../../../actions/brand/brand-actions";
import Http from "../../../../utility/Http";
import Helper from "../../../../utility/helper";
import Validator from "../../../../utility/validationUtil";
import ContentRenderer from "../../../../utility/ContentRenderer";
import CONSTANTS from "../../../../constants/constants";
import "../../../../styles/custom-components/modal/templates/new-brand-template.scss";
import mixpanel from "../../../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../../../constants/mixpanelConstants";

class NewBrandTemplate extends React.Component {

  constructor(props) {
    super(props);
    const functions = ["bubbleValue", "onChange", "resetTemplateStatus", "handleSubmit", "prepopulateInputFields"];
    const debounceFunctions = {brandDebounce: "checkBrandUniqueness", trademarkDebounce: "checkTrademarkValidity"};
    functions.forEach(name => {
      this[name] = this[name].bind(this);
    });
    Object.keys(debounceFunctions).forEach(name => {
      const functionToDebounce = Validator[debounceFunctions[name]] ? Validator[debounceFunctions[name]].bind(this) : this[debounceFunctions[name]];
      this[name] = Helper.debounce(functionToDebounce, CONSTANTS.APIDEBOUNCETIMEOUT);
    });
    this.getFieldRenders = ContentRenderer.getFieldRenders.bind(this);
    this.loader = Helper.loader.bind(this);
    const newBrandConfiguration = this.props.newBrandConfiguration ? this.props.newBrandConfiguration : {};
    this.state = {
      section: {...newBrandConfiguration.sectionConfig},
      form: {
        inputData: newBrandConfiguration.fields,
        ...newBrandConfiguration.formConfig
      }
    };
  }

  componentDidMount() {
    if (this.props.data && !this.state.form.templateUpdateComplete) {
      this.prepopulateInputFields(this.props.data);
    }
  }

  prepopulateInputFields (data) {
    const form = {...this.state.form};

    form.inputData.brandName.value = data.brandName;
    form.inputData.brandName.disabled = true;

    form.inputData.trademarkNumber.value = data.trademarkNumber;
    form.inputData.trademarkNumber.disabled = true;

    form.inputData.comments.value = data.comments;

    form.templateUpdateComplete = true;
    form.isUpdateTemplate = true;
    this.setState({form});
  }

  onKeyPress(evt, key) {
    if (key === "trademarkNumber" && ((evt.which < 48 || evt.which > 57) && !CONSTANTS.ALLOWED_KEY_CODES.includes(evt.which))) {
      evt.preventDefault();
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

  onChange(evt, key) {
    if (evt && evt.target) {
      const targetVal = evt.target.value;
      this.setState(state => {
        if (key === "trademarkNumber") {
          state.form.inputData[key].isValid = false;
          state.form.inputData[key].error = "";
          state.form.inputData[key].fieldAlert = false;
          state.form.inputData[key].fieldOk = false;
          this.trademarkDebounce();
        }
        if (key === "brandName") {
          state.form.inputData[key].isUnique = false;
          state.form.inputData[key].error = "";
          state.form.inputData[key].fieldOk = false;
          this.brandDebounce({brandName: targetVal, wf: "BRAND_WORKFLOW"});
        }
        state = {...state};
        state.form.inputData[key].value = targetVal;
        return state;
      }, this.checkToEnableSubmit);
    }
  }

  checkToEnableSubmit() {
    const form = {...this.state.form};
    const bool = form.isUpdateTemplate || (form.inputData.trademarkNumber.isValid  &&
      form.inputData.trademarkNumber.value && form.inputData.brandName.value &&
      form.inputData.brandName.isUnique);
    form.inputData.brandCreateActions.buttons.submit.disabled = !bool;
    this.setState({form});
  }

  async handleSubmit(evt) {
    const mixpanelClickEventPayload = {
      IS_UPDATE_BRAND: this.state.form && this.state.form.isUpdateTemplate,
      WORK_FLOW: this.state.form && this.state.form.isUpdateTemplate ? "VIEW_BRAND_LIST" : "ADD_NEW_BRAND"
    };
    mixpanel.trackEvent(MIXPANEL_CONSTANTS.NEW_BRAND_TEMPLATE_EVENTS.SUBMIT_BRAND_CLICKED, mixpanelClickEventPayload);
    evt.preventDefault();
    const trademarkNumber = this.state.form.inputData.trademarkNumber.value;
    const usptoUrl = this.state.form.inputData.trademarkNumber.usptoUrl;
    const usptoVerification = this.state.form.inputData.trademarkNumber.usptoVerification;
    const name = this.state.form.inputData.brandName.value;
    const comments = this.state.form.inputData.comments.value;
    const payload = { trademarkNumber, name, comments, usptoUrl, usptoVerification };
    const url = "/api/brands";
    const mixpanelPayload = {
      API: url,
      BRAND_NAME: name,
      IS_UPDATE_BRAND: this.state.form && this.state.form.isUpdateTemplate,
      TRADEMARK_NUMBER: trademarkNumber,
      WORK_FLOW: this.state.form && this.state.form.isUpdateTemplate ? "VIEW_BRAND_LIST" : "ADD_NEW_BRAND"
    };
    if (this.state.form.isUpdateTemplate) {
      this.loader("form", true);
      return Http.put(`${url}/${this.props.data.brandId}`, {comments})
        .then(res => {
          this.resetTemplateStatus();
          this.props.showNotification(NOTIFICATION_TYPE.SUCCESS, `Changes to ${res.body.brandName} saved successfully`);
          this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
          this.props.saveBrandInitiated();
          this.loader("form", false);
          mixpanelPayload.API_SUCCESS = true;
        })
        .catch(err => {
          this.loader("form", false);
          mixpanelPayload.API_SUCCESS = false;
          mixpanelPayload.ERROR = err.message ? err.message : err;
        })
        .finally(() => {
          mixpanel.trackEvent(MIXPANEL_CONSTANTS.NEW_BRAND_TEMPLATE_EVENTS.BRAND_DETAILS_SUBMISSION, mixpanelPayload);
        });
    } else {
      this.loader("form", true);
      return Http.post(url, payload)
        .then(res => {
          this.resetTemplateStatus();
          this.props.showNotification(NOTIFICATION_TYPE.SUCCESS, `New brand ???${res.body.request.name}??? added to your brand portfolio`);
          this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
          this.props.saveBrandInitiated();
          this.loader("form", false);
          mixpanelPayload.API_SUCCESS = true;
        })
        .catch(err => {
          this.loader("form", false);
          mixpanelPayload.API_SUCCESS = false;
          mixpanelPayload.ERROR = err.message ? err.message : err;
        })
        .finally(() => {
          mixpanel.trackEvent(MIXPANEL_CONSTANTS.NEW_BRAND_TEMPLATE_EVENTS.BRAND_DETAILS_SUBMISSION, mixpanelPayload);
        });
    }
  }

  resetTemplateStatus (e) {
    const form = {...this.state.form};
    form.inputData.trademarkNumber.value = "";
    form.inputData.brandName.value = "";
    form.inputData.comments.value = "";

    form.inputData.trademarkNumber.error = "";
    form.inputData.brandName.error = "";
    form.inputData.comments.error = "";

    form.inputData.trademarkNumber.fieldOk = false;
    form.inputData.trademarkNumber.fieldAlert = false;
    form.inputData.brandName.fieldOk = false;

    form.inputData.trademarkNumber.isValid = false;
    form.inputData.brandName.isUnique = false;

    form.inputData.trademarkNumber.disabled = false;
    form.inputData.brandName.disabled = false;
    form.inputData.brandCreateActions.buttons.submit.disabled = true;

    this.setState({form});
    this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
    if (e) {
      const mixpanelPayload = {
        WORK_FLOW: this.state.form.isUpdateTemplate ? "VIEW_BRAND_LIST" : "ADD_NEW_BRAND"
      };
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.NEW_BRAND_TEMPLATE_EVENTS.CANCEL_SUBMIT_BRAND_DETAILS, mixpanelPayload);
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
                form.isUpdateTemplate ? section.sectionTitleEdit : section.sectionTitleNew
              }
              <button type="button" className="close text-white" aria-label="Close" onClick={this.resetTemplateStatus}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className={`modal-body p-0 text-left${this.state.form.loader && " loader"}`}>
              <div className="row">
                <div className="col px-4 mx-2 pb-1 pt-4">
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

NewBrandTemplate.propTypes = {
  clientType: PropTypes.string,
  data: PropTypes.object,
  modal: PropTypes.object,
  newBrandConfiguration: PropTypes.object,
  saveBrandInitiated: PropTypes.func,
  showNotification: PropTypes.func,
  toggleModal: PropTypes.func
};

const mapStateToProps = state => {
  return {
    clientType: Cookies.get("client_type"),
    newBrandConfiguration: state.content && state.content.metadata && state.content.metadata.SECTIONSCONFIG && state.content.metadata.SECTIONSCONFIG.NEWBRAND,
    modal: state.modal
  };
};

const mapDispatchToProps = {
  toggleModal,
  saveBrandInitiated,
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewBrandTemplate);
