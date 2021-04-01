import React from "react";
import { connect } from "react-redux";
import LoginHeader from "../custom-components/headers/login-header";
import Hero from "../Hero";
import TilesContainer from "../TilesContainer";
import LoginFaq from "./../LoginFaq";
import ContactUsPrompt from "../ContactUsPrompt";
import Footer from "../Footer";
import Http from "../../utility/Http";
import loginConfig from "./../../config/contentDescriptors/landingPageTiles";
import "../../styles/login/login.scss";
import Mixpanel from "../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../constants/MixPanelConsants";

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
          let loginConfigResponse;
          try {loginConfigResponse = JSON.parse(res.body);} catch (e) {loginConfigResponse = loginConfig;}
          stateCloned.loginConfig = loginConfigResponse;
          return stateCloned;
        }))
        .catch(e => this.setState({loginConfig}));
    } catch (e) {
      this.setState({loginConfig});
      console.log(e);
    }
    Mixpanel.trackEvent(MIXPANEL_CONSTANTS.HOME_PAGE_EVENTS.VISIT_HOME_PAGE);
  }

  render() {
    const loginConfig = this.state.loginConfig;
    return <div className="login-container view-container">
              <LoginHeader/>
              <Hero />
              {
                loginConfig && Object.keys(loginConfig).length > 0 &&
                <React.Fragment>
                  <TilesContainer tiles={loginConfig.TILES}/>
                  <LoginFaq faq={loginConfig.FAQ}/>
                </React.Fragment>
              }
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
