/* eslint-disable react/jsx-handler-names */
import React from "react";
import {connect} from "react-redux";
import PlusIcon from "../../../../images/plus.svg";
import {saveBrandInitiated} from "../../../../actions/brand/brand-actions";
import PropTypes from "prop-types";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../actions/modal-actions";
import {dispatchClaims} from "../../../../actions/claim/claim-actions";
import CustomInput from "../../custom-input/custom-input";
import Http from "../../../../utility/Http";
import {showNotification} from "../../../../actions/notification/notification-actions";
import ClientUtils from "../../../../utility/ClientUtils";
import Helper from "../../../../utility/helper";
import CONSTANTS from "../../../../constants/constants";
import "../../../../styles/custom-components/modal/templates/new-claim-template.scss";

class NewClaimTemplate extends React.Component {

  // eslint-disable-next-line max-statements
  constructor(props) {
    super(props);
    this.checkToEnableItemButton = this.checkToEnableItemButton.bind(this);
    // this.enableButtonChecks = this.enableButtonChecks.bind(this);
    this.onChange = this.onChange.bind(this);
    this.undertakingtoggle = this.undertakingtoggle.bind(this);
    this.resetTemplateStatus = this.resetTemplateStatus.bind(this);
    this.fetchClaims = this.fetchClaims.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getClaimTypes = this.getClaimTypes.bind(this);
    this.getBrands = this.getBrands.bind(this);
    this.addToItemList = this.addToItemList.bind(this);
    this.removeFromItemList = this.removeFromItemList.bind(this);
    this.setSelectInputValue = this.setSelectInputValue.bind(this);
    this.onItemUrlChange = this.onItemUrlChange.bind(this);
    this.itemUrlDebounce = Helper.debounce(this.onItemUrlChange, CONSTANTS.APIDEBOUNCETIMEOUT);
    this.claimsMap = {};

    this.state = {
      form: {
        isSubmitDisabled: true,
        isUpdateTemplate: false,
        templateUpdateComplete: false,
        isDisabled: false,
        underwritingChecked: false,
        id: "new-claim-form",
        inputData: {
          claimType: {
            label: "Claim Type",
            required: true,
            value: "",
            type: "select",
            pattern: null,
            disabled: false,
            options: [],
            subtitle: "",
            error: ""
          },
          brandName: {
            label: "Brand Name",
            required: true,
            value: "",
            type: "select",
            pattern: null,
            disabled: false,
            options: [],
            subtitle: "If you do not see a brand in this list, please have the administrator of the account register a new brand.",
            error: ""
          },
          claimTypeIdentifier: {
            label: "Claim Type Identifier",
            required: true,
            value: "",
            type: "text",
            pattern: null,
            disabled: false,
            isValid: false,
            subtitle: "",
            error: ""
          },
          itemList: [

          ],
          comments: {
            label: "Comments",
            required: false,
            value: "",
            type: "textarea",
            pattern: null,
            disabled: false,
            subtitle: "",
            error: ""
          },
          signature: {
            value: "",
            required: true
          }
        },
        undertakingList: [
          {
            selected: false,
            label: "I have a good faith belief that the use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law."
          },
          {
            selected: false,
            label: "This notification is accurate; and UNDER PENALTY OF PERJURY, I am authorized to act on behalf of the owner of an exclusive right that is allegedly infringed."
          },
          {
            selected: false,
            label: "I acknowledge that under Section 512(f) of the DMCA any person who knowingly materially misrepresents that material or activity is infringing may be subject to liability for damages."
          },
          {
            selected: false,
            label: "I understand that abuse of this tool will result in termination of my Walmart account."
          }
        ]
      },
      brands: [],
      itemUrlId: 0,
      claimTypeSelected: false,
      disableAddItem: true,
      currentItem: 0,
      loader: false,
      fieldLoader: false
    };
  }

  loader (type, enable) {
    this.setState(state => {
      const stateClone = {...state};
      stateClone[type] = enable;
      return stateClone;
    });
  }

  componentDidMount() {
    this.getClaimTypes();
    this.getBrands();
    this.addToItemList();
  }

  componentDidUpdate() {

  }

  addToItemList () {
    const item = {
      id: `item-${this.state.itemUrlId}`,
      url: {
        label: "Item URL",
        required: true,
        value: "",
        type: "url",
        pattern: "https?://.+",
        disabled: false,
        isValid: false,
        subtitle: "",
        error: ""
      },
      sellerName: {
        label: "Seller Name",
        required: true,
        value: "",
        type: "multiselect",
        // type: "select",
        pattern: null,
        disabled: true,
        options: [],
        subtitle: "",
        error: ""
      }
    };
    const state = {...this.state};
    state.itemUrlId++;
    // state.form.inputData.itemList.unshift(item);
    state.form.inputData.itemList.push(item);
    this.setState(state, () => this.checkToEnableSubmit(this.checkToEnableItemButton));
  }

