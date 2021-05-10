import React from "react";
import PropTypes from "prop-types";
import "./WebFormHomePage.component.scss";

const WebFormHomePage = props => {
  return (
    <div className="c-WebFormHomePage">
      <div className="row h3 header">
        Walmart IP Services
      </div>
      <div className="row h4 header ml-3">
        Submit IP claims
      </div>
      {/* TODO: adding content */}
      <div className="d-inline-block">
          <p className="ml-3 mr-5 pl-3 pr-5">Helping you protect your intellectual property on Walmart.com</p>
          <div style={{height: "500px", width: "400px"}}>
          Helping you protect your intellectual property on Walmart.com
          </div>
      </div>
      <div className="row justify-content-end">
        <button type="submit" style={{maxWidth: "200px", right: "5rem"}} className="btn btn-sm btn-primary submit-btn col-5 px-3 mx-3">
          Submit IP Claim
        </button>
      </div>
    </div>
  );
};

WebFormHomePage.propTypes = {

};

export default WebFormHomePage;
