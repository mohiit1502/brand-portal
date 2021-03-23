import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
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
import MIXPANEL_CONSTANTS from "../../../../constants/MixPanelConsants";
class NewBrandTemplate extends React.Component {

  constructor(props) {
    super(props);
    const functions = ["bubbleValue", "onChange", "resetTemplateStatus", "handleSubmit", "prepopulateInputFields"];
    const debounceFunctions = {"brandDebounce": "checkBrandUniqueness", "trademarkDebounce": "checkTrademarkValidity"};
    functions.forEach(name => this[name] = this[name].bind(this));
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
          this.trademarkDebounce();
        }
        if (key === "brandName") {
          state.form.inputData[key].isUnique = false;
          state.form.inputData[key].error = "";
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
    evt.preventDefault();
    const trademarkNumber = this.state.form.inputData.trademarkNumber.value;
    const usptoUrl = this.state.form.inputData.trademarkNumber.usptoUrl;
    const usptoVerification = this.state.form.inputData.trademarkNumber.usptoVerification;
    const name = this.state.form.inputData.brandName.value;
    const comments = this.state.form.inputData.comments.value;
    const payload = { trademarkNumber, name, comments, usptoUrl, usptoVerification };
    const url = "/api/brands";

    if (this.state.form.isUpdateTemplate) {
      this.loader("form", true);
      return Http.put(`${url}/${this.props.data.brandId}`, {comments})
        .then(res => {
          this.resetTemplateStatus();
          this.props.showNotification(NOTIFICATION_TYPE.SUCCESS, `Changes to ${res.body.brandName} saved successfully`);
          this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
          this.props.saveBrandInitiated();
          this.loader("form", false);
        })
        .catch(err => {
          this.loader("form", false);
          console.log(err);
        });
    } else {
      this.loader("form", true);
      return Http.post(url, payload)
        .then(res => {
          this.resetTemplateStatus();
          this.props.showNotification(NOTIFICATION_TYPE.SUCCESS, `New brand ‘${res.body.request.name}’ added to your brand portfolio`);
          this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
          this.props.saveBrandInitiated();
          this.loader("form", false);
          mixpanel.trackEvent(MIXPANEL_CONSTANTS.NEW_BRANDS_TEMPLATE_EVENTS.SUBMIT_NEW_BRAND_SUCCESS);
        })
        .catch(err => {
          this.loader("form", false);
          console.log(err);
          mixpanel.trackEvent(MIXPANEL_CONSTANTS.NEW_BRANDS_TEMPLATE_EVENTS.SUBMIT_NEW_BRAND_FAILURE);
        });
    }
  }

  resetTemplateStatus () {
    const form = {...this.state.form};
    form.inputData.trademarkNumber.value = "";
    form.inputData.brandName.value = "";
    form.inputData.comments.value = "";

    form.inputData.trademarkNumber.error = "";
    form.inputData.brandName.error = "";
    form.inputData.comments.error = "";

    form.inputData.trademarkNumber.fieldOk = false;
    form.inputData.brandName.fieldOk = false;

    this.setState({form});
    this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
    mixpanel.trackEvent(MIXPANEL_CONSTANTS.NEW_BRANDS_TEMPLATE_EVENTS.RESET_BRAND_DETAILS);
  }

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
                {/*<div className="row mt-3">*/}
                {/*  <div className="col text-right">*/}
                {/*    <div className="btn btn-sm cancel-btn text-primary" type="button" onClick={this.resetTemplateStatus}>Cancel</div>*/}
                {/*    <button type="submit" className="btn btn-sm btn-primary submit-btn px-3 ml-3" disabled={form.isSubmitDisabled}>*/}
                {/*      Submit*/}
                {/*    </button>*/}
                {/*  </div>*/}
                {/*</div>*/}
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

NewBrandTemplate.propTypes = {
  data: PropTypes.object,
  modal: PropTypes.object,
  newBrandConfiguration: PropTypes.object,
  saveBrandInitiated: PropTypes.func,
  showNotification: PropTypes.func,
  toggleModal: PropTypes.func
};

const mapStateToProps = state => {
  return {
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