  removeFromItemList (evt, index) {
    const form = {...this.state.form};
    form.inputData.itemList.splice(index, 1);
    this.setState({form}, () => this.checkToEnableSubmit(this.checkToEnableItemButton));
  }

  checkToEnableItemButton () {
    const state = {...this.state};
    let shouldDisable = false;
    state.form.inputData.itemList.every(item => {
      if (!item.url.value || !item.sellerName.value || (item.sellerName.value.length !== undefined && item.sellerName.value.length === 0) || item.url.error || item.sellerName.error) {
        shouldDisable = true;
        return false;
      }
      return true;
    });
    state.disableAddItem = shouldDisable;
    this.setState(state);
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
          state.form.inputData.itemList[index][key].value = value;
        } else {
          state.form.inputData[key].value = value;
        }

        return {
          ...state
        };
      }, () => this.checkToEnableSubmit(this.checkToEnableItemButton));
    }
  }

  // enableButtonChecks() {
  //   this.checkToEnableSubmit();
  //   // this.checkToEnableItemButton();
  // }

  // eslint-disable-next-line max-statements
  selectHandlersLocal (key, state, value) {
    if (key === "brandName" || key === "claimType") {
      let claimType;
      let brandName;
      if (key === "brandName") {
        claimType = state.form.inputData.claimType.value;
        brandName = value;
      } else if (key === "claimType") {
        state.form.inputData.claimTypeIdentifier.required = true;
        state.claimTypeSelected = true;
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
      }

      if (claimType === "Copyright") {
        state.form.inputData.claimTypeIdentifier.required = false;
      }
    }
    return state;
  }

  customChangeHandler (value) {
    const form = this.state.form;
    const claimTypeIdentifier = form.inputData.claimTypeIdentifier;
    const claimTypesWithMeta = form.claimTypesWithMeta;
    const matchedClaimTypeWithMeta = claimTypesWithMeta.find(claimTypeWithMeta => claimTypeWithMeta.label === value);
    if (matchedClaimTypeWithMeta) {
      claimTypeIdentifier.label = matchedClaimTypeWithMeta.claimTypeIdentifierLabel;
      this.setState({form});
    }
  }

  getClaimTypes () {
    this.loader("loader", true);
    return Http.get("/api/claims/types")
      .then(res => {
        const state = {...this.state};
        const form = {...state.form};
        state.form = form;
        let options = [...res.body.data];
        options = options.map(option => {
          const displayVal = Helper.toCamelCaseIndividual(option.claimType);
          option.label = displayVal;
          option.claimTypeIdentifierLabel = displayVal === "Counterfeit" ? "Trademark Number" : `${displayVal} Number`;
          return option;
        });
        form.inputData.claimType.options = options && options.map(v => ({value: v.label}));
        form.claimTypesWithMeta = options;
        state.loader = false;
        this.setState(state);
      });
  }

  getBrands () {
    this.loader("loader", true);
    return Http.get("/api/brands?brandStatus=ACCEPTED")
      .then(res => {
        const state = {...this.state};
        state.brands = res.body.content;
        state.form.inputData.brandName.options = state.brands.map(v => ({id: v.brandId, value: v.brandName}));
        state.loader = false;
        this.setState(state);
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
        newClaim.createdByName = firstName + " " + lastName;
        return newClaim;
      });
    }

    this.props.dispatchClaims({claimList});
  }

  onChange(evt, key) {
    if (evt && evt.target) {
      const targetVal = evt.target.value;
      let index = -1;
      if (key.split("-")[0] === "url" && key.split("-")[1]) {
        index = Number(key.split("-")[1]);
        key = key.split("-")[0];
      }

      this.setState(state => {
        state = {...state};
        if (index > -1) {
          state.form.inputData.itemList[index].sellerName.disabled = true;
          state.form.inputData.itemList[index][key].value = targetVal;
          state.disableAddItem = true;
          state.currentItem = index;
        } else {
          state.form.inputData[key].value = targetVal;
        }
        return {
          ...state
        };
      }, this.checkToEnableSubmit);
      evt.persist();
      if (index > -1) {
        this.itemUrlDebounce(evt, index);
      }
    }
  }

  checkToEnableSubmit(callback) {
    const form = {...this.state.form};

    const bool = form.inputData.claimType.value &&
      form.inputData.brandName.value &&
      (form.inputData.claimTypeIdentifier.required ? form.inputData.claimTypeIdentifier.value : true) &&
      form.inputData.itemList.reduce((boolResult, item) => !!(boolResult && item.url.value && item.sellerName.value), true) &&
      form.undertakingList.reduce((boolResult, undertaking) => !!(boolResult && undertaking.selected), true) &&
      form.inputData.signature.value;

    form.isSubmitDisabled = !bool;
    this.setState({form}, callback && callback());
  }

  undertakingtoggle (evt, undertaking, index) {
    const state = {...this.state};
    state.form.undertakingList[index].selected = !state.form.undertakingList[index].selected;
    this.setState({
      ...state
    }, this.checkToEnableSubmit);
  }

  async handleSubmit(evt) {
    evt.preventDefault();

    const inputData = this.state.form.inputData;

    const claimType = inputData.claimType.value;
    const registrationNumber = inputData.claimTypeIdentifier.value;

    const brandName = inputData.brandName.value;
    const index = ClientUtils.where(inputData.brandName.options, {value: brandName});
    const brandId = inputData.brandName.options[index].id;

    const comments = inputData.comments.value;
    const digitalSignatureBy = inputData.signature.value;

    const getItems = items => {
      const itemList = [];
      items.forEach(item => item.sellerName.value && item.sellerName.value.forEach(sellerName => sellerName !== "All" && itemList.push({itemUrl: item.url.value, sellerName})));
      return itemList;
    };

    const payload = {
      claimType,
      brandId,
      registrationNumber,
      comments,
      digitalSignatureBy,
      items: getItems(inputData.itemList)
    };
    this.loader("loader", true);
    return Http.post("/api/claims", payload)
      .then(res => {
        const meta = { templateName: "NewClaimAddedTemplate", data: {...res.body.data} };
        this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
        this.fetchClaims();
        this.loader("loader", false);
      })
      .catch(err => {
        this.loader("loader", false);
        console.log(err);
      });
  }

  resetTemplateStatus () {
    this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
  }

  onItemUrlChange (event, i) {
    const url = event && event.target.value;
    if (url) {
      this.loader("fieldLoader", true);
      const slash = url.lastIndexOf("/");
      const qMark = url.lastIndexOf("?") === -1 ? url.length : url.lastIndexOf("?");

      const payload = url.substring(slash + 1, qMark);
      const query = {payload};
      Http.get("/api/sellers", query)
        .then(res => {
          this.loader("fieldLoader", false);
          const form = {...this.state.form};
          if (res.body) res.body.unshift({value: "All", id: "_all"});
          form.inputData.itemList[i].sellerName.options = res.body;
          form.inputData.itemList[i].sellerName.disabled = false;
          form.inputData.itemList[i].url.error = "";
          //form.inputData.claimType.options = form.inputData.claimType.options.map(v => ({value: v.claimType}));
          this.setState({form}, this.checkToEnableItemButton);
        })
        .catch(err => {
          this.loader("fieldLoader", false);
          const form = {...this.state.form};
          if (err.status === 404) {
            form.inputData.itemList[i].url.error = "Please check the URL and try again!";
          }
          if (err.status === 520) {
            form.inputData.itemList[i].url.error = "Unable to retrieve sellers for this URL at this time, please try again!";
          }
          form.inputData.itemList[i].sellerName.disabled = true;
          this.setState({form}, this.checkToEnableItemButton);
        });
    }

  }

  render() {
    const form = this.state.form;
    const inputData = form.inputData;
    return (
      <div className="modal new-claim-modal show" id="singletonModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
          <form onSubmit={this.handleSubmit} className="modal-content">
            <div className="modal-header align-items-center">
              New Claim
              <button type="button" className="close text-white" aria-label="Close" onClick={this.resetTemplateStatus}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className={`modal-body text-left${this.state.loader && " loader"}`}>
              <p>Select the type of infringement you are reporting</p>
              <div className="row">
                <div className="col-4">
                  <CustomInput key={"claimType"} inputId={"claimType"} formId={form.id} label={inputData.claimType.label} required={inputData.claimType.required}
                    value={inputData.claimType.value} type={inputData.claimType.type} pattern={inputData.claimType.pattern} onChange={this.setSelectInputValue}
                    disabled={inputData.claimType.disabled} dropdownOptions={inputData.claimType.options} customChangeHandler={this.customChangeHandler.bind(this)} />
                </div>
              </div>
          {this.state.claimTypeSelected &&
            <React.Fragment>
              <p>Please complete the following fields to submit your claim.</p>
              <div className="row brand-and-patent">
                <div className="col-4">
                  <CustomInput key={"brandName"} inputId={"brandName"} formId={form.id} label={inputData.brandName.label} required={inputData.brandName.required}
                    value={inputData.brandName.value} type={inputData.brandName.type} pattern={inputData.brandName.pattern} onChange={this.setSelectInputValue}
                    disabled={inputData.brandName.disabled} dropdownOptions={inputData.brandName.options} subtitle={inputData.brandName.subtitle} unpadSubtitle={true} />
                </div>
                <div className="col-4">
                  <CustomInput key={"claimTypeIdentifier"} inputId={"claimTypeIdentifier"} formId={form.id} label={inputData.claimTypeIdentifier.label}
                    required={inputData.claimTypeIdentifier.required} value={inputData.claimTypeIdentifier.value} type={inputData.claimTypeIdentifier.type}
                    pattern={inputData.claimTypeIdentifier.pattern} onChange={this.onChange} disabled={inputData.claimTypeIdentifier.disabled}
                    dropdownOptions={inputData.claimTypeIdentifier.options} />
                </div>
              </div>
              {
                inputData.itemList.map((item, i) => {
                  return (
                    <div key={i} className="row item-url-list">
                      <div className="col-8">
                        <CustomInput key={`url-${i}`} inputId={`url-${i}`} formId={form.id} label={item.url.label} required={item.url.required}
                          value={item.url.value} type={item.url.type} pattern={item.url.pattern} onChange={this.onChange} disabled={item.url.disabled}
                          dropdownOptions={item.url.options} error={item.url.error} loader={this.state.fieldLoader && this.state.currentItem === i} />
                      </div>
                      <div className="col-4">
                        <div className="row">
                          <div className="col-8">
                            <CustomInput key={`sellerName-${i}`} inputId={`sellerName-${i}`} formId={form.id} label={item.sellerName.label}
                              required={item.sellerName.required} value={item.sellerName.value} type={item.sellerName.type} pattern={item.sellerName.pattern}
                              onChange={this.setSelectInputValue} disabled={item.sellerName.disabled} dropdownOptions={item.sellerName.options} />
                          </div>
                          <div className="col-4">
                            {
                              i === 0 &&
                              <div className={`btn btn-sm btn-block btn-primary${this.state.disableAddItem && " disabled" || ""}`} onClick={this.addToItemList}>
                                <img src={PlusIcon} className="plus-icon make-it-white"/> Item </div> ||
                              <div className="btn btn-sm btn-block cancel-btn text-primary" type="button" onClick={evt => {this.removeFromItemList(evt, i);}}>Remove</div>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              }
              <div className="row mb-3">
                <div className="col">
                  <CustomInput key={"comments"} inputId={"comments"} formId={form.id} label={inputData.comments.label} required={inputData.comments.required}
                    value={inputData.comments.value} type={inputData.comments.type} pattern={inputData.comments.pattern} onChange={this.onChange}
                    disabled={inputData.comments.disabled} rowCount={2} error={inputData.comments.error} subtitle={inputData.comments.subtitle} />
                </div>
              </div>
              {
                form.undertakingList.map((undertaking, i) => {
                  return (
                    <div key={i} className="row mb-2">
                      <div className="col">
                        <div className="form-check">
                          <input type="checkbox" id={`user-undertaking-${i}`} className="form-check-input user-undertaking" checked={undertaking.selected} required={true}
                            onChange={evt => {this.undertakingtoggle(evt, undertaking, i);}} />
                          <label className="form-check-label user-undertaking-label" htmlFor={`user-undertaking-${i}`}>
                            {undertaking.label}
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })
              }
              <div className="row mt-3">
                <div className="col-7">
                  <div className="form-group">
                    <label htmlFor="signature-name" className="font-weight-bold">Typing your full name in this box will act as your digital signature</label>
                    <input type="text" className="form-control" id="signature-name" aria-describedby="signature-name" required={true}
                      onChange={evt => {
                              const formCloned = {...this.state.form};
                              formCloned.inputData.signature.value = evt.target.value;
                              this.setState({form: formCloned});
                              this.checkToEnableSubmit();
                            }}/>
                  </div>
                </div>
              </div>
            </React.Fragment>}
            </div>
            <div className="modal-footer">
              <div className="btn btn-sm cancel-btn text-primary" type="button" onClick={this.resetTemplateStatus}>Cancel</div>
              {
                this.state.claimTypeSelected &&
                <button type="submit" className="btn btn-sm btn-primary submit-btn px-3 ml-3" disabled={form.isSubmitDisabled}>
                  Submit
                </button>
              }
            </div>
          </form>
        </div>
      </div>
    );
  }
}

NewClaimTemplate.propTypes = {
  dispatchClaims: PropTypes.func,
  modal: PropTypes.object,
  saveBrandInitiated: PropTypes.func,
  toggleModal: PropTypes.func,
  data: PropTypes.object,
  showNotification: PropTypes.func
};

const mapStateToProps = state => {
  return {
    modal: state.modal
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
