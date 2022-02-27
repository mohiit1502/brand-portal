/* eslint-disable complexity, max-statements, no-unused-expressions, react/jsx-handler-names */
import React from "react";
import {connect} from "react-redux";
import {saveBrandInitiated} from "../../../../actions/brand/brand-actions";
import PropTypes from "prop-types";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../actions/modal-actions";
import {dispatchClaims} from "../../../../actions/claim/claim-actions";
import Http from "../../../../utility/Http";
import {showNotification} from "../../../../actions/notification/notification-actions";
import ClientUtils from "../../../../utility/ClientUtils";
import Helper from "../../../../utility/helper";
import CONSTANTS from "../../../../constants/constants";
import mixpanel from "../../../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../../../constants/mixpanelConstants";
import ContentRenderer from "../../../../utility/ContentRenderer";
import "../../../../styles/custom-components/modal/templates/new-claim-template.scss";
import Validator from "../../../../utility/validationUtil";

class NewClaimTemplate extends React.Component {

  // eslint-disable-next-line max-statements
  constructor(props) {
      super(props);
      const functions = ["bubbleValue", "checkToEnableItemButton", "checkToEnableSubmit", "customChangeHandler", "disableSubmitButton", "enableSubmitButton", "fetchClaims", "getBrands", "getItemListFromChild", "handleSubmit", "loader", "onChange", "onItemUrlChange", "resetTemplateStatus", "selectHandlersLocal", "setSelectInputValue", "undertakingtoggle"];
      functions.forEach(name => {
        this[name] = this[name].bind(this);
      });
      this.getFieldRenders = ContentRenderer.getFieldRenders.bind(this);
      this.evaluateRenderDependency = ContentRenderer.evaluateRenderDependency.bind(this);
      this.trimSpaces = Helper.trimSpaces.bind(this);
      this.itemUrlDebounce = Helper.debounce(this.onItemUrlChange, CONSTANTS.APIDEBOUNCETIMEOUT);
      this.validateState = Validator.validateState.bind(this);
      this.validateUrl = Validator.validateUrl.bind(this);
      const newClaimConfiguration = this.props.newClaimConfiguration ? this.props.newClaimConfiguration : {};
      this.state = {
        section: {...newClaimConfiguration.sectionConfig},
        form: {
          inputData: newClaimConfiguration.fields,
          ...newClaimConfiguration.formConfig
        },
        brandNameSelected: newClaimConfiguration.formConfig && newClaimConfiguration.formConfig.brandNameSelected,
        loader: false
      };

  }

  componentDidMount() {
    this.getBrands();
  }

  loader (type, enable) {
    this.setState(state => {
      const stateClone = {...state};
      if (type === "fieldLoader") {
        stateClone.form.inputData.urlItems.fieldLoader = enable;
      } else {
        stateClone[type] = enable;
      }
      return stateClone;
    });
  }

  checkToDisplayForm(form){
    form.showCompleteForm = form.inputData.claimType.value !== "" && form.inputData.brandName.value !== "";
    if(form.showCompleteForm && form.inputData.claimType.value === "Copyright"){
      form.showUnderTaking3 = true;
    }
  }

