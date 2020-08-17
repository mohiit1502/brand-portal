import React from "react";
import * as images from "./../../images";
import CONSTANTS from "./../../constants/constants";
import "./Hero.component.scss";

const Hero = props => {
  return (
    <div className="c-Hero">
      <div className="row">
        <div className="col c-Hero__tag-line-container">
          <div className="c-Hero__tag-line">{CONSTANTS.LOGIN.LANDING_PAGE_TEXT}</div>
          <a className="c-Hero__register-btn btn btn-primary no-border-radius" href={CONSTANTS.URL.REGISTER_REDIRECT}>{CONSTANTS.LOGIN.REGISTER_TEXT}</a>
        </div>
        <div className="col">
          <img className="c-Hero__introImage" src={images[CONSTANTS.LOGIN.IMAGE_WALMART_INTRO]} />
        </div>
      </div>
    </div>
  );
};

export default Hero;