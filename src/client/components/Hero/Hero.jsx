import React from "react";
import * as images from "./../../images";
import CONSTANTS from "./../../constants/constants";
import "./Hero.component.scss";
import LaptopImage from "./../../images/laptopImage.jpg"

const Hero = props => {
  return (
    <div className="c-Hero">
      <div className="row">
        <div className="col c-Hero__left-container py-5 align-content-lg-center">
            <div className="c-Hero__tag-line-container align-content-lg-center py-5 mx-5 my-3">
              <div className="c-Hero__tag-line px-5 mx-5">{CONSTANTS.LOGIN.LANDING_PAGE_TEXT}</div>
              <div className="button-con">
              <a className="c-Hero__register-btn btn btn-primary px-5" href={CONSTANTS.URL.REGISTER_REDIRECT}>{CONSTANTS.LOGIN.REGISTER_TEXT}</a>
            </div>
            </div>
        </div>
        <div className="col c-Hero__right-container">
          {/*<img className="c-Hero__introImage" src={LaptopImage} />*/}
        </div>
      </div>
    </div>
  );
};

export default Hero;
