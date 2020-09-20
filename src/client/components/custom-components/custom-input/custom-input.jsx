/* eslint-disable no-unused-expressions */
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import $ from "jquery";
import Tooltip from "../tooltip/tooltip";
import * as images from "./../../../images";
import "../../../styles/custom-components/custom-input/custom-input.scss";

class CustomInput extends React.Component {

  constructor (props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
    this.getRadioInputType = this.getRadioInputType.bind(this);
    this.getTextInputType = this.getTextInputType.bind(this);
    this.getTextAreaInputType = this.getTextAreaInputType.bind(this);
    this.getSelectInput = this.getSelectInput.bind(this);
    this.getMultiSelectInput = this.getMultiSelectInput.bind(this);
    this.setSelectInputValue = this.setSelectInputValue.bind(this);
    this.setMultiSelectInputValue = this.setMultiSelectInputValue.bind(this);
    this.setMultiSelectValueFromDropdownOptions = this.setMultiSelectValueFromDropdownOptions.bind(this);
    this.getSubtitleAndError = this.getSubtitleAndError.bind(this);
    this.onBlur = this.onBlur.bind(this);

    this.state = {
      label: this.props.label,
      key: this.props.key,
      formId: this.props.formId,
      inputId: this.props.inputId,
      type: this.props.type,
      required: this.props.required,
      value: this.props.value,
      pattern: this.props.pattern,
      disabled: this.props.disabled,
      onChangeEvent: this.props.onChangeEvent,
      onBlurEvent: this.props.onBlurEvent,
      preventHTMLRequiredValidation: this.props.preventHTMLRequiredValidation,
      radioOptions: this.props.radioOptions,
      dropdownOptions: this.props.dropdownOptions,
      subtitle: this.props.subtitle,
      error: this.props.error,
      tooltipContent: this.props.tooltipContent
    };
  }

  componentDidMount() {
    if (this.props.type === "multiselect") {
      this.setMultiSelectValueFromDropdownOptions(this.state.dropdownOptions);
      
      $("[data-toggle='tooltip']")
        .on("mouseleave", e => e.stopImmediatePropagation())
        .on("mouseenter", () => $(".tooltip").removeClass("move-beneath"))
        .tooltip();
      $("body")
        .on("click", ".tooltip-close-button", () => $(".tooltip").addClass("move-beneath"))
        .on("mouseleave", ".tooltip, [data-toggle='tooltip']", () => $(".tooltip").addClass("move-beneath"));
      }
  }

