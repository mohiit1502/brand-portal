import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "../../styles/progress-bar/progress-bar.scss";

class ProgressBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="progress">
        <div className="progress-bar-text">{`Uploading ${this.props.filename}... ${this.props.uploadPercentage} %`}</div>
        <div className="progress-bar progress-bar-animated" role="progressbar" style={{width: `${this.props.uploadPercentage}%`}} aria-valuenow={this.props.uploadPercentage}
             aria-valuemin="0" aria-valuemax="100" />
      </div>
    );
  }
}

ProgressBar.propTypes = {
  filename: PropTypes.string,
  uploadPercentage: PropTypes.number
};

export  default  connect()(ProgressBar);

