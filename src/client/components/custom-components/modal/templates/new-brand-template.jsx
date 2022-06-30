/* eslint-disable max-statements, no-magic-numbers */
import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import Cookies from "electrode-cookies";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../actions/modal-actions";
import {NOTIFICATION_TYPE, showNotification} from "../../../../actions/notification/notification-actions";
import {saveBrandInitiated, dispatchBrands} from "../../../../actions/brand/brand-actions";
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
    const functions = ["bubbleValue", "onChange", "resetTemplateStatus", "handleSubmit", "prepopulateInputFields", "checkToEnableSubmit", "setSelectInputValue", "updateBrandNameAttributes"];
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
        inputData: JSON.parse(JSON.stringify(newBrandConfiguration.fields)),
        ...newBrandConfiguration.formConfig
      },
      isActive: false
    };
  }

  componentDidMount() {
    if (this.props.data && !this.state.form.templateUpdateComplete) {
      this.prepopulateInputFields(this.props.data);
    }
    if (this.props.brands) {
      this.setState(state => {
      state = {...state};
      const uniqueBrandList = [];
        this.props.brands.forEach(brand => {
          if (uniqueBrandList.findIndex(ubrand => ubrand.brandName === brand.brandName) === -1) {
            uniqueBrandList.push(brand);
          }
        })
        state.form.inputData.brandName.dropdownOptions = uniqueBrandList.map(v => ({id: v.caseId, value: v.brandName, usptoUrl: v.usptoUrl, usptoVerification: v.usptoVerification}));
        return state;
      })
    }
    this.props.dispatchBrands({brandListPopulated: true});
  }

  componentDidUpdate(prevProps) {
    if (this.props.brands && this.props.brands.length > 0 && !this.props.brandListPopulated) {
      this.setState(state => {
        state = {...state};
        const uniqueBrandList = [];
        this.props.brands.forEach(brand => {
          if (uniqueBrandList.findIndex(ubrand => ubrand.brandName === brand.brandName) === -1) {
            uniqueBrandList.push(brand);
          }
        })
        state.form.inputData.brandName.dropdownOptions = uniqueBrandList.map(v => ({id: v.brandId, value: v.brandName, usptoUrl: v.usptoUrl, usptoVerification: v.usptoVerification}));
        return state;
      })
      this.props.dispatchBrands({brandListPopulated: true});
    }
  }

  prepopulateInputFields (data) {
    const form = {...this.state.form};

    form.inputData.brandName = {...form.inputData.brandName};
    form.inputData.brandName.value = data.brandName;
    form.inputData.brandName.type = "text";
    form.inputData.brandName.onChange = this.onChange;
    form.inputData.brandName.disabled = true;

    // form.inputData.trademarkNumber.value = data.trademarkNumber;
    // form.inputData.trademarkNumber.disabled = true;

    form.inputData.comments.value = data.comments;

    form.templateUpdateComplete = true;
    form.isUpdateTemplate = true;
    this.setState({form});
  }

  updateBrandNameAttributes(type) {
    const brandName = this.state.form.inputData.brandName;
    if ((type === "text" && brandName.type === "select") || (type === "select" && brandName.type === "text")) {
      this.setState(state => {
        state = {...state};
        if (type === "text") {
          brandName.type = "text";
          brandName.onChange = this.onChange;
        } else if (type === "select") {
          brandName.type = "select";
          brandName.onChange = this.setSelectInputValue;
        }
        brandName.fieldOk = false;
        brandName.isUnique = false;
        brandName.disabled = false;
        brandName.value = "";
        brandName.error = "";
        return state;
      })
    }
  }

  onKeyPress(evt, key) {
    if (key === "trademarkNumber" && ((evt.which < 48 || evt.which > 57) && !CONSTANTS.ALLOWED_KEY_CODES.includes(evt.which))) {
      evt.preventDefault();
    }
  }

  bubbleValue(evt, key, error) {
    const value = evt.target.value;
    let index = -1;
    if ((key.split("-")[0] === "trademarkNumber" || key.split("-")[0] === "description") && key.split("-")[1]) {
      index = Number(key.split("-")[1]);
      key = key.split("-")[0];
    }
    this.setState(state => {
      state = {...state};
      if (index > -1) {
        const item = state.form.inputData.trademarkDetailsList.itemList.find(item => item.id === `item-${index}`);
        item.fieldSet[key].value = value;
        item.fieldSet[key].error = error;
      } else {
        state.form.inputData[key].value = value;
        state.form.inputData[key].error = error;
      }
      return {
        ...state
      };
    },() => this.checkToEnableAddItemButton(this.state.form.inputData.trademarkDetailsList.itemList, this.checkToEnableSubmit));
  }

  bubbleItemList (itemList) {
    this.setState(state => {
      state = {...state};
      state.form.inputData.trademarkDetailsList.itemList = [...itemList];
      return state;
    }, () => this.checkToEnableAddItemButton(this.state.form.inputData.trademarkDetailsList.itemList, this.checkToEnableSubmit));
  }

  onChange(evt, key, options) {
    if (evt && evt.target) {
      const targetVal = evt.target.value;
      let index = -1;
      if ((key.split("-")[0] === "trademarkNumber" || key.split("-")[0] === "description") && key.split("-")[1]) {
        index = Number(key.split("-")[1]);
        key = key.split("-")[0];
      }
      this.setState(state => {
        state = {...state};
        const item = state.form.inputData.trademarkDetailsList.itemList.find(item => item.id === `item-${index}`);
        if (key === "trademarkNumber") {
          item.fieldSet[key].isValid = false;
          item.fieldSet[key].fieldAlert = false;
          item.fieldSet[key].fieldOk = false;
          this.trademarkDebounce(index);
        }
        if (key === "description" || key === "trademarkNumber") {
          item.fieldSet[key].value = targetVal;
          item.fieldSet[key].error = "";
        }
        if (key === "brandName") {
          state.form.inputData[key].isUnique = false;
          state.form.inputData[key].error = "";
          state.form.inputData[key].value = targetVal;
          state.form.inputData[key].fieldOk = false;
          options && options.sourceType === "text" && this.brandDebounce({brandName: targetVal, wf: "BRAND_WORKFLOW"});
        }
        return state;
      }, () => {
        if (key === "trademarkNumber") {
          this.checkToEnableAddItemButton(this.state.form.inputData.trademarkDetailsList.itemList, this.checkToEnableSubmit);
        }
      });
    }
  }

  getItemListFromChild(itemList) {
    this.setState(state => {
      state = {...state};
      state.form.inputData.trademarkDetailsList.itemList = [...itemList];
      return {
        ...state
      };
    }, () => this.checkToEnableAddItemButton(this.state.form.inputData.trademarkDetailsList.itemList, this.checkToEnableSubmit));
  }

  checkToEnableSubmit(enableAddItemButton) {
    const form = {...this.state.form};
    const bool = enableAddItemButton && form.inputData.brandName.value &&
      (form.inputData.brandName.type === "text" && this.props.data.context !== "addTrademark" ? form.inputData.brandName.isUnique : true);
    form.inputData.brandCreateActions.buttons.submit.disabled = !bool;
    this.setState({form});
  }

  consolidateRows


  setSelectInputValue (value, key, subtitle, brandId) {
    if (value) {
      this.setState(state => {
        state = {...state};
        state.form.inputData[key].value = value;
        key === "brandName" && (state.form.inputData[key].brandId = brandId);
        return {
          ...state
        };
      }, this.checkToEnableSubmit);
    }
  }

  async handleSubmit(evt) {
    const isUpdateWorkflow = this.state.form && (this.state.form.isUpdateTemplate || this.state.form.inputData.brandName.type === "select")
    const mixpanelClickEventPayload = {
      IS_UPDATE_BRAND: isUpdateWorkflow,
      WORK_FLOW: isUpdateWorkflow ? "VIEW_BRAND_LIST" : "ADD_NEW_BRAND"
    };
    mixpanel.trackEvent(MIXPANEL_CONSTANTS.NEW_BRAND_TEMPLATE_EVENTS.SUBMIT_BRAND_CLICKED, mixpanelClickEventPayload);
    evt.preventDefault();
    // const trademarkNumber = this.state.form.inputData.trademarkNumber.value;
    // const usptoUrl = this.state.form.inputData.trademarkNumber.usptoUrl;
    // const usptoVerification = this.state.form.inputData.trademarkNumber.usptoVerification;
    // const trademarkClasses = this.state.form.inputData.trademarkNumber.trademarkClasses;
    const name = this.state.form.inputData.brandName.value;
    const comments = this.state.form.inputData.comments.value;
    const trademarkDetailsList = this.state.form.inputData.trademarkDetailsList.itemList.map(item => {
      const fieldSet = item.fieldSet;
      return {
        shortHandDescription: fieldSet.description.value,
        usptoUrl: fieldSet.trademarkNumber.usptoUrl,
        usptoVerification: fieldSet.trademarkNumber.usptoVerification,
        trademarkClasses: fieldSet.trademarkNumber.trademarkClasses,
        trademarkNumber: fieldSet.trademarkNumber.value
      }
    })
    const payload = {
      name,
      comments,
      trademarkDetailsList
    };
    if (isUpdateWorkflow) {
      payload.brandId = this.state.form.inputData.brandName.brandId || this.props.data.brandId;
    }
    const url = "/api/brands";
    const mixpanelPayload = {
      API: url,
      BRAND_NAME: name,
      IS_UPDATE_BRAND: isUpdateWorkflow,
      TRADEMARK_DETAILS_LIST: JSON.stringify(trademarkDetailsList),
      WORK_FLOW: isUpdateWorkflow ? "VIEW_BRAND_LIST" : "ADD_NEW_BRAND"
    };
    if (isUpdateWorkflow) {
      this.loader("form", true);
      // return Http.put(`${url}/${this.props.data ? this.props.data.brandId : this.state.form.inputData.brandName.brandId}`, payload)
      return Http.put(url, payload)
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
          this.props.showNotification(NOTIFICATION_TYPE.SUCCESS, `New brand ‘${res.body.name}’ added to your brand portfolio`);
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
    const state = {...this.state};
    const form = {...state.form};
    const inputData = {...form.inputData};
    this.updateBrandNameAttributes("select");

    inputData.comments.error = "";
    inputData.comments.value = "";

    inputData.brandCreateActions.buttons.submit.disabled = true;

    const fieldSet = JSON.parse(JSON.stringify(inputData.trademarkDetailsList.itemListTemplate));
    Object.values(fieldSet).forEach(field => {
      field.inputId = `${field.inputId}-0`;
      field.key = field.inputId;
      field.id = field.inputId;
    });
    inputData.trademarkDetailsList.itemList = [{id: "item-0", fieldSet}];

    this.setState(state, () => this.props.toggleModal(TOGGLE_ACTIONS.HIDE));
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
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header align-items-center">
              {
                this.props.data && this.props.data.context === "addTrademark" ? section.sectionTitleTrademark : section.sectionTitleBrand
              }
              <button type="button" className="close text-white" aria-label="Close" onClick={this.resetTemplateStatus}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className={`modal-body p-0 text-left${this.state.form.loader && " loader"}`}>
              <div className="row">
                <div className="col px-4 mx-3 pb-1 pt-4">
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
  brandListPopulated: PropTypes.string,
  brands: PropTypes.array,
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
    brandListPopulated: state.brandEdit.brandListPopulated,
    brands: state.brandEdit.brandList,
    clientType: Cookies.get("bp_client_type"),
    newBrandConfiguration: state.content && state.content.metadata && state.content.metadata.FORMSCONFIG && state.content.metadata.FORMSCONFIG.NEWBRAND,
    modal: state.modal
  };
};

const mapDispatchToProps = {
  dispatchBrands,
  toggleModal,
  saveBrandInitiated,
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewBrandTemplate);
