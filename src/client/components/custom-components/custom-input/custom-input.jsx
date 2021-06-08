/* eslint-disable no-unused-expressions */
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import $ from "jquery";
import Tooltip from "../tooltip/tooltip";
import Validator from "../../../utility/validationUtil";
import * as images from "./../../../images";
import QuestionMarkIcon from "../../../images/question.svg";
import "../../../styles/custom-components/custom-input/custom-input.scss";
import Helper from "../../../utility/helper";
import CONSTANTS from "../../../constants/constants";
import {ButtonsPanel, CaptchaValidator, CheckBox, ErrorComponent, FileUploader, HeaderFormComponent, UrlItemList} from "../../index";

class CustomInput extends React.Component {

  constructor (props) {
    super(props);
    const functions = ["changeHandlers", "onChangeLocal", "getRadioInputType", "getTextInputType", "getTextAreaInputType", "getSelectInput", "getMultiSelectInput", "setSelectInputValue", "setMultiSelectInputValue", "setMultiSelectValueFromDropdownOptions", "getSubtitleAndError", "onBlur"]
    functions.forEach(name => this[name] = this[name].bind(this));
    this.validate = Validator.validate.bind(this);
    this.changeHandlerDebounce = Helper.debounce(this.changeHandlers, CONSTANTS.ONCHANGEVALIDATIONTIMEOUT);
    this.state = {...this.props};
  }

  componentDidMount() {
    if (this.state.type === "multiselect") {
      this.setMultiSelectValueFromDropdownOptions(this.state.dropdownOptions);
    }
      $("[data-toggle='tooltip']")
        .on("mouseleave", e => e.stopImmediatePropagation())
        .on("mouseenter", () => $(".tooltip").removeClass("move-beneath"))
        .tooltip();
      $("body")
        .on("click", ".tooltip-close-button", () => $(".tooltip").addClass("move-beneath"))
        .on("mouseleave", ".tooltip, [data-toggle='tooltip']", () => $(".tooltip").addClass("move-beneath"));

  }

