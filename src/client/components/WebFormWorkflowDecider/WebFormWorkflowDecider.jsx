/* eslint-disable filenames/match-regex */
import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {dispatchMetadata} from "../../actions/content/content-actions";
import { WebFormHomePage } from "..";
import HomeHeader from "../custom-components/headers/home-header";
import Footer from "../Footer";
import WebForm from "../WebForm/WebForm";
import FORMFIELDCONFIG from "../../config/formsConfig/form-field-meta";
import "./WebFormWorkflowDecider.component.scss";

const WebFormWorkflowDecider = props => {
  const initMetaData = () => {
    try {
      props.dispatchMetadata(FORMFIELDCONFIG);
    } catch (e) {
      console.log(e);
    }
  };
  initMetaData();
  return (
    <div className="c-WebFormWorkflowDecider">
      <HomeHeader isWebForm={true}/>
      {/* <WebFormHomePage/> */}
      <WebForm/>
      <div className="fixed-bottom">
        <Footer/>
      </div>
    </div>
  );
};

WebFormWorkflowDecider.propTypes = {

};
const mapDispatchToProps = {
  dispatchMetadata
};
export default connect(null, mapDispatchToProps)(WebFormWorkflowDecider);
