import React from "react";
import { connect } from "react-redux";
import "../../styles/login/login.scss";
import LoginHeader from "../custom-components/headers/login-header";

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      registerRedirectLink: "/api/falcon/register"
    };
  }

  render() {
    return (
      <div className="login-container view-container">
        <LoginHeader/>
        <div className="row mt-5 tag-line-row">
          <div className="col">
            <div className="product-tag-line text-center text-white mx-auto mt-5">Helping you protect your brand on Walmart</div>
          </div>
        </div>
        <div className="row mt-5 registration-row">
          <div className="col text-center">
            <a className="register-btn btn btn-primary no-border-radius px-4" href={this.state.registerRedirectLink}> Register Now </a>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {};

const mapStateToProps = state => state;

export default connect(
  mapStateToProps,
  dispatch => ({ dispatch })
)(Login);
