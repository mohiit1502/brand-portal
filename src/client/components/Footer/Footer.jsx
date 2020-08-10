import React from "react";
import * as images from "./../../images";
import CONSTANTS from "./../../constants/constants";
import "./Footer.component.scss";

const Footer = props => {
  return (
    <div className="c-Footer">
      <div className="row">
        <div className="col">
          <div className="c-Footer__logoSocialContainer">
            <img className="c-Footer__wmWhiteLogo" src={images.WMWhite} />
            <span className="c-Footer__logoText">Brand Portal</span>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="c-Footer__copyrightContainer">
            <span className="c-Footer__copyrightText float-left">{CONSTANTS.LOGIN.COPYRIGHTTEXT}</span>
            <a target="_blank" href={CONSTANTS.LOGIN.PRIVACYURL} className="c-Footer__privacyNav float-right">{CONSTANTS.LOGIN.PRIVACYTEXT}</a>
          </div>
        </div>
      </div>
    </div>
  );
};

Footer.propTypes = {

};

export default Footer;