  componentDidUpdate(prevProps) {

    const changedProps = this.havePropsChanged(prevProps, this.props);
    if (changedProps) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(changedProps);
    }
  }

  onInputChange(evt, key) {
    if (evt && evt.target) {
      this.setState({
        value: evt.target.value
      });
    }

    this.props.customChangeHandler && this.props.customChangeHandler(evt);
    this.state.onChangeEvent(evt, key);
  }

  setSelectInputValue (value, key) {
    if (value) {
      this.setState({
        value
      });
    }
    this.props.customChangeHandler && this.props.customChangeHandler(value);
    this.state.onChangeEvent(value, key);
  }

  havePropsChanged(prevProps, newProps) {
    const changeableProps = ["label", "key", "formId", "inputId", "type", "required", "value", "pattern", "disabled", "radioOptions", "dropdownOptions", "error", "subtitle"];
    const changedProps = {};
    for (const i in changeableProps) {
      if (prevProps[changeableProps[i]] !== newProps[changeableProps[i]]) {
        changedProps[changeableProps[i]] = newProps[changeableProps[i]];
      }
    }
    if (Object.keys(changedProps).length) {
      return changedProps;
    }

    return false;
  }

  onBlur (evt) {
    const pattern = new RegExp(this.props.pattern);
    if (this.props.pattern && !pattern.test(evt.target.value)) {
      this.setState({error: this.props.patternErrorMessage});
    } else {
      this.setState({error: ""});
    }
    if (this.props.onBlurEvent) {
      this.props.onBlurEvent(evt);
    }
  }

  getSelectInput() {

    const {subtitleText, subtitleClass, errorClass} = this.getSubtitleAndError();

    return (
      <div className={`form-group custom-input-form-group custom-select-form-group dropdown ${this.state.disabled ? "disabled" : ""} ${subtitleText ? "mb-0" : "mb-4"} ${errorClass}`}>
        {this.state.tooltipContent && <Tooltip placement={"right"} classes="positioned-top-right" content={this.state.tooltipContent} icon={images.Question}/>}
        <input type={this.state.type} className={`form-control form-control-${this.state.inputId} custom-input-element`}
          id={`${this.state.formId}-${this.state.inputId}-custom-input`} value={this.state.value} onChange={() => {}}
          pattern={this.state.pattern} required={this.state.required} disabled={this.state.disabled}
          data-toggle="dropdown" autoComplete="off" />
        <label className={`custom-input-label ${this.state.value === "" ? "custom-input-label-placeholder" : ""}`} htmlFor={`${this.state.formId}-${this.state.inputId}-custom-input`}>
          <div className="label-upper-bg position-absolute w-100 h-50 d-block"/>
          <div className="label-lower-bg position-absolute w-100 h-50 d-block"/>
          <span className="label-text"> { this.state.label } </span>
        </label>
        <img src={images.ArrowDown} className="dropdown-arrow"/>
        <small className={`form-text custom-input-help-text ${subtitleClass}`} style={{paddingLeft: this.props.unpadSubtitle && "0.3rem"}}>
          { subtitleText }
        </small>


        <div className="dropdown-menu">
          {
            this.props.dropdownOptions.map((option, i) => {
              return <a key={option.id || i} className="dropdown-item" onClick={ () => { this.setSelectInputValue(option.value, this.state.inputId); } }>{option.value}</a>;
            })
          }
        </div>
      </div>
    );
  }

  setMultiSelectInputValue (evt, key, optionId) {
    if (evt && evt.target) {
      const state = {...this.state};
      const dropdownOptions = [...state.dropdownOptions];
      let allSelected;
      if (evt.target.value.toLowerCase() === "all") {
        allSelected = evt.target.checked;
        dropdownOptions.forEach(opt => (opt.selected = evt.target.checked));
      } else {
        const optionAll = dropdownOptions.find(opt => opt.value.toLowerCase()  === "all");
        optionAll.selected = true;
        dropdownOptions.forEach(opt => !opt.selected  && (optionAll.selected = false));
        if (!evt.target.checked && optionAll) optionAll.selected = false;
      }
      this.setState({
        dropdownOptions
      });
      const selectedList = this.setMultiSelectValueFromDropdownOptions(dropdownOptions);
      this.state.onChangeEvent(selectedList, key, optionId, allSelected);
    }
  }

  setMultiSelectValueFromDropdownOptions (dropdownOptions) {
    const selectedList = [];
    for (const i in dropdownOptions) {
      if (dropdownOptions[i].selected) {
        selectedList.push(dropdownOptions[i].value);
      }
    }
    this.setState({
      value: selectedList.join(", ")
    });
    return selectedList;
  }

  getMultiSelectInput () {

    const {subtitleText, subtitleClass, errorClass} = this.getSubtitleAndError();

    return (

      <div className={`form-group custom-input-form-group custom-multi-select-form-group dropdown ${this.state.disabled ? "disabled" : ""} ${errorClass} ${subtitleText ? "mb-0" : "mb-4"}`}>
        <input type={this.state.type} className={`form-control form-control-${this.state.inputId} custom-input-element`} id={`${this.state.formId}-${this.state.inputId}-custom-input`}
          value={this.state.value && typeof this.state.value === "object" && this.state.value.length ? this.state.value.join(", ") : this.state.value} onChange={() => {}}
          pattern={this.state.pattern} required={this.state.required} disabled={this.state.disabled}
          data-toggle="dropdown" autoComplete="off" />
        <label className={`custom-input-label ${this.state.value === "" ? "custom-input-label-placeholder" : ""}`} htmlFor={`${this.state.formId}-${this.state.inputId}-custom-input`}>
          <div className="label-upper-bg position-absolute w-100 h-50 d-block"/>
          <div className="label-lower-bg position-absolute w-100 h-50 d-block"/>
          <span className="label-text"> { this.state.label } </span>
        </label>
        <img src={images.ArrowDown} className="dropdown-arrow"/>
        <small className={`form-text custom-input-help-text ${subtitleClass}`} style={{paddingLeft: this.props.unpadSubtitle && "0.3rem"}}>
          { subtitleText }
        </small>

        <div id={`${this.state.formId}-${this.state.inputId}-custom-input-dropdown`} className="dropdown-menu" >
          {
            this.state.dropdownOptions.map((option, i) => {
              return (
                <a key={option.id || i} className="dropdown-item">
                  <div className="form-check pl-0">
                    <input className="cursor-pointer" type="checkbox" autoComplete="off" value={option.value}
                      id={`${this.state.formId}-${this.state.inputId}-${option.id}-multi-select-input`} checked={option.selected}
                      onChange={e => { option.selected = !option.selected; this.setMultiSelectInputValue(e, this.state.inputId, option.id, option.selected);}}  />
                    <label className="form-check-label ml-2 cursor-pointer" htmlFor={`${this.state.formId}-${this.state.inputId}-${option.id}-multi-select-input`}>
                      {option.value}
                    </label>
                  </div>
                </a>
              );
            })
          }
        </div>
      </div>
    );
  }

  getRadioInputType () {
    return (
      <div className="form-group custom-input-form-group form-group-radio">
        {
          this.props.radioOptions.map((option, i) => {
            return (
              <div key={i}  className={`btn btn-sm radio-btn-box  p-0 ${this.props.value === option.value ? "active" : "inactive"}`}>
                <input type="radio" id={`${this.state.formId}-${this.state.inputId}-custom-input-${option.id}`} name={`${this.state.formId}-${this.state.inputId}-custom-input`}
                  className="custom-control-input" value={option.value} checked={this.props.value === option.value}
                  onChange={ e => { this.onInputChange(e, this.state.inputId); }}/>
                <label className="radio-label m-0 p-0" htmlFor={`${this.state.formId}-${this.state.inputId}-custom-input-${option.id}`}>
                  {option.label || option.value}
                </label>
              </div>
            );
          })
        }
      </div>
    );
  }

  getSubtitleAndError () {
    let subtitleText = "";
    let subtitleClass = "text-muted";
    let errorClass = "";

    if (this.props.error) {
      subtitleText = this.props.error;
      subtitleClass = "text-danger";
      errorClass = "has-error";
    } else if (this.state.subtitle) {
      subtitleText = this.state.subtitle;
    } else if (!this.state.required) {
      subtitleText = "Optional";
    }

    return {subtitleText, subtitleClass, errorClass};
  }

  getTextInputType () {

    const {subtitleText, subtitleClass, errorClass} = this.getSubtitleAndError();

    return (
      <div className={`form-group custom-input-form-group form-group-text ${this.state.disabled ? "disabled" : ""} ${subtitleText ? "mb-0" : "mb-4"} ${errorClass}${this.props.loader ? " field-loader" : ""}`}>
        <input type={this.state.type} className={`form-control form-control-${this.state.inputId} custom-input-element`}
          id={`${this.state.formId}-${this.state.inputId}-custom-input`} value={this.state.value}
          pattern={this.state.pattern} required={!this.state.preventHTMLRequiredValidation ? this.state.required : false} disabled={this.state.disabled} onBlur={this.onBlur} maxLength={this.props.maxLength}
          onChange={ e => { this.onInputChange(e, this.state.inputId); }} onInvalid={e => this.props.onInvalidHandler(e, this.state.inputId)} />

        <label className={`custom-input-label ${this.state.value === "" ? "custom-input-label-placeholder" : ""}`} htmlFor={`${this.state.formId}-${this.state.inputId}-custom-input`}>
          <div className="label-upper-bg position-absolute w-100 h-50 d-block"/>
          <div className="label-lower-bg position-absolute w-100 h-50 d-block"/>
          <span className="label-text"> { this.state.label } </span>
        </label>
        <small className={`form-text custom-input-help-text ${subtitleClass}`} style={{paddingLeft: this.props.unpadSubtitle && "0.3rem"}}>
          { subtitleText }
        </small>
      </div>
    );
  }

  getTextAreaInputType () {

    return (
      <div className={`form-group custom-input-form-group form-group-textarea ${this.state.disabled ? "disabled" : ""}`}>
        <label className={`custom-input-label custom-input-label-textarea`} htmlFor={`${this.state.formId}-${this.state.inputId}-custom-input`}>{this.state.label} {!this.state.required ? "(Optional)" : ""}</label>
        <textarea className={`form-control form-control-${this.state.inputId} custom-input-element custom-input-element-textarea`} rows={this.props.rowCount || 4}
          id={`${this.state.formId}-${this.state.inputId}-custom-input`} value={this.state.value}
          required={this.state.required} disabled={this.state.disabled} onChange={ e => { this.onInputChange(e, this.state.inputId); }} />
      </div>
    );
  }

  render () {

    switch (this.props.type) {
      case "text" :
      case "url":
      case "email" :
        return this.getTextInputType();
      case "textarea" :
        return this.getTextAreaInputType();
      case "radio" :
        return this.getRadioInputType();
      case "select" :
        return this.getSelectInput();
      case "multiselect" :
        return this.getMultiSelectInput();
    }
    return null;
  }
}

CustomInput.propTypes = {
  customChangeHandler: PropTypes.func,
  disabled: PropTypes.bool,
  dropdownOptions: PropTypes.array,
  error: PropTypes.string,
  formId: PropTypes.string,
  inputId: PropTypes.string,
  key: PropTypes.string,
  label: PropTypes.string,
  loader: PropTypes.bool,
  maxLength: PropTypes.number,
  onBlurEvent: PropTypes.func,
  onChangeEvent: PropTypes.func,
  onInvalidHandler: PropTypes.func,
  pattern: PropTypes.string,
  patternErrorMessage: PropTypes.string,
  preventHTMLRequiredValidation: PropTypes.bool,
  radioOptions: PropTypes.array,
  required: PropTypes.bool,
  rowCount: PropTypes.number,
  subtitle: PropTypes.string,
  tooltipContent: PropTypes.object,
  type: PropTypes.string,
  unpadSubtitle: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ])
};

const mapStateToProps = state => state;

export default connect(
  mapStateToProps,
  dispatch => ({dispatch})
)(CustomInput);
