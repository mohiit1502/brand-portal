import React from "react";
import PropTypes from "prop-types";
import "./WebFormWorkflowDecider.component.scss";
import { WebFormHomePage } from "..";
import HomeHeader from "../custom-components/headers/home-header";
import Footer from "../Footer";

const WebFormWorkflowDecider = props => {
  return (
    <div className="c-WebFormWorkflowDecider">
      <HomeHeader isWebForm={true}/>
      <WebFormHomePage/>
      <Footer/>
    </div>
  );
};

WebFormWorkflowDecider.propTypes = {

};

export default WebFormWorkflowDecider;