  componentDidUpdate(prevProps, prevState) {
    const changedProps = this.havePropsChanged(prevProps, this.props);
    const changedState = this.havePropsChanged(prevState, this.state);
    if (changedProps) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(changedProps);
    }
    if (changedState) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(changedState);
    }
  }

  onChangeLocal(evt, key) {
    evt.persist && evt.persist();
    const trimmedValue = this.state.prebounceChangeHandler && this.state.prebounceChangeHandler(evt);
    if (evt && evt.target) {
      this.setState(() => {
        const stateCloned = {...this.state};
        stateCloned.fieldOk = false;
        stateCloned.fieldAlert = false;
        stateCloned.value = trimmedValue !== undefined ? trimmedValue : evt.target.value;
        return stateCloned;
      });
    }
    this.changeHandlerDebounce(evt, key);
  }

  changeHandlers (evt, key) {
    this.state.customChangeHandler && this.state.customChangeHandler(evt);
    const error = this.validate(evt, this.state.parentRef);
    if (!error) {
      this.state.onChange(evt, key);
    } else {
      this.state.bubbleValue && this.state.bubbleValue(evt, key, error);
    }
    // const preValidationPassed = !this.validate(evt);
    // this.state.onChange(evt, key, preValidationPassed);
  }


  setSelectInputValue (value, key) {
    if (value) {
      this.setState({
        value
      });
    }
    this.state.customChangeHandler && this.state.customChangeHandler(value);
    this.state.onChange(value, key);
  }

  havePropsChanged(prevProps, newProps) {
    const changeableProps = ["label", "key", "formId", "inputId", "type", "required", "value", "pattern", "disabled", "loader", "fieldAlert", "fieldOk", "radioOptions", "dropdownOptions", "error", "subtitle"];
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
    const pattern = new RegExp(this.state.pattern ? this.state.pattern : Helper.search(this.state.patternPath));
    const patternErrorMessage = this.state.patternErrorMessage ? this.state.patternErrorMessage : Helper.search(this.state.patternErrorMessagePath);

    if (pattern && !pattern.test(evt.target.value)) {
      this.setState({error: patternErrorMessage});
    } else {
      this.state.error === patternErrorMessage && this.setState({error: ""});
    }
    if (this.state.onBlurEvent) {
      this.state.onBlurEvent(evt);
    }
  }

  getSelectInput() {

    const {subtitleText, subtitleClass, errorClass} = this.getSubtitleAndError();
    const content = (<React.Fragment>
      <input type={this.state.type} className={`form-control form-control-${this.state.inputId} custom-input-element`}
        id={`${this.state.formId}-${this.state.inputId}-custom-input`} value={this.state.value} onChange={() => {}}
        pattern={this.state.pattern} required={!this.state.preventHTMLRequiredValidation ? this.state.required : false} disabled={this.state.disabled}
        data-toggle="dropdown" autoComplete="off" />
      <label className={`custom-input-label ${this.state.value === "" ? "custom-input-label-placeholder" : ""}`} htmlFor={`${this.state.formId}-${this.state.inputId}-custom-input`}>
        {/*<div className="label-upper-bg position-absolute w-100 h-50 d-block"/>*/}
        {/*<div className="label-lower-bg position-absolute w-100 h-50 d-block"/>*/}
        <span className="label-text"> { this.state.label } </span>
      </label>
      <div className="dropdown-menu">
        {
          this.state.dropdownOptions && this.state.dropdownOptions.map((option, i) => {
            return <a key={option.id || i} className="dropdown-item" onClick={ () => { this.setSelectInputValue(option.value || option.label, this.state.inputId); } }>{option.label || option.value}</a>;
          })
        }
      </div>
      </React.Fragment>);
    return (
      <div className={`form-group custom-input-form-group custom-select-form-group dropdown ${this.state.disabled ? " disabled" : ""} ${subtitleText ? "mb-0" : "mb-3"} ${errorClass}${this.state.realign ? " row d-block" : " field-select-arrow"}`}>
        {this.state.tooltipContent && <Tooltip placement={"right"} classes="positioned-top-right" content={this.state.tooltipContent} icon={QuestionMarkIcon}/>}
        {this.state.realign ? <div className="col-4 field-select-arrow">{content}</div> : content}
        <small className={`form-text custom-input-help-text ${subtitleClass}`} style={{paddingLeft: this.state.unpadSubtitle && this.state.realign ? "1.7rem" : "0.7rem"}}>
          { subtitleText }
        </small>
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
      this.state.onChange(selectedList, key, optionId, allSelected);
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
    const updateOptions = (e) => {
      const error = this.validate(e, this.state.parentRef);
      if (!error) {
        const value = e.target.value;
        this.setState(state => {
        state = {...state};
        state.value = value;
        return state;
      }, ( ) => this.state.onChange( value , this.state.inputId, null, false));
      } else {
        this.state.bubbleValue && this.state.bubbleValue( e, this.state.inputId , error );
      }
    }

    return (
      <div className={`form-group custom-input-form-group custom-multi-select-form-group dropdown ${this.state.disabled ? "disabled" : ""} ${errorClass} ${subtitleText ? "mb-0" : "mb-3"}`}>
        <input type={this.state.type} className={`form-control form-control-${this.state.inputId} custom-input-element`} id={`${this.state.formId}-${this.state.inputId}-custom-input`}
          value = { this.state.value && typeof this.state.value === "object" &&  this.state.value.length ? this.state.value.join(",") : this.state.value  }
          pattern = {this.state.pattern} required = {this.state.required} disabled = {this.state.disabled}
          onChange = {this.state.dropdownOptions && this.state.dropdownOptions.length > 0 ? () => {} : updateOptions}
          data-toggle="dropdown" autoComplete="off" />
        <label className={`custom-input-label ${this.state.value === "" ? "custom-input-label-placeholder" : ""}`} htmlFor={`${this.state.formId}-${this.state.inputId}-custom-input`}>
          <div className="label-upper-bg position-absolute w-100 h-50 d-block"/>
          <div className="label-lower-bg position-absolute w-100 h-50 d-block"/>
          <span className="label-text"> { this.state.label } </span>
        </label>
        {
          this.state.dropdownOptions && this.state.dropdownOptions.length>0 && <img src={images.ArrowDown} className="dropdown-arrow"/>
        }
        <small className={`form-text custom-input-help-text ${subtitleClass}`} style={{paddingLeft: this.state.unpadSubtitle && "0.3rem"}}>
          { subtitleText }
        </small>

        {
         this.state.dropdownOptions && this.state.dropdownOptions.length>0 &&
        <div id={`${this.state.formId}-${this.state.inputId}-custom-input-dropdown`} className="dropdown-menu" >
          {
            this.state.dropdownOptions.map((option, i) => {
              return (
                <a key={option.id || i} className="dropdown-item">
                  <div className="form-check pl-0 d-flex">
                    <input className="cursor-pointer my-auto" type="checkbox" autoComplete="off" value={option.value}
                      id={`${this.state.formId}-${this.state.inputId}-${option.id}-multi-select-input`} checked={option.selected}
                      onChange={e => { option.selected = !option.selected; this.setMultiSelectInputValue(e, this.state.inputId, option.id, option.selected);}}  />
                    <label className="form-check-label ml-2 cursor-pointer flex-fill" htmlFor={`${this.state.formId}-${this.state.inputId}-${option.id}-multi-select-input`}>
                      {option.value}
                    </label>
                  </div>
                </a>
              );
            })
          }

        </div>
        }
      </div>
    );
  }

  getRadioInputType () {
    const options = [...this.state.radioOptions];
    return (
      <div className="form-group custom-input-form-group form-group-radio">
        {
          options.map((option, i) => {
            return (
              <div key={i}  className={`btn btn-sm radio-btn-box  p-0 ${this.state.value === option.value ? "active" : "inactive"}`}>
                <input type="radio" id={`${this.state.formId}-${this.state.inputId}-custom-input-${option.id}`} name={`${this.state.formId}-${this.state.inputId}-custom-input`}
                  className="custom-control-input" value={option.value} checked={this.state.value === option.value}
                  onChange={ e => {
                    this.onChangeLocal(e, this.state.inputId);
                  }}/>
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

    if (this.state.error) {
      subtitleText = this.state.error;
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
    const pattern = this.state.pattern ? this.state.pattern : Helper.search(this.state.patternPath);
    return (
      <div className={`form-group custom-input-form-group form-group-text${this.state.disabled ? " disabled" : ""}${subtitleText ? " mb-0" : this.state.isLastField ? " mb-2" : " mb-3"}${errorClass ? " " + errorClass : ""}
        ${this.state.loader ? " field-loader" : ""}${this.state.fieldOk ? " field-ok" : this.state.fieldAlert ? " field-alert" : ""}`} style={{position: this.state.value ? "relative" : "static"}}
      >
        <input type={this.state.type} className={`form-control form-control-${this.state.inputId} custom-input-element`}
          id={`${this.state.formId}-${this.state.inputId}-custom-input`} value={this.state.value} onKeyPress={this.state.onKeyPress && ((e) => this.state.onKeyPress(e, this.state.inputId))}
          pattern={pattern} required={!this.state.preventHTMLRequiredValidation ? this.state.required : false} disabled={this.state.disabled} onBlur={!this.state.disableDefaultBlueValidation ? this.onBlur : undefined} maxLength={this.state.maxLength}
          onChange={ e => { this.onChangeLocal(e, this.state.inputId); }} onInvalid={this.state.parentRef && typeof this.state.onInvalid === "string" ? (e => this.state.parentRef[this.state.onInvalid](e, this.state.inputId)) : (e => this.state.onInvalid(e, this.state.inputId))} />
        {this.state.value && this.state.canShowPassword && (this.state.type === "password" ?
          <span className="icon-view-password" onClick={() => this.setState({type: "text"})} />
          : <span className="icon-hide-password" onClick={() => this.setState({type: "password"})} />)}
        <label className={`custom-input-label ${this.state.value === "" ? "custom-input-label-placeholder" : ""}`} htmlFor={`${this.state.formId}-${this.state.inputId}-custom-input`}>
          <div className="label-upper-bg position-absolute w-100 h-50 d-block"/>
          <div className="label-lower-bg position-absolute w-100 h-50 d-block"/>
          <span className={`label-text${this.state.required ? " required" : ""}`}> { this.state.label } </span>
        </label>
        <small className={`form-text custom-input-help-text ${subtitleClass}`} style={{paddingLeft: this.state.unpadSubtitle && "0.3rem"}}>
          { subtitleText }
        </small>
      </div>
    );
  }

  getTextAreaInputType () {
    const {subtitleText, subtitleClass, errorClass} = this.getSubtitleAndError();
    return (
      <div className={`form-group custom-input-form-group form-group-textarea ${this.state.disabled ? "disabled" : ""}`}>
        <label className={`custom-input-label custom-input-label-textarea`} htmlFor={`${this.state.formId}-${this.state.inputId}-custom-input`}>{this.state.label} {!this.state.required ? "(Optional)" : ""}</label>
        <textarea className={`form-control form-control-${this.state.inputId} custom-input-element custom-input-element-textarea`} rows={this.state.rowCount || 4}
          id={`${this.state.formId}-${this.state.inputId}-custom-input`} value={this.state.value}
          required={!this.state.preventHTMLRequiredValidation ? this.state.required : false} disabled={this.state.disabled} onChange={ e => { this.onChangeLocal(e, this.state.inputId); }} placeholder={this.state.placeholder ? this.state.placeholder : ""} />
        <small className={`form-text custom-input-help-text text-area-error ${subtitleClass}`} style={{paddingLeft: this.state.unpadSubtitle && "0.3rem"}}>
          { errorClass ? subtitleText : "" }
        </small>
      </div>
  );
  }

  render () {

    switch (this.state.type) {
      case "text" :
      case "url":
      case "email" :
      case "password" :
        return this.getTextInputType();
      case "textarea" :
        return this.getTextAreaInputType();
      case "radio" :
        return this.getRadioInputType();
      case "select" :
        return this.getSelectInput();
      case "multiselect" :
        return this.getMultiSelectInput();
      case "_checkBox" :
        return <CheckBox {...this.props}/>
      case "_fileUploader" :
        return <FileUploader {...this.props} />
      case "_buttonsPanel" :
        return <ButtonsPanel {...this.props} />
      case "_error" :
        return <ErrorComponent {...this.props} />
      case "_formFieldsHeader" :
        return <HeaderFormComponent {...this.props} />
      case "_urlItems" :
      return <UrlItemList {...this.props} />
      case "_captchValidator" :
        return <CaptchaValidator {...this.props} onChange={this.onChangeLocal} />
    }
    return null;
  }
}

CustomInput.propTypes = {
  bubbleValue: PropTypes.func,
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
  onChange: PropTypes.func,
  onInvalid: PropTypes.func,
  parentRef: PropTypes.object,
  pattern: PropTypes.string,
  patternPath: PropTypes.string,
  patternErrorMessage: PropTypes.string,
  patternErrorMessagePath: PropTypes.string,
  prebounceChangeHandler: PropTypes.func,
  preventHTMLRequiredValidation: PropTypes.bool,
  radioOptions: PropTypes.array,
  required: PropTypes.bool,
  rowCount: PropTypes.number,
  subtitle: PropTypes.string,
  tooltipContent: PropTypes.object,
  tooltipContentKey: PropTypes.string,
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
