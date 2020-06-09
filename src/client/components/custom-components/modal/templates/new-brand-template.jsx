import React from "react";
import {connect} from "react-redux";
import CheckGreenIcon from "../../../../images/check-grn.svg";

import PropTypes from "prop-types";
import "../../../../styles/custom-components/modal/templates/new-user-added-template.scss";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../actions/modal-actions";
import CustomInput from "../../custom-input/custom-input";
import Http from "../../../../utility/Http";
import ClientUtils from "../../../../utility/ClientUtils";

class NewBrandTemplate extends React.Component {

  constructor(props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
    this.checkTrademarkValidity = this.checkTrademarkValidity.bind(this);
    this.undertakingtoggle = this.undertakingtoggle.bind(this);
    this.resetTemplateStatus = this.resetTemplateStatus.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      form: {
        isSubmitDisabled: true,
        isUpdateTemplate: false,
        templateUpdateComplete: false,
        isDisabled: false,
        underwritingChecked: false,
        id: "brand-addition-form",
        inputData: {
          trademarkNumber: {
            label: "Brand Trademark Number",
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
            error: ""
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
        },
        undertaking: {
          selected: false,
          label: "I have read and agree to the Terms Of Use."
        }
      }
    };
  }

  onInputChange(evt, key) {
    if (evt && evt.target) {
      const targetVal = evt.target.value;
      this.setState(state => {
        state = {...state};
        state.form.inputData[key].value = targetVal;
        return {
          ...state
        };
      }, this.checkToEnableSubmit);
    }
  }

  checkToEnableSubmit() {
    const form = {...this.state.form};
    const bool = form.inputData.trademarkNumber.isValid &&
      form.inputData.trademarkNumber.value &&
      form.inputData.brandName.value &&
      form.undertaking.selected;

    form.isSubmitDisabled = !bool;
    this.setState({form});
  }

  undertakingtoggle () {
    const state = {...this.state};
    state.form.undertaking.selected = !state.form.undertaking.selected;
    this.setState({
      ...state
    }, this.checkToEnableSubmit);
  }

  async checkTrademarkValidity () {
    try {
      if (!this.state.form.inputData.trademarkNumber.value) {
        return;
      }
      const response = (await Http.get(`/api/brand/trademark/validity/${this.state.form.inputData.trademarkNumber.value}`)).body;
      if (!response.valid) {
        throw {error: `${response.ipNumber} is not a valid Trademark Number.`};
      }
      const form = {...this.state.form};
      form.inputData.trademarkNumber.isValid = true;
      form.inputData.trademarkNumber.error = "";
      this.setState({form}, this.checkToEnableSubmit);
    } catch (err) {
      console.log(err);
      const form = {...this.state.form};
      form.inputData.trademarkNumber.isValid = false;
      form.inputData.trademarkNumber.error = err.error;
      this.setState({form}, this.checkToEnableSubmit);
    }
  }

