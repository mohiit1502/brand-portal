import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import walmartLogo from "../../assets/images/wm-white-logo.png";
import "../../styles/login/login-header.scss";

class LoginHeader extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <nav className="navbar navbar-expand-lg navbar-dark login-header-nav">
        <a className="navbar-brand walmart-brand" href="#">
          <img src={walmartLogo} />
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsible-header"
                aria-controls="collapsible-header" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"/>
        </button>

        <div className="collapse navbar-collapse navbar-collapsible-header" id="collapsible-header">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item mx-4">
              <a className="nav-link" href="#">Home</a>
            </li>
            <li className="nav-item mx-4">
              <a className="nav-link" href="#">FAQ</a>
            </li>
            <li className="nav-item ml-4 d-flex align-items-center">
              <a className="nav-link btn btn-navy-blue login-btn" href={this.props.loginRedirect}>Login</a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

LoginHeader.propTypes = {
  loginRedirect: PropTypes.string
};

const mapStateToProps = state => {
  return {
    loginRedirect: state.login.loginRedirect
  };
};

export default connect(mapStateToProps, dispatch => ({dispatch}))(LoginHeader);
