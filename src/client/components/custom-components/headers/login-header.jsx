import React from "react";
import { connect } from "react-redux";

import * as images from "./../../../images/index";
import "../../../styles/custom-components/headers/login-header.scss";

class LoginHeader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loginRedirectLink: "/api/falcon/login"
    };
  }

  scrollAction() {
    $("#LoginFAQ").addClass("scrolled");
    setTimeout(() => $("#LoginFAQ").removeClass("scrolled"), 1000);
  }

  render() {

    return (
      <nav className="c-LoginHeader navbar navbar-expand-lg navbar-dark login-header-nav">
        <a className="navbar-brand walmart-brand" href="#">
          <img src={images.WMBlue} />
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsible-header"
          aria-controls="collapsible-header" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"/>
        </button>

        <div className="collapse navbar-collapse navbar-collapsible-header" id="collapsible-header">
          <ul className="navbar-nav ml-auto">
            {/* <li className="nav-item mx-4">
              <a className="nav-link" href="#">Home</a>
            </li> */}
            <li className="nav-item mx-4">
              {/* <Link className="nav-link" to="LoginFAQ" smooth={true} duration={500} activeClass="active" spy={true} offset={-700}>FAQ</Link> */}
              <a className="nav-link" href="#LoginFAQ" onClick={this.scrollAction}>FAQ</a>
            </li>
            <li className="nav-item ml-4 d-flex align-items-center">
              <a className="nav-link btn login-btn" href={this.state.loginRedirectLink} onClick={() => $("a.nav-link.btn.login-btn").addClass("disabled")}>Login</a>
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
