import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "../../styles/user-registration/bootstrap-input.scss";


class BootstrapInput extends React.Component {

  constructor (props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange(e, inputId) {
    this.props.onChangeEvent(e, inputId);
  }

  render() {
    return (
      <div className="bootstrap-input-box form-group">

        <label htmlFor={`${this.props.formId}-${this.props.inputId}-bootstrap-input`}>
          { this.props.label }{this.props.required ? <span className="text-danger">*</span> : <span className="font-italic"> (Optional)</span>}
        </label>

        <input type={this.props.type} className={`form-control form-control-${this.props.inputId} form-control-input no-border-radius`}
          id={`${this.props.formId}-${this.props.inputId}-bootstrap-input`} value={this.props.value} pattern={this.props.pattern} required={this.props.required}
          onChange={ e => { this.onInputChange(e, this.props.inputId); } }/>

      </div>
    );
  }
}

BootstrapInput.propTypes = {
  label: PropTypes.string,
  key: PropTypes.string,
  formId: PropTypes.string,
  inputId: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.string,
  pattern: PropTypes.string,
  onChangeEvent: PropTypes.func
};

const mapStateToProps = state => state;

export default connect(
  mapStateToProps,
  dispatch => ({dispatch})
)(BootstrapInput);
