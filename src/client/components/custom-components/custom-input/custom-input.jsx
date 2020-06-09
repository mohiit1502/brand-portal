import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
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
      radioOptions: this.props.radioOptions,
      dropdownOptions: this.props.dropdownOptions,
      subtitle: this.props.subtitle,
      error: this.props.error
    };
  }

  componentDidMount() {

    if (this.props.type === "multiselect") {
      this.setMultiSelectValueFromDropdownOptions(this.state.dropdownOptions);
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

    this.state.onChangeEvent(evt, key);
  }

  setSelectInputValue (value, key) {
    if (value) {
      this.setState({
        value
      });
    }
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


  getSelectInput() {
    return (
      <div className="form-group custom-input-form-group custom-select-form-group dropdown">
        <input type={this.state.type} className={`form-control form-control-${this.state.inputId} custom-input-element`}
          id={`${this.state.formId}-${this.state.inputId}-custom-input`} value={this.state.value} onChange={() => {}}
          pattern={this.state.pattern} required={this.state.required} disabled={this.state.disabled}
          data-toggle="dropdown"/>
        <label className={`custom-input-label ${this.state.value === "" ? "custom-input-label-placeholder" : ""}`} htmlFor={`${this.state.formId}-${this.state.inputId}-custom-input`}>
          <div className="label-upper-bg position-absolute w-100 h-50 d-block"/>
          <div className="label-lower-bg position-absolute w-100 h-50 d-block"/>
          <span className="label-text"> { this.state.label } </span>
        </label>
        {
          this.state.required && this.state.value === "" && <small className="form-text custom-input-help-text text-muted">Required</small>
        }


        <div className="dropdown-menu">
          {
            this.props.dropdownOptions.map(option => {
              return <a key={option.id} className="dropdown-item" onClick={ () => { this.setSelectInputValue(option.value, this.state.inputId); } }>{option.value}</a>;
            })
          }
        </div>
      </div>
    );
  }

  setMultiSelectInputValue (evt, key, optionId) {
    if (evt && evt.target) {
      const state = {...this.state};
      const dropdownOptions = state.dropdownOptions;
      this.setState({
        dropdownOptions
      });
      const selectedList = this.setMultiSelectValueFromDropdownOptions(dropdownOptions);
      this.state.onChangeEvent(selectedList, key, optionId);
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
    return (

      <div className="form-group custom-input-form-group custom-multi-select-form-group dropdown">
        <input type={this.state.type} className={`form-control form-control-${this.state.inputId} custom-input-element`}
          id={`${this.state.formId}-${this.state.inputId}-custom-input`} value={this.state.value} onChange={() => {}}
          pattern={this.state.pattern} required={this.state.required} disabled={this.state.disabled}
          data-toggle="dropdown"/>
        <label className={`custom-input-label ${this.state.value === "" ? "custom-input-label-placeholder" : ""}`} htmlFor={`${this.state.formId}-${this.state.inputId}-custom-input`}>
          <div className="label-upper-bg position-absolute w-100 h-50 d-block"/>
          <div className="label-lower-bg position-absolute w-100 h-50 d-block"/>
          <span className="label-text"> { this.state.label } </span>
        </label>
        {
          this.state.required && this.state.value === "" && <small className="form-text custom-input-help-text text-muted">Required</small>
        }

        <div id={`${this.state.formId}-${this.state.inputId}-custom-input-dropdown`} className="dropdown-menu" >
          {
            this.state.dropdownOptions.map(option => {
              return (
                <a key={option.id} className="dropdown-item">
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
                  {option.value}
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

    return (
      <div className={`form-group custom-input-form-group form-group-text ${this.state.disabled ? "disabled" : ""} ${errorClass}`}>
        <input type={this.state.type} className={`form-control form-control-${this.state.inputId} custom-input-element`}
          id={`${this.state.formId}-${this.state.inputId}-custom-input`} value={this.state.value}
          pattern={this.state.pattern} required={this.state.required} disabled={this.state.disabled}
          onChange={ e => { this.onInputChange(e, this.state.inputId); } }/>

        <label className={`custom-input-label ${this.state.value === "" ? "custom-input-label-placeholder" : ""}`} htmlFor={`${this.state.formId}-${this.state.inputId}-custom-input`}>
          <div className="label-upper-bg position-absolute w-100 h-50 d-block"/>
          <div className="label-lower-bg position-absolute w-100 h-50 d-block"/>
          <span className="label-text"> { this.state.label } </span>
        </label>
        <small className={`form-text custom-input-help-text ${subtitleClass}`}>
          { subtitleText }
        </small>
      </div>
    );
  }

  getTextAreaInputType () {

    return (
      <div className={`form-group custom-input-form-group form-group-textarea ${this.state.disabled ? "disabled" : ""}`}>
        <label className={`custom-input-label custom-input-label-textarea`} htmlFor={`${this.state.formId}-${this.state.inputId}-custom-input`}>{this.state.label} {!this.state.required ? "(Optional)" : ""}</label>
        <textarea className={`form-control form-control-${this.state.inputId} custom-input-element custom-input-element-textarea`} rows="4"
          id={`${this.state.formId}-${this.state.inputId}-custom-input`} value={this.state.value}
          required={this.state.required} disabled={this.state.disabled} onChange={ e => { this.onInputChange(e, this.state.inputId); }} />
      </div>
    );
  }

  render () {

    switch (this.props.type) {
      case "text" :
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
  label: PropTypes.string,
  key: PropTypes.string,
  formId: PropTypes.string,
  inputId: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.string,
  pattern: PropTypes.string,
  disabled: PropTypes.bool,
  onChangeEvent: PropTypes.func,
  radioOptions: PropTypes.array,
  dropdownOptions: PropTypes.array,
  subtitle: PropTypes.string,
  error: PropTypes.string
};

const mapStateToProps = state => state;

export default connect(
  mapStateToProps,
  dispatch => ({dispatch})
)(CustomInput);
