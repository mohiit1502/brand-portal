/* eslint-disable filenames/match-regex */
import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {dispatchMetadata} from "../../actions/content/content-actions";
import { WebformLandingPage } from "..";
import HomeHeader from "../custom-components/headers/home-header";
import Footer from "../Footer";
import Webform from "../Webform/Webform";
import FORMFIELDCONFIG from "../../config/formsConfig/form-field-meta";
import "./WebformWorkflowDecider.component.scss";

const WebformWorkflowDecider = props => {
  const initMetaData = () => {
    try {
      props.dispatchMetadata(FORMFIELDCONFIG);
    } catch (e) {
      console.log(e);
    }
  };
  initMetaData();
  return (
    <div className="c-WebformWorkflowDecider">
      <HomeHeader isWebform={true}/>
      {/* <WebformLandingPage/> */}
      <Webform/>
      <div className="fixed-bottom">
        <Footer/>
      </div>
    </div>
  );
};

WebformWorkflowDecider.propTypes = {

};
const mapDispatchToProps = {
  dispatchMetadata
};
export default connect(null, mapDispatchToProps)(WebformWorkflowDecider);
