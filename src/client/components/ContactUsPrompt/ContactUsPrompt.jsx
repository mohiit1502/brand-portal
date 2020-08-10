import React from "react";
import {Link} from "react-router-dom";
import CONSTANTS from "./../../constants/constants";
import "./ContactUsPrompt.component.scss";

// eslint-disable-next-line no-unused-vars
const ContactUsPrompt = props => {
  return (
    <div className="c-ContactUsPrompt">
      <span>{CONSTANTS.LOGIN.CONTACTTEXT}</span>
      <a href={`mailto:${CONSTANTS.LOGIN.CONTACTEMAIL}`}>{CONSTANTS.LOGIN.CONTACTEMAIL}</a>
    </div>
  );
};

export default ContactUsPrompt;
