import React from "react";
import CONSTANTS from "./../../constants/constants";
import * as images from "./../../images";
import "./ContactUsPrompt.component.scss";

// eslint-disable-next-line no-unused-vars
const ContactUsPrompt = props => {
  return (
    <div className="c-ContactUsPrompt" style={{backgroundImage: `url(${images.ContactUsBG}`, backgroundSize: "100%", backgroundRepeat: "no-repeat", backgroundPosition: "left center"}}>
      <span>{CONSTANTS.LOGIN.CONTACTTEXT}</span>
      <a href={`mailto:${CONSTANTS.LOGIN.CONTACTEMAIL}`}>{CONSTANTS.LOGIN.CONTACTEMAIL}</a>
    </div>
  );
};

export default ContactUsPrompt;
