import React from "react";
import { connect } from "react-redux";
import LoginHeader from "../custom-components/headers/login-header";
import Hero from "../Hero";
import TilesContainer from "../TilesContainer";
import LoginFaq from "./../LoginFaq";
import ContactUsPrompt from "../ContactUsPrompt";
import Footer from "../Footer";
import * as images from "./../../images";
import Http from "../../utility/Http";
import "../../styles/login/login.scss";

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      registerRedirectLink: "/api/falcon/register",
      loginConfig: {}
    };
  }

  componentDidMount() {
    try {
      Http.get("/api/loginConfig")
        .then(res => this.setState(state => {
          const stateCloned = {...state};
          stateCloned.loginConfig = JSON.parse(res.body);
          return stateCloned;
        }));
      // setHelpConfig(JSON.parse(response));
    } catch (e) {console.log(e);}
  }

  render() {
    const loginConfig = this.state.loginConfig;
    return loginConfig && Object.keys(loginConfig).length > 0 &&
            <div className="login-container view-container">
              <LoginHeader/>
              <Hero />
              <TilesContainer tiles={loginConfig.TILES} />
              <LoginFaq faq={loginConfig.FAQ} />
              {/* TODO below commented until better communication modes available this needs to be uncommented at a later stage */}
              {/* <ContactUsPrompt /> */}
              <Footer />
            </div>;
  }
}

Login.propTypes = {};

const mapStateToProps = state => state;

export default connect(
  mapStateToProps,
  dispatch => ({ dispatch })
)(Login);
