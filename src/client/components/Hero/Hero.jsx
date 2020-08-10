import React from "react";
import PropTypes from "prop-types";
import * as images from "./../../images";
import CONSTANTS from "./../../constants/constants";
import "./Hero.component.scss";

const Hero = props => {
  return (
    <div className="c-Hero">
      <div className="row">
        <div className="col c-Hero__tag-line-container">
          <div className="c-Hero__tag-line">{CONSTANTS.LOGIN.LANDING_PAGE_TEXT}</div>
          <div className="c-Hero__register-btn btn btn-primary no-border-radius" href={props.registerRedirectLink}>{CONSTANTS.LOGIN.REGISTER_TEXT}</div>
        </div>
        <div className="col">
          <img className="c-Hero__introImage" src={images[CONSTANTS.LOGIN.IMAGE_WALMART_INTRO]} />
        </div>
      </div>
    </div>
  );
};

Hero.propTypes = {
  registerRedirectLink: PropTypes.string
};

export default Hero;
