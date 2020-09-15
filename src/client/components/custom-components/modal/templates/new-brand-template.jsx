import React from "react";
import {connect} from "react-redux";
import CheckGreenIcon from "../../../../images/check-grn.svg";
import {saveBrandInitiated} from "../../../../actions/brand/brand-actions";
import PropTypes from "prop-types";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../actions/modal-actions";
import CustomInput from "../../custom-input/custom-input";
import Http from "../../../../utility/Http";
import {NOTIFICATION_TYPE, showNotification} from "../../../../actions/notification/notification-actions";
import Helper from "../../../../utility/helper";
import CONSTANTS from "../../../../constants/constants";
import "../../../../styles/custom-components/modal/templates/new-brand-template.scss";

class NewBrandTemplate extends React.Component {

  constructor(props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
    this.checkTrademarkValidity = this.checkTrademarkValidity.bind(this);
    // this.undertakingtoggle = this.undertakingtoggle.bind(this);
    this.resetTemplateStatus = this.resetTemplateStatus.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.prepopulateInputFields = this.prepopulateInputFields.bind(this);
    this.onBrandChange = this.onBrandChange.bind(this);
    this.brandDebounce = Helper.debounce(this.onBrandChange, CONSTANTS.APIDEBOUNCETIMEOUT);
    this.trademarkDebounce = Helper.debounce(this.checkTrademarkValidity, CONSTANTS.APIDEBOUNCETIMEOUT);
    this.state = {
      loader: false,
      brandFieldLoader: false,
      trademarkFieldLoader: false,
      checkLoader: false,
      form: {
        isSubmitDisabled: true,
        isUpdateTemplate: false,
        templateUpdateComplete: false,
        isDisabled: false,
        underwritingChecked: false,
        id: "brand-addition-form",
        inputData: {
          trademarkNumber: {
            label: "Trademark Number",
            required: true,
            value: "",
            type: "text",
            pattern: null,
            disabled: false,
            isValid: false,
            subtitle: "",
            error: ""
          },
          brandName: {
            label: "Brand Name",
            required: true,
            value: "",
            type: "text",
            pattern: null,
            disabled: false,
            subtitle: "",
            error: "",
            isUnique: false,
            onBlurEvent: e => {
              
            }
          },
          comments: {
            label: "Comments",
            required: false,
            value: "",
            type: "textarea",
            pattern: null,
            disabled: false,
            subtitle: "",
            error: ""
          }
        }
        // },
        // undertaking: {
        //   selected: false,
        //   label: "I have read and agree to the Brand Portal Terms of Use."
        // }
      }
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

  onInputChange(evt, key) {
    if (evt && evt.target) {
      const targetVal = evt.target.value;
      // if (key === "trademarkNumber" && ((evt.which < 48 || evt.which > 57) && !CONSTANTS.ALLOWED_KEY_CODES.includes(evt.which))) {
      //   evt.preventDefault();
      //   return;
      // }
      this.setState(state => {
        if (key === "trademarkNumber") {
          state.form.inputData[key].isValid = false;
          state.form.inputData[key].error = "";
          this.trademarkDebounce();
        }
        if (key === "brandName") {
          state.form.inputData[key].isUnique = false;
          state.form.inputData[key].error = "";
          this.brandDebounce();
        }
        state = {...state};
        state.form.inputData[key].value = targetVal;
        return state;
      }, this.checkToEnableSubmit);
    }
  }

  onBrandChange() {
    if (this.state.form.inputData.brandName.value) {
      this.loader("brandFieldLoader", true);
      Http.get("/api/brands/checkUnique", {brandName: this.state.form.inputData.brandName.value}).then(res => {
        this.loader("brandFieldLoader", false);
        let error;
        let isUnique;
        if (!res.body.unique) {
          error = "This brand is already registered in Brand Portal.";
          isUnique = false;
        } else {
          error = "";
          isUnique = true;
        }
        this.setState(state => {
          state = {...state};
          state.form.inputData.brandName.error = error;
          state.form.inputData.brandName.isUnique = isUnique;
          return {
            ...state
          };
        }, this.checkToEnableSubmit);
      })
      .catch(err => this.loader("brandFieldLoader", false));
    }
  }

  checkToEnableSubmit() {
    const form = {...this.state.form};
    const bool = (form.isUpdateTemplate || form.inputData.trademarkNumber.isValid)  &&
      form.inputData.trademarkNumber.value && form.inputData.brandName.value &&
      (form.isUpdateTemplate || form.inputData.brandName.isUnique);
      // && form.undertaking.selected;

    form.isSubmitDisabled = !bool;
    this.setState({form});
  }

  // undertakingtoggle () {
  //   const state = {...this.state};
  //   state.form.undertaking.selected = !state.form.undertaking.selected;
  //   this.setState({
  //     ...state
  //   }, this.checkToEnableSubmit);
  // }

  // eslint-disable-next-line max-statements
  async checkTrademarkValidity () {
    if (!this.state.form.inputData.trademarkNumber.value) return;
    try {
      this.loader("trademarkFieldLoader", true);
      this.setState(state => {
        state = {...state};
        state.checkLoader = true;
        return state;
      });
      const response = (await Http.get(`/api/brand/trademark/validity/${this.state.form.inputData.trademarkNumber.value}`)).body;
      if (!response.valid) {
        throw {error: `${response.ipNumber} is not a valid Trademark Number.`};
      }
      const state = {...this.state};
      const form = {...state.form};
      state.form = form;
      form.inputData.trademarkNumber.isValid = true;
      state.checkLoader = false;
      form.inputData.trademarkNumber.error = "";
      this.setState(state, this.checkToEnableSubmit);
    } catch (err) {
      console.log(err);
      const state = {...this.state};
      const form = {...state.form};
      state.form = form;
      form.inputData.trademarkNumber.isValid = false;
      state.checkLoader = false;
      form.inputData.trademarkNumber.error = err.error;
      this.setState(state, this.checkToEnableSubmit);
    }
    this.loader("trademarkFieldLoader", false);
  }

  async handleSubmit(evt) {
    evt.preventDefault();

    const trademarkNumber = this.state.form.inputData.trademarkNumber.value;
    const name = this.state.form.inputData.brandName.value;
    const comments = this.state.form.inputData.comments.value;

    const payload = { trademarkNumber, name, comments };


    const url = "/api/brands";

    if (this.state.form.isUpdateTemplate) {
      this.loader("loader", true);
      return Http.put(`${url}/${this.props.data.brandId}`, {comments})
        .then(res => {
          this.resetTemplateStatus();
          this.props.showNotification(NOTIFICATION_TYPE.SUCCESS, `Changes to ${res.body.brandName} saved successfully`);
          this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
          this.props.saveBrandInitiated();
          this.loader("loader", false);
        })
        .catch(err => {
          this.loader("loader", false);
          console.log(err);
        });
    } else {
      this.loader("loader", true);
      return Http.post(url, payload)
        .then(res => {
          this.props.showNotification(NOTIFICATION_TYPE.SUCCESS, `New brand ‘${res.body.request.name}’ added to your brand portfolio`);
          this.resetTemplateStatus();
          this.props.saveBrandInitiated();
          this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
          this.loader("loader", false);
        })
        .catch(err => {
          this.loader("loader", false);
          console.log(err);
        });
    }
  }

  resetTemplateStatus () {
    this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
  }

  render() {
    const form = this.state.form;
    const inputData = form.inputData;
    return (
      <div className="modal show new-brand-modal" id="singletonModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header align-items-center">
              {
                form.isUpdateTemplate ? "Edit Brand Details" : "Register a Brand"
              }
              <button type="button" className="close text-white" aria-label="Close" onClick={this.resetTemplateStatus}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className={`modal-body text-left${this.state.loader && " loader"}`}>
              <form onSubmit={this.handleSubmit} className="h-100 px-2">
                <div className="row">
                  <div className="col">
                    <p>Please complete the following fields to register your brand.</p>
                  </div>
                </div>
                <div className="form-row">
                  <div className="col">
                    <CustomInput key={"trademarkNumber"}
                      inputId={"trademarkNumber"} formId={form.id} label={inputData.trademarkNumber.label} required={inputData.trademarkNumber.required} value={inputData.trademarkNumber.value}
                      type={inputData.trademarkNumber.type} pattern={inputData.trademarkNumber.pattern} onChangeEvent={this.onInputChange} disabled={inputData.trademarkNumber.disabled}
                      loader={this.state.trademarkFieldLoader} error={inputData.trademarkNumber.error} subtitle={inputData.trademarkNumber.subtitle}/>
                  </div>
                  {/* {
                    !form.isUpdateTemplate && <div className="col-4">
                      <div className={`btn btn-sm btn-block ${inputData.trademarkNumber.isValid ? "btn-success" : this.state.checkLoader ? "btn-dark loader-small" : "btn-primary"}`}
                        onClick={this.checkTrademarkValidity}>
                        {
                          inputData.trademarkNumber.isValid ? <React.Fragment><img className="check-green-icon-white-bg" src={CheckGreenIcon} /> &nbsp;&nbsp;Valid </React.Fragment> : !this.state.checkLoader && "Check"
                        }
                      </div>
                    </div>
                  } */}
                </div>
                <div className="form-row">
                  <div className="col">
                    <CustomInput key={"brandName"}
                      inputId={"brandName"} formId={form.id} label={inputData.brandName.label} required={inputData.brandName.required} value={inputData.brandName.value}
                      type={inputData.brandName.type} pattern={inputData.brandName.pattern} onChangeEvent={this.onInputChange} disabled={inputData.brandName.disabled}
                      loader={this.state.brandFieldLoader} error={inputData.brandName.error} subtitle={inputData.brandName.subtitle}/>
                  </div>
                </div>
                <div className="form-row">
                  <div className="col">
                    <CustomInput key={"comments"}
                      inputId={"comments"} formId={form.id} label={inputData.comments.label} required={inputData.comments.required} value={inputData.comments.value}
                      type={inputData.comments.type} pattern={inputData.comments.pattern} onChangeEvent={this.onInputChange} disabled={inputData.comments.disabled}
                      error={inputData.comments.error} subtitle={inputData.comments.subtitle}/>
                  </div>
                </div>
                {/* {form.undertaking && <div className="row">
                  <div className="col">
                    <div className="form-check">
                      <input type="checkbox" id="user-undertaking" className="form-check-input user-undertaking" checked={form.undertaking.selected} required={true}
                        onChange={this.undertakingtoggle}/>
                      <label className="form-check-label user-undertaking-label" htmlFor="user-undertaking">
                        {form.undertaking.label}<a href="#" target="#blank">Terms Of Use.</a>
                      </label>
                    </div>
                  </div>
                </div>} */}
                <div className="row mt-3">
                  <div className="col text-right">
                    <div className="btn btn-sm cancel-btn text-primary" type="button" onClick={this.resetTemplateStatus}>Cancel</div>
                    <button type="submit" className="btn btn-sm btn-primary submit-btn px-3 ml-3" disabled={form.isSubmitDisabled}>
                      Submit
                    </button>
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

NewBrandTemplate.propTypes = {
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
  toggleModal,
  saveBrandInitiated,
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewBrandTemplate);
