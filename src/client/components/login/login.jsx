import React from "react";
import { connect } from "react-redux";
import LoginHeader from "../custom-components/headers/login-header";
import Hero from "../Hero";
import TilesContainer from "../TilesContainer";
import LoginFaq from "./../LoginFaq";
import Footer from "../Footer";
import Http from "../../utility/Http";
import loginConfig from "./../../config/contentDescriptors/landingPageTiles";
import "../../styles/login/login.scss";
import mixpanel from "../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../constants/mixpanelConstants";
import CONSTANTS from "../../constants/constants";

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      registerRedirectLink: "/api/falcon/register",
      loginConfig: {}
    };
  }

  /* eslint-disable react/no-did-mount-set-state */
  componentDidMount() {
    try {
      this.setState({loginConfig});
      if (!mixpanel.getToken()) {
        Http.get("/api/mixpanelConfig")
        .then(res => {
          mixpanel.initializeMixpanel(res.body.projectToken, res.body.enableTracking);
          mixpanel.trackEvent(MIXPANEL_CONSTANTS.HOME_PAGE_EVENTS.VISIT_HOME_PAGE);
        }).catch(() => mixpanel.initializeMixpanel(CONSTANTS.MIXPANEL.PROJECT_TOKEN));
      } else {
        mixpanel.trackEvent(MIXPANEL_CONSTANTS.HOME_PAGE_EVENTS.VISIT_HOME_PAGE);
      }
      Http.get("/api/loginConfig")
        .then(res => this.setState(state => {
          const stateCloned = {...state};
          let loginConfigResponse;
          try {loginConfigResponse = JSON.parse(res.body);} catch (e) {loginConfigResponse = loginConfig;}
          stateCloned.loginConfig = loginConfigResponse;
          return stateCloned;
        }))
        .catch(() => this.setState({loginConfig}));
    } catch (e) {
      this.setState({loginConfig});
    }
  }

  render() {
    const loginConfigState = this.state.loginConfig;
    return (<div className="login-container view-container">
              <LoginHeader/>
              <Hero />
              {
                loginConfigState && Object.keys(loginConfigState).length > 0 &&
                <React.Fragment>
                  <TilesContainer tiles={loginConfigState.TILES}/>
                  <LoginFaq faq={loginConfigState.FAQ}/>
                </React.Fragment>
              }
              {/* TODO below commented until better communication modes available this needs to be uncommented at a later stage */}
              {/* <ContactUsPrompt /> */}
              <Footer />
            </div>);
  }
}

Login.propTypes = {};

const mapStateToProps = state => state;

export default connect(
  mapStateToProps,
  dispatch => ({ dispatch })
)(Login);
