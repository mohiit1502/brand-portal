import React from "react";
import {connect} from "react-redux";
import PlusIcon from "../../../../images/plus.svg";
import {saveBrandInitiated} from "../../../../actions/brand/brand-actions";
import PropTypes from "prop-types";
import "../../../../styles/custom-components/modal/templates/new-claim-template.scss";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../actions/modal-actions";
import {dispatchClaims} from "../../../../actions/claim/claim-actions";
import CustomInput from "../../custom-input/custom-input";
import Http from "../../../../utility/Http";
import {showNotification} from "../../../../actions/notification/notification-actions";
import ClientUtils from "../../../../utility/ClientUtils";

class NewClaimTemplate extends React.Component {

  constructor(props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
    this.undertakingtoggle = this.undertakingtoggle.bind(this);
    this.resetTemplateStatus = this.resetTemplateStatus.bind(this);
    this.fetchClaims = this.fetchClaims.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getClaimTypes = this.getClaimTypes.bind(this);
    this.getBrands = this.getBrands.bind(this);
    this.addToItemList = this.addToItemList.bind(this);
    this.removeFromItemList = this.removeFromItemList.bind(this);
    this.setSelectInputValue = this.setSelectInputValue.bind(this);
    this.onItemUrlBlur = this.onItemUrlBlur.bind(this);

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
            subtitle: "",
            error: ""
          },
          copyrightNumber: {
            label: "Copyright Number",
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
      }
    };
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
        type: "select",
        pattern: null,
        disabled: true,
        options: [],
        subtitle: "",
        error: ""
      }
    };
    const form = {...this.state.form};
    form.inputData.itemList.unshift(item);
    this.setState({form});
  }

  removeFromItemList (evt, index) {
    const form = {...this.state.form};
    form.inputData.itemList.splice(index, 1);
    this.setState({form});
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
        if (index > -1) {
          state.form.inputData.itemList[index][key].value = value;
        } else {
          state.form.inputData[key].value = value;
        }

        return {
          ...state
        };
      }, this.checkToEnableSubmit);
    }
  }

  getClaimTypes () {
    return Http.get("/api/claims/types")
      .then(res => {
        const form = {...this.state.form};
        form.inputData.claimType.options = res.body.data;
        form.inputData.claimType.options = form.inputData.claimType.options.map(v => ({value: v.claimType}));
        this.setState({form});
      });
  }

  getBrands () {
    return Http.get("/api/brands")
      .then(res => {
        const form = {...this.state.form};
        form.inputData.brandName.options = res.body.content;
        form.inputData.brandName.options = form.inputData.brandName.options.map(v => ({id: v.brandId, value: v.brandName}));
        this.setState({form});
      });
  }

  async fetchClaims () {
    const response = (await Http.get("/api/claims")).body;

    let claimList = [];

    if (response.data.content && response.data.content) {
      claimList = response.data.content.map((brand, i) => {
        const newClaim = { ...brand, sequence: i + 1 };
        newClaim.original = brand;
        return newClaim;
      });
    }

    this.props.dispatchClaims({claimList});
  }

  onInputChange(evt, key) {
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
          state.form.inputData.itemList[index][key].value = targetVal;
        } else {
          state.form.inputData[key].value = targetVal;
        }
        return {
          ...state
        };
      }, this.checkToEnableSubmit);
    }
  }

  checkToEnableSubmit() {
    const form = {...this.state.form};


    const bool = form.inputData.claimType.value &&
      form.inputData.brandName.value &&
      form.inputData.copyrightNumber.value &&
      form.inputData.itemList.reduce((boolResult, item) => !!(boolResult && item.url.value && item.sellerName.value), true) &&
      form.undertakingList.reduce((boolResult, undertaking) => !!(boolResult && undertaking.selected), true) &&
      form.inputData.signature.value;

    form.isSubmitDisabled = !bool;
    this.setState({form});
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
    const registrationNumber = inputData.copyrightNumber.value;

    const brandName = inputData.brandName.value;
    const index = ClientUtils.where(inputData.brandName.options, {value: brandName});
    const brandId = inputData.brandName.options[index].id;

    const comments = inputData.comments.value;
    const digitalSignatureBy = inputData.signature.value;

    const payload = {
      claimType,
      brandId,
      registrationNumber,
      comments,
      digitalSignatureBy,
      items: inputData.itemList.map(item => ({itemUrl: item.url.value, sellerName: item.sellerName.value}))
    };
    return Http.post("/api/claims", payload)
      .then(res => {
        const meta = { templateName: "NewClaimAddedTemplate", data: {...res.body.data} };
        this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
        this.fetchClaims();
      })
      .catch(err => {
        console.log(err);
      });
  }

  resetTemplateStatus () {
    this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
  }

  onItemUrlBlur (evt, item, i) {
    // console.log(evt);
    if (evt && evt.target) {
      const url = evt.target.value;
      if (url) {
        const payload = url.substring(url.lastIndexOf("/") + 1);
        const query = {payload};
        Http.get("/api/sellers", query)
          .then(res => {
            const form = {...this.state.form};
            form.inputData.itemList[i].sellerName.options = res.body;
            form.inputData.itemList[i].sellerName.disabled = false;
            //form.inputData.claimType.options = form.inputData.claimType.options.map(v => ({value: v.claimType}));
            this.setState({form});
          });
      }
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
            <div className="modal-body text-left">
                <div className="row">
                  <div className="col-4">
                    <CustomInput key={"claimType"} inputId={"claimType"} formId={form.id} label={inputData.claimType.label} required={inputData.claimType.required}
                      value={inputData.claimType.value} type={inputData.claimType.type} pattern={inputData.claimType.pattern} onChangeEvent={this.setSelectInputValue}
                      disabled={inputData.claimType.disabled} dropdownOptions={inputData.claimType.options} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <CustomInput key={"brandName"} inputId={"brandName"} formId={form.id} label={inputData.brandName.label} required={inputData.brandName.required}
                      value={inputData.brandName.value} type={inputData.brandName.type} pattern={inputData.brandName.pattern} onChangeEvent={this.setSelectInputValue}
                      disabled={inputData.brandName.disabled} dropdownOptions={inputData.brandName.options} />
                  </div>
                  <div className="col-4">
                    <CustomInput key={"copyrightNumber"} inputId={"copyrightNumber"} formId={form.id} label={inputData.copyrightNumber.label}
                      required={inputData.copyrightNumber.required} value={inputData.copyrightNumber.value} type={inputData.copyrightNumber.type}
                      pattern={inputData.copyrightNumber.pattern} onChangeEvent={this.onInputChange} disabled={inputData.copyrightNumber.disabled}
                      dropdownOptions={inputData.copyrightNumber.options} />
                  </div>
                </div>
                {
                  inputData.itemList.map((item, i) => {
                    return (
                      <div key={i} className="row">
                        <div className="col-8">
                          <CustomInput key={`url-${i}`} inputId={`url-${i}`} formId={form.id} label={item.url.label} required={item.url.required}
                            value={item.url.value} type={item.url.type} pattern={item.url.pattern} onBlurEvent={evt => {this.onItemUrlBlur(evt, item, i);}}
                            onChangeEvent={this.onInputChange} disabled={item.url.disabled} dropdownOptions={item.url.options} />
                        </div>
                        <div className="col-4">
                          <div className="row">
                            <div className="col-8">
                              <CustomInput key={`sellerName-${i}`} inputId={`sellerName-${i}`} ormId={form.id} label={item.sellerName.label}
                                required={item.sellerName.required} value={item.sellerName.value} type={item.sellerName.type} pattern={item.sellerName.pattern}
                                onChangeEvent={this.setSelectInputValue} disabled={item.sellerName.disabled} dropdownOptions={item.sellerName.options} />
                            </div>
                            <div className="col-4">
                              {
                                i === 0 && <div className="btn btn-sm btn-block btn-primary" onClick={this.addToItemList}>
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
                      value={inputData.comments.value} type={inputData.comments.type} pattern={inputData.comments.pattern} onChangeEvent={this.onInputChange}
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
                  <div className="col">
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
            </div>
            <div className="modal-footer">
              <div className="btn btn-sm cancel-btn text-primary" type="button" onClick={this.resetTemplateStatus}>Cancel</div>
              <button type="submit" className="btn btn-sm btn-primary submit-btn px-3 ml-3" disabled={false && form.isSubmitDisabled}>
                Submit
              </button>
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
