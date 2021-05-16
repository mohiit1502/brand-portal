/* eslint-disable max-statements */
/* eslint-disable filenames/match-regex */
import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import ContentRenderer from "../../utility/ContentRenderer";
import "./WebForm.component.scss";
import Helper from "../../utility/helper";
import Validator from "../../utility/validationUtil";
import CONSTANTS from "../../constants/constants";
import InputFormatter from "../../utility/phoneOps";


class WebForm extends React.Component {
  constructor(props) {
    super(props);
    const functions = ["onChange", "setSelectInputValue", "undertakingtoggle", "getClaimTypes", "selectHandlersLocal", "checkToEnableSubmit", "customChangeHandler", "getItemListFromChild", "bubbleValue", "handleSubmit"];
    functions.forEach(name => this[name] = this[name].bind(this));

    const debounceFunctions = {emailDebounce: "onEmailChange"};
    Object.keys(debounceFunctions).forEach(name => {
      const functionToDebounce = Validator[debounceFunctions[name]] ? Validator[debounceFunctions[name]].bind(this) : this[debounceFunctions[name]];
      this[name] = Helper.debounce(functionToDebounce, CONSTANTS.APIDEBOUNCETIMEOUT);
    });
    this.onInvalid = Validator.onInvalid.bind(this);
    this.invalid = {emailId: false, phone: false};
    const webformConfiguration = this.props.webformConfiguration ? this.props.webformConfiguration : {};
    this.getFieldRenders = ContentRenderer.getFieldRenders.bind(this);
    this.itemUrlDebounce = Helper.debounce(this.onItemUrlChange, CONSTANTS.APIDEBOUNCETIMEOUT);
    this.state = {
      section: {...webformConfiguration.sectionConfig},
      form: {
        ...webformConfiguration.formConfig,
        inputData: {...webformConfiguration.fields}
      }
    };
    const formatter = new InputFormatter();
    const handlers = formatter.on(`#${this.state.section.id}-${this.state.form.inputData.phone.inputId}-custom-input`);
    this.prebounceChangeHandler = handlers.inputHandler;
  }

  componentDidMount() {
    this.getClaimTypes();
  }

  getClaimTypes () {
    const state = {...this.state};
    const form = state.form;
    const options = [
      {claimType: "trademark", label: "Trademark", claimTypeIdentifierLabel: "Trademark Number", companyNameIdentifierLabel: "Trademark Company Name", ownerNameIdentifierLabel: "Trademark Owner Name"},
      {claimType: "patent", label: "Patent", claimTypeIdentifierLabel: "Patent Number", companyNameIdentifierLabel: "Patent Company Name", ownerNameIdentifierLabel: "Patent Owner Name"},
      {claimType: "counterfeit", label: "Counterfeit", claimTypeIdentifierLabel: "Trademark Number", companyNameIdentifierLabel: "Rights Owner Company Name", ownerNameIdentifierLabel: "Rights Owner Name"},
      {claimType: "copyright", label: "Copyright", claimTypeIdentifierLabel: "Copyright Number", companyNameIdentifierLabel: "Copyright Company Name", ownerNameIdentifierLabel: "Copyright Owner Name"}
    ];
        form.inputData.claimType.claimTypesWithMeta = options;
        form.inputData.claimType.dropdownOptions = options && options.map(v => ({value: v.label}));
        this.setState(state);
  }