  customChangeHandler (value) {
    const form = this.state.form;
    const claimTypeIdentifier = form.inputData.claimTypeIdentifier;
    const claimTypesWithMeta = form.claimTypesWithMeta;
    const undertaking1 = form.inputData.user_undertaking_1;
    const matchedClaimTypeWithMeta = claimTypesWithMeta.find(claimTypeWithMeta => claimTypeWithMeta.label === value);
    if (matchedClaimTypeWithMeta) {
      claimTypeIdentifier.label = matchedClaimTypeWithMeta.claimTypeIdentifierLabel;
      undertaking1.label = undertaking1.originalLabel.replace("__claimType__",matchedClaimTypeWithMeta.underTakingOwnerLabel);
      this.checkToDisplayForm(form);
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
        if (index > -1) {
          state.form.inputData.urlItems.itemList[index][key].value = value;
          state.form.inputData.urlItems.itemList[index][key].error = "";
          state.form.inputData.urlItems.itemList[index].url.error = "";
        } else {
          state.form.inputData[key].value = value;
          state.form.inputData[key].error = "";
        }
        this.checkToDisplayForm(state.form)
        return {
          ...state
        };
      }, () => this.checkToEnableItemButton());
    }
  }

  selectHandlersLocal (key, state, value) {
    if (key === "brandName" || key === "claimType") {
      let claimType;
      let brandName;
      if (key === "brandName") {
        claimType = state.form.inputData.claimType.value;
        brandName = value;
        state.brandNameSelected = true;
      } else if (key === "claimType") {
        state.form.showUnderTaking3 = false;
        state.form.inputData.claimTypeIdentifier.required = true;
        brandName = state.form.inputData.brandName.value;
        claimType = value;
      }
      if (claimType === "Trademark" || claimType === "Counterfeit") {
        const brandObj = state.brands.find(brand => brand.brandName === brandName);
        const trademarkNumber = brandObj && brandObj.trademarkNumber ? brandObj.trademarkNumber : "";
        state.form.inputData.claimTypeIdentifier.value = trademarkNumber;
        state.form.inputData.claimTypeIdentifier.disabled = true;
      } else {
        state.form.inputData.claimTypeIdentifier.value = "";
        state.form.inputData.claimTypeIdentifier.disabled = false;
        state.form.inputData.claimTypeIdentifier.required = false;
      }
    }
    return state;
  }

  onChange(evt, key) {
    if (evt && evt.target) {
      const targetVal = evt.target.value;
      let index = -1;
      if ((key.split("-")[0] === "url" || key.split("-")[0] === "sellerName") && key.split("-")[1]) {
        index = Number(key.split("-")[1]);
        key = key.split("-")[0];
      }

      this.setState(state => {
        state = {...state};
        if (index > -1) {
          state.form.inputData.urlItems.itemList[index].sellerName.value = "";
          state.form.inputData.urlItems.itemList[index].sellerName.disabled = true;
          state.form.inputData.urlItems.itemList[index][key].value = targetVal;
          state.form.inputData.urlItems.itemList[index][key].error = "";
         // state.disableAddItem = true;
         // state.currentItem = index;
        } else {
          state.form.inputData[key].value = targetVal;
          state.form.inputData[key].error = "";
        }
        return {
          ...state
        };
      }, () => this.checkToEnableItemButton());
      evt.persist();
      if (index > -1) {
        this.itemUrlDebounce(evt, index);
      }
    }
  }

  bubbleValue(evt, key, error) {
    const value = evt.target.value;
    let index = -1;
    if ((key.split("-")[0] === "url" || key.split("-")[0] === "sellerName") && key.split("-")[1]) {
      index = Number(key.split("-")[1]);
      key = key.split("-")[0];
    }
    this.setState(state => {
      state = {...state};
      if (index > -1) {
        state.form.inputData.urlItems.itemList[index][key].value = value;
        state.form.inputData.urlItems.itemList[index][key].error = error;
      } else {
        state.form.inputData[key].value = value;
        state.form.inputData[key].error = error;
      }
      return {
        ...state
      };
    },() => this.checkToEnableItemButton());
  }

  undertakingtoggle (evt) {
    const state = {...this.state};
    state.form.inputData[evt.target.id].selected = !state.form.inputData[evt.target.id].selected;
    state.form.inputData[evt.target.id].error = "";
    this.setState({
      ...state
    });
  }

  checkToEnableItemButton () {
    const state = {...this.state};
    let shouldDisable = false;
    state.form.inputData.urlItems.itemList.every(item => {
      if (!item.url.value || !item.sellerName.value || (item.sellerName.value.length !== undefined && item.sellerName.value.length === 0) || item.url.error || item.sellerName.error) {
        shouldDisable = true;
        return false;
      }
      return true;
    });
    state.form.inputData.urlItems.disableAddItem = shouldDisable;
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

  checkToEnableSubmit(callback) {
    const form = {...this.state.form};
    const userUndertaking = Object.keys(form.inputData)
      .filter(key => form.inputData[key].category === "userUnderTaking" ? true : false)
      .reduce((boolResult, undertaking) => {
        const shouldRender = this.evaluateRenderDependency(form.inputData[undertaking].renderCondition);
        return !!(boolResult && (!shouldRender || (shouldRender && form.inputData[undertaking].selected)));
      }, true);
    const bool = userUndertaking && form.inputData.claimType.value &&
      form.inputData.brandName.value &&
      (form.inputData.claimTypeIdentifier.required ? form.inputData.claimTypeIdentifier.value : true) &&
      form.inputData.urlItems.itemList.reduce((boolResult, item) => !!(boolResult && item.url.value && !item.url.error && item.sellerName.value && item.sellerName.value.length > 0 && !item.sellerName.error), true) &&
      form.inputData.comments.value && !form.inputData.comments.error &&
      form.inputData.signature.value;
    form.isSubmitDisabled = !bool;
    form.inputData.userActions.buttons.submit.disabled = !bool;
    this.setState({form}, callback && callback());
  }

  getBrands () {
    this.loader("loader", true);
    return Http.get("/api/brands?brandStatus=ACCEPTED", null, null, this.props.showNotification, null, "Request failed, please try again.")
      .then(res => {
        const state = {...this.state};
        state.brands = res.body.content;
        state.form.inputData.brandName.dropdownOptions = state.brands.map(v => ({id: v.brandId, value: v.brandName, usptoUrl: v.usptoUrl, usptoVerification: v.usptoVerification}));
        state.loader = false;
        this.setState(state);
        //this.loader("loader", false);
      }).catch(() => {
        this.loader("loader", false);
      });
  }

  resetTemplateStatus (evt) {
    const form = {...this.state.form};
    form.inputData.brandName.value = "";
    form.inputData.brandName.error = "";
    form.inputData.claimType.value = "";
    form.inputData.claimType.error = "";
    form.inputData.claimTypeIdentifier.value = "";
    form.inputData.claimTypeIdentifier.error = "";
    form.inputData.urlItems.itemList = form.inputData.urlItems.itemList.slice(0, 1);
    form.inputData.urlItems.itemList[0].url.value = "";
    form.inputData.urlItems.itemList[0].url.error = "";
    form.inputData.urlItems.itemList[0].sellerName.value = "";
    form.inputData.urlItems.itemList[0].sellerName.error = "";
    form.inputData.comments.value = "";
    form.inputData.comments.error = "";
    form.inputData.user_undertaking_1.selected = false;
    form.inputData.user_undertaking_1.error = false;
    form.inputData.user_undertaking_2.selected = false;
    form.inputData.user_undertaking_2.error = false;
    form.inputData.user_undertaking_3.selected = false;
    form.inputData.user_undertaking_3.error = false;
    form.inputData.user_undertaking_4.selected = false;
    form.inputData.user_undertaking_4.error = false;
    form.inputData.signature.value = "";
    form.inputData.signature.error = "";

    form.inputData.claimTypeIdentifier.disabled = true;
    form.inputData.urlItems.itemList[0].sellerName.disabled = true;

    form.inputData.urlItems.itemList[0].url.error = "";
    form.inputData.urlItems.itemList[0].sellerName.error = "";
    form.inputData.comments.error = "";
    form.inputData.urlItems.itemList[0].sellerName.dropdownOptions = [];

    this.setState({form});
    this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
    const mixpanelPayload = {WORK_FLOW: "ADD_NEW_CLAIM"};
    evt && mixpanel.trackEvent(MIXPANEL_CONSTANTS.NEW_CLAIM_TEMPLATE_EVENTS.CANCEL_SUBMIT_CLAIM, mixpanelPayload);
  }

  onItemUrlChange (event, i) {
    let url = event && event.target.value;
    if (url) {
      const form = {...this.state.form};
      if(!this.validateUrl(form.inputData.urlItems.itemList[i].url)){
        form.inputData.urlItems.itemList[i].sellerName.disabled = true;
        form.inputData.urlItems.itemList[i].sellerName.dropdownOptions = [];
        form.inputData.urlItems.itemList[i].url.error = form.inputData.urlItems.itemList[i].url.inValidUrlPatternError;
        this.setState({form},() => this.checkToEnableItemButton());
        return;
      }
      this.loader("fieldLoader", true);
      if (url.endsWith("/")) {
        url = url.substring(0, url.length - 1);
      }
      const slash = url.lastIndexOf("/");
      const qMark = url.lastIndexOf("?") === -1 ? url.length : url.lastIndexOf("?");

      const payload = url.substring(slash + 1, qMark);
      const query = {payload};
      const mixpanelPayload = {
        API: "/api/sellers",
        ITEM_URL: url,
        WORK_FLOW: "ADD_NEW_CLAIM"
      };
      Http.get("/api/sellers", query, null, this.props.showNotification, null, "Request failed, please try again.")
        .then(res => {
          this.loader("fieldLoader", false);
          const form = {...this.state.form};
          res.body = res.body.filter(seller => seller.value ? true : false);
          form.inputData.urlItems.itemList[i].sellerName.value = "";
          mixpanelPayload.API_SUCCESS = true;
          mixpanelPayload.SELLERS_NAMES = res.body.map(seller => {return seller.value;});
          if (res.body.length !== 0) {
            res.body.unshift({value: "All", id: "_all"});
            form.inputData.urlItems.itemList[i].sellerName.dropdownOptions = res.body;
            form.inputData.urlItems.itemList[i].sellerName.disabled = false;
            form.inputData.urlItems.itemList[i].url.error = "";
            //form.inputData.claimType.options = form.inputData.claimType.options.map(v => ({value: v.claimType}));
            this.setState({form}, this.checkToEnableItemButton);
          } else if (res.body.length === 0) {
            form.inputData.urlItems.itemList[i].sellerName.disabled = true;
            form.inputData.urlItems.itemList[i].url.error = "Please check the URL and try again!";
            this.setState({form}, this.checkToEnableItemButton);
          }
        })
        .catch(err => {
          this.loader("fieldLoader", false);
          const form = {...this.state.form};
          if (new RegExp(CONSTANTS.CODES.ERRORCODES.SERVERERROR).test(err.status.toString())) {      //IQS- error
            form.inputData.urlItems.itemList[i].url.error = "Unable to retrieve seller names for this item at this time, please enter the name of the sellers(s) related to your report (comma separated if multiple sellers)";
            form.inputData.urlItems.itemList[i].sellerName.disabled = false;
            form.inputData.urlItems.itemList[i].sellerName.dropdownOptions = [];
            form.isSubmitDisabled = true;
          } else {
            form.inputData.urlItems.itemList[i].url.error = "Unable to retrieve sellers for this URL at this time, please try again!";
            form.inputData.urlItems.itemList[i].sellerName.disabled = true;
         }
         this.setState({form}, this.checkToEnableItemButton);
         mixpanelPayload.API_SUCCESS = false;
         mixpanelPayload.ERROR = err.message ? err.message : err;
        })
        .finally(() => {
          mixpanel.trackEvent(MIXPANEL_CONSTANTS.NEW_CLAIM_TEMPLATE_EVENTS.GET_SELLERS_NAME, mixpanelPayload);
        });
    }else{
      const form = {...this.state.form};
      form.inputData.urlItems.itemList[i].sellerName.disabled = true;
      form.inputData.urlItems.itemList[i].sellerName.dropdownOptions = [];
      this.setState({form},() => this.checkToEnableItemButton());
    }
  }

  handleSubmit(evt) {
    evt.preventDefault();
    this.setState(state => {
      return state;
    }, () => {
      if (!this.validateState()) {
        this.disableSubmitButton();
        this.setState({
          formError: "",
          loader: true
        });
        mixpanel.trackEvent(MIXPANEL_CONSTANTS.NEW_CLAIM_TEMPLATE_EVENTS.SUBMIT_CLAIM_CLICKED, {WORK_FLOW: "ADD_NEW_CLAIM"});

        const inputData = this.state.form.inputData;
        const claimType = inputData.claimType.value;
        const registrationNumber = inputData.claimTypeIdentifier.value.trim();

        const brandName = inputData.brandName.value;
        const index = ClientUtils.where(inputData.brandName.dropdownOptions, {value: brandName});
        const brandId = inputData.brandName.dropdownOptions[index].id;
        const usptoUrl = inputData.brandName.dropdownOptions[index].usptoUrl;
        const usptoVerification = inputData.brandName.dropdownOptions[index].usptoVerification;
        const comments = inputData.comments.value;
        const digitalSignatureBy = inputData.signature.value.trim();
        const getItems = items => {
          const itemList = [];
          items.forEach(item => {
            const itemUrl = item.url.value.trim();
            if (item.sellerName.value && typeof item.sellerName.value === "object") {
              item.sellerName.value.forEach(sellerName => sellerName !== "All" && itemList.push({itemUrl, sellerName}));
            } else if (item.sellerName.value) {
              const sellerNames = item.sellerName.value.trim();
              itemList.push({ itemUrl, sellerName: sellerNames });
            }
          });
          return itemList;
        };
        const payload = {
          claimType,
          brandId,
          registrationNumber,
          comments,
          digitalSignatureBy,
          items: getItems(inputData.urlItems.itemList),
          usptoUrl,
          usptoVerification
        };
        const mixpanelPayload = {
          API: "/api/claims",
          BRAND_NAME: brandName,
          CLAIM_TYPE: claimType,
          WORK_FLOW: "ADD_NEW_CLAIM"
        };
        this.loader("loader", true);
        return Http.post("/api/claims", payload, null, null, this.props.showNotification, null, "Something went wrong, please try again..!")
          .then(res => {
            const meta = { templateName: "NewClaimAddedTemplate", data: {...res.body} };
            this.resetTemplateStatus();
            this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
            this.fetchClaims();
            this.loader("loader", false);
            mixpanelPayload.API_SUCCESS = true;
            this.mixpanelBatchEventUtil(MIXPANEL_CONSTANTS.NEW_CLAIM_TEMPLATE_EVENTS.SUBMITTED_CLAIM_DEATILS, payload);
          })
          .catch(err => {
            this.loader("loader", false);
            mixpanelPayload.API_SUCCESS = false;
            mixpanelPayload.ERROR = err.message ? err.message : err;
          })
          .finally(() => {
            this.enableSubmitButton();
            mixpanel.trackEvent(MIXPANEL_CONSTANTS.NEW_CLAIM_TEMPLATE_EVENTS.SUBMIT_NEW_CLAIM, mixpanelPayload);
          });
      } else {
        this.setState({
          formError: this.state.form.formError
        });
      }
    });
  }

  async fetchClaims () {
    this.loader("loader", true);
    const response = (await Http.get("/api/claims", () => this.loader("loader", false))).body;

    let claimList = [];

    if (response.data.content && response.data.content) {
      claimList = response.data.content.map((brand, i) => {
        const newClaim = { ...brand, sequence: i + 1 };
        newClaim.original = brand;
        const firstName = brand.firstName ? Helper.toCamelCaseIndividual(brand.firstName) : "";
        const lastName = brand.lastName ? Helper.toCamelCaseIndividual(brand.lastName) : "";
        newClaim.createdByName = `${firstName  } ${  lastName}`;
        return newClaim;
      });
    }

    this.props.dispatchClaims({claimList, fetchClaimsCompleted: true});
  }

  disableSubmitButton() {
    this.setState(state => { state = {...state}; state.form.isSubmitDisabled = true; return state; });
  }

  enableSubmitButton() {
    this.setState(state => { state = {...state}; state.form.isSubmitDisabled = false; return state; });
  }

  mixpanelBatchEventUtil(eventName, payload) {
    const items = payload.items;
    const mixpanelPayload = items && items.map(item => {
        const eventPayload = {};
        eventPayload.SELLER_NAME = item.sellerName;
        eventPayload.ITEM_URL = item.itemUrl;
        eventPayload.CLAIM_TYPE = payload.claimType;
        eventPayload.BRAND_ID = payload.brandId;
        eventPayload.USPTO_URL = payload.usptoUrl;
        eventPayload.USPTO_VERIFICATION = payload.usptoVerification;
        return eventPayload;
    });
    mixpanel.trackEventBatch(eventName, mixpanelPayload);
  }

  render() {
    const form = this.state.form;
    const section = this.state.section;
    return (
        <div className="modal new-claim-modal show" id="singletonModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
          <div className="modal-content">
            <div className="modal-header font-weight-bold align-items-center">
            {
                section.sectionTitleNew
            }
              <button type="button" className="close text-white" aria-label="Close" onClick={this.resetTemplateStatus} >
                <span className="close-btn" aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className={`modal-body text-left${this.state.loader && " loader"}`}>
              <form onSubmit={this.handleSubmit} className="h-100">
                  {this.getFieldRenders()}
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

NewClaimTemplate.propTypes = {
  dispatchClaims: PropTypes.func,
  modal: PropTypes.object,
  newClaimConfiguration: PropTypes.object,
  saveBrandInitiated: PropTypes.func,
  toggleModal: PropTypes.func,
  data: PropTypes.object,
  showNotification: PropTypes.func
};

const mapStateToProps = state => {
  return {
    modal: state.modal,
    newClaimConfiguration: state.content && state.content.metadata && state.content.metadata.SECTIONSCONFIG && state.content.metadata.SECTIONSCONFIG.NEWCLAIM
  };
};

const mapDispatchToProps = {
  dispatchClaims,
  toggleModal,
  saveBrandInitiated,
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewClaimTemplate);