  async handleSubmit(evt) {
    evt.preventDefault();

    const trademarkNumber = this.state.form.inputData.trademarkNumber.value;
    const name = this.state.form.inputData.brandName.value;
    const comments = this.state.form.inputData.comments.value;

    const payload = { trademarkNumber, name, comments };


    const url = "/api/brands";

    if (this.state.form.isUpdateTemplate) {
      return Http.put(url, payload)
        .then(() => {
          this.resetTemplateStatus();
          this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
          this.props.saveBrandInitiated();
        })
        .catch(err => {
          console.log(err);
        });
    } else {

      return Http.post(url, payload)
        .then(res => {
          console.log(res);
          this.resetTemplateStatus();
          this.props.saveBrandInitiated();
          this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  resetTemplateStatus () {
    // const form = {...this.state.form};
    // form.templateUpdateComplete = false;
    // form.isUpdateTemplate = false;
    //
    // form.inputData.firstName.value = "";
    // form.inputData.userType.value = "Internal";
    // form.inputData.companyName.value = "";
    // form.inputData.lastName.value = "";
    // form.inputData.emailId.value = "";
    // form.inputData.role.value = "";
    // form.inputData.brands.value = "";
    // form.inputData.brands.options = form.inputData.brands.options.map(brand => {
    //   brand.selected = false;
    //   return brand;
    // });
    //
    // this.setState({form});
    this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
  }

  render() {
    return (
      <div className="modal show" id="singletonModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header align-items-center">
              Register a Brand
              <button type="button" className="close text-white" aria-label="Close" onClick={this.resetTemplateStatus}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body text-left">
              <form onSubmit={this.handleSubmit} className="h-100 pt-3">
                <div className="form-row">
                  <div className="col-8">
                    <CustomInput key={"trademarkNumber"}
                      inputId={"trademarkNumber"}
                      formId={this.state.form.id} label={this.state.form.inputData.trademarkNumber.label}
                      required={this.state.form.inputData.trademarkNumber.required} value={this.state.form.inputData.trademarkNumber.value}
                      type={this.state.form.inputData.trademarkNumber.type} pattern={this.state.form.inputData.trademarkNumber.pattern}
                      onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.trademarkNumber.disabled}
                      error={this.state.form.inputData.trademarkNumber.error} subtitle={this.state.form.inputData.trademarkNumber.subtitle}/>
                  </div>
                  <div className="col-4">
                    <div className={`btn btn-sm btn-block ${this.state.form.inputData.trademarkNumber.isValid ? "btn-success" : "btn-primary"}`}
                      onClick={this.checkTrademarkValidity}>
                      {
                        this.state.form.inputData.trademarkNumber.isValid ? <React.Fragment><img className="check-green-icon-white-bg" src={CheckGreenIcon} /> &nbsp;&nbsp;Valid </React.Fragment> : "Check"
                      }
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="col">
                    <CustomInput key={"brandName"}
                      inputId={"brandName"}
                      formId={this.state.form.id} label={this.state.form.inputData.brandName.label}
                      required={this.state.form.inputData.brandName.required} value={this.state.form.inputData.brandName.value}
                      type={this.state.form.inputData.brandName.type} pattern={this.state.form.inputData.brandName.pattern}
                      onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.brandName.disabled}
                      error={this.state.form.inputData.brandName.error} subtitle={this.state.form.inputData.brandName.subtitle}/>
                  </div>
                </div>
                <div className="form-row">
                  <div className="col">
                    <CustomInput key={"comments"}
                      inputId={"comments"}
                      formId={this.state.form.id} label={this.state.form.inputData.comments.label}
                      required={this.state.form.inputData.comments.required} value={this.state.form.inputData.comments.value}
                      type={this.state.form.inputData.comments.type} pattern={this.state.form.inputData.comments.pattern}
                      onChangeEvent={this.onInputChange} disabled={this.state.form.inputData.comments.disabled}
                      error={this.state.form.inputData.comments.error} subtitle={this.state.form.inputData.comments.subtitle}/>
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                    <div className="form-check">
                      <input type="checkbox" id="user-undertaking" className="form-check-input user-undertaking" checked={this.state.form.undertaking.selected} required={true}
                        onChange={this.undertakingtoggle}/>
                      <label className="form-check-label user-undertaking-label" htmlFor="user-undertaking">
                        {this.state.form.undertaking.label}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col text-right">
                    <div className="btn btn-sm cancel-btn text-primary" type="button" onClick={this.resetTemplateStatus}>Cancel</div>
                    <button type="submit" className="btn btn-sm btn-primary submit-btn px-3 ml-3" disabled={this.state.form.isSubmitDisabled}>
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
  toggleModal: PropTypes.func
};

const mapStateToProps = state => {
  return {
    modal: state.modal
  };
};

const mapDispatchToProps = {
  toggleModal
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewBrandTemplate);


