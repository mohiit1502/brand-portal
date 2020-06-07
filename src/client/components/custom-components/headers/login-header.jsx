import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import walmartLogo from "../../../images/wm-white-logo.png";
import "../../../styles/headers/login-header.scss";

class LoginHeader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loginRedirectLink: "/api/login/falcon-redirect"
    };
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
              <a className="nav-link btn btn-navy-blue login-btn" href={this.state.loginRedirectLink}>Login</a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

LoginHeader.propTypes = {};

const mapStateToProps = state => state;

export default connect(mapStateToProps, dispatch => ({dispatch}))(LoginHeader);
