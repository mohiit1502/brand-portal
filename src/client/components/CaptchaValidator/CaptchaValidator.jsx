import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import CustomInput from "../custom-components/custom-input/custom-input";
import {Refresh} from "../../images";
import Http from "../../utility/Http";
import ReCAPTCHA from "react-google-recaptcha";
import "./CaptchaValidator.component.scss";

const CaptchaValidator = props => {
  const [captchaConfig, setCaptchaConfig] = useState(null);
  const [isValid, setValid] = useState(true);
  useEffect(() => {
    !captchaConfig  &&
    Http.get("/api/getCaptchaConfig")
    .then(res => {
      setCaptchaConfig(res.body);
    }).catch(e => console.log(e));
  });

  const verifyCaptcha = res => {
    if (res) {
      setValid(true);
      const dummyCaptchaEvent = {
        target: {
          value: true
        }
      };
      props.onChange && props.onChange(dummyCaptchaEvent, props.inputId);
    }
  };
  const onExpired = res => {
    setValid(false);
    const dummyCaptchaEvent = {
      target: {
        value: false
      }
    };
    props.onChange && props.onChange(dummyCaptchaEvent, props.inputId);
  };

  return (
    <div className="c-CaptchaValidator mx-auto">
      {
        captchaConfig && captchaConfig.enableCaptcha &&
            <ReCAPTCHA sitekey={captchaConfig.sitekey} onChange={verifyCaptcha} onExpired={onExpired}/>
      }
    </div>
  );
};

CaptchaValidator.propTypes = {
  captchaFieldName: PropTypes.string,
  error: PropTypes.string,
  onSubmit: PropTypes.func,
  submitButtonLabel: PropTypes.string
};

export default CaptchaValidator;
