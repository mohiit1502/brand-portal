import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "../../styles/custom-input/custom-input.scss";

class CustomInput extends React.Component {

  constructor (props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);

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
      onChangeEvent: this.props.onChangeEvent
    };
  }

  onInputChange(evt, key) {
    if (evt && evt.target) {

      this.setState({
        value: evt.target.value
      });
    }
    this.state.onChangeEvent(evt, key);
  }

  havePropsChanged(prevProps, newProps) {
    const changeableProps = ["label", "key", "formId", "inputId", "type", "required", "value", "pattern", "disabled"];
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

  componentDidUpdate(prevProps) {
    const changedProps = this.havePropsChanged(prevProps, this.props);

    if (changedProps) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(changedProps);
    }

  }

  render () {
    return (
      <div className="form-group custom-input-form-group">

        <input type={this.state.type} className={`form-control form-control-${this.state.inputId} custom-input-element`}
          id={`${this.state.formId}-${this.state.inputId}-custom-input`} value={this.state.value}
          pattern={this.state.pattern} required={this.state.required} disabled={this.state.disabled}
          onChange={ e => { this.onInputChange(e, this.state.inputId); } }/>
        {this.state.disabled}
        <label className="custom-input-label" htmlFor={`${this.state.formId}-${this.state.inputId}-custom-input`}>
          <div className="label-upper-bg position-absolute w-100 h-50 d-block"/>
          <div className="label-lower-bg position-absolute w-100 h-50 d-block"/>
          <span className="label-text"> { this.state.label } </span>
        </label>

        {/*TODO: For future error messages*/}
        {/*<small className="form-text custom-input-help-text text-muted">We'll never share your email with anyone else.</small>*/}
      </div>
    );
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
  onChangeEvent: PropTypes.func
};

const mapStateToProps = state => state;

export default connect(
  mapStateToProps,
  dispatch => ({dispatch})
)(CustomInput);