  getItemListFromChild(itemList) {
    this.setState(state => {
      state = {...state};
      state.form.inputData.urlItems.itemList = [...itemList];
      return {
        ...state
      };
    });
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
      const targetVal = evt.target.value;
      let index = -1;
      if (key.split("-")[0] === "url" || key.split("-")[0] === "sellerName" && key.split("-")[1]) {
        index = Number(key.split("-")[1]);
        key = key.split("-")[0];
      }

      this.setState(state => {
        state = {...state};
        if (index > -1) {
          if (key.split("-")[0] === "url") {
            state.form.inputData.urlItems.itemList[index].sellerName.value = "";
            state.form.inputData.urlItems.itemList[index].sellerName.disabled = false;
            state.form.inputData.urlItems.itemList[index][key].value = targetVal;
            state.form.inputData.urlItems.disableAddItem = true;
          } else  {
            state.form.inputData.urlItems.itemList[index][key].value = targetVal;
            state.form.inputData.urlItems.itemList[index][key].error = "";
            state.form.inputData.urlItems.itemList[index].url.error = "";
            state.form.inputData.urlItems.disableAddItem = false;
          }
        } else {
          state.form.inputData[key].error = !this.invalid[key] ? "" : state.form.inputData[key].error;
          state.form.inputData[key].value = targetVal;
          this.invalid[key] = false;
        }
        return {
          ...state
        };
      }, this.checkToEnableSubmit);
      evt.persist();
      if (key === "url") {
        this.itemUrlDebounce(evt, index);
      }
    }
  }
  onItemUrlChange (event, i) {
    let url = event && event.target.value;
    if (url) {
      this.loader("fieldLoader", true);
      if (url.endsWith("/")) {
        url = url.substring(0, url.length - 1);
      }
    }
  }
  selectHandlersLocal (key, state, value) {
    return state;
  }

  customChangeHandler (value) {
    const form = this.state.form;
    const claimTypesWithMeta = form.inputData.claimType.claimTypesWithMeta;
    const matchedClaimTypeWithMeta = claimTypesWithMeta.find(claimTypeWithMeta => claimTypeWithMeta.label === value);
    if (matchedClaimTypeWithMeta) {
      form.inputData.companyName.label = matchedClaimTypeWithMeta.companyNameIdentifierLabel;
      form.inputData.ownerName.label = matchedClaimTypeWithMeta.ownerNameIdentifierLabel;
      form.claimTypeSelected = true;
      this.setState({form});
    }
  }

  setSelectInputValue (value, key) {
    if (value) {
      let index = -1;
      if (key.split("-")[0] === "sellerName" && key.split("-")[1]) {
        index = Number(key.split("-")[1]);
        key = key.split("-")[0];
      }
      this.setState(state => {
        state = {...state};
        state = this.selectHandlersLocal(key, state, value);
        state.form.inputData[key].value = value;
        return {
          ...state
        };
      }, () => this.checkToEnableSubmit());
    }
  }

  // eslint-disable-next-line complexity
  checkToEnableSubmit(callback) {
    const form = {...this.state.form};
    const userUndetaking = form.inputData.user_undertaking_1.selected && form.inputData.user_undertaking_2.selected && form.inputData.user_undertaking_3.selected && form.inputData.user_undertaking_4.selected;
    const isValidItemList = form.inputData.urlItems.itemList.reduce((boolResult, item) => !!(boolResult && item.url.value && !item.url.error && item.sellerName.value && item.sellerName.value.length > 0 && !item.sellerName.error), true);
    const bool = isValidItemList && userUndetaking  && form.inputData.claimType.value &&
      form.inputData.firstName.value && form.inputData.lastName.value &&
      form.inputData.ownerName.value && form.inputData.companyName.value &&
      form.inputData.brandName.value &&
      form.inputData.address_1.value && form.inputData.address_2.value &&
      form.inputData.city.value && form.inputData.country.value &&
      form.inputData.state.value && form.inputData.zip.value && !form.inputData.zip.error &&
      form.inputData.phone.value && !form.inputData.phone.error &&  form.inputData.emailId.value && !form.inputData.emailId.error &&
      form.inputData.comments.value && !form.inputData.comments.error &&
      form.inputData.digitalSignature.value;

    form.isSubmitDisabled = !bool;
    form.inputData.webFormActions.buttons.submit.disabled = !bool;
    this.setState({form}, callback && callback());
  }

  undertakingtoggle (evt, undertaking, index) {
    const state = {...this.state};
    state.form.inputData[evt.target.id].selected = !state.form.inputData[evt.target.id].selected;
    this.setState({
      ...state
    }, this.checkToEnableSubmit);
  }

  handleSubmit() {

  }

  render() {
    return (
      <div className="c-WebForm">
        <div className="row h3 header pl-5">
          Walmart IP Services
        </div>
        <div className="row justify-content-center">
        <div className="col-lg-7 col-md-6 col-6 pl-3 pr-3">
          <div className="row title-row mb-4 pl-2">
              <div className="web-form-title">
                {this.state.section.sectionTitle}
              </div>
          </div>
          <form onSubmit={this.handleSubmit} className="web-form mb-4 ml-3 mr-3" >
            { this.getFieldRenders()}
          </form>
        </div>
      </div>
      </div>
    );
  }

}

WebForm.propTypes = {

};

const mapStateToProps = state => {
  return {
    webformConfiguration: state.content && state.content.metadata && state.content.metadata.SECTIONSCONFIG && state.content.metadata.SECTIONSCONFIG.WEBFORM
  };
};


export default connect(mapStateToProps)(WebForm);
