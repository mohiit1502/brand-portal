import React from "react";
import { connect } from "react-redux";
import LoginHeader from "../custom-components/headers/login-header";
import Hero from "../Hero";
import TilesContainer from "../TilesContainer";
import LoginFaq from "./../LoginFaq";
import ContactUsPrompt from "../ContactUsPrompt";
import Footer from "../Footer";
import loginConfig from "./../../config/contentDescriptors/landingPageTiles";
import "../../styles/login/login.scss";

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
        <Hero registerRedirectLink={this.state.registerRedirectLink} />
        <TilesContainer tiles={loginConfig.TILES} />
        <LoginFaq faq={loginConfig.FAQ} />
        <ContactUsPrompt />
        <Footer />
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
