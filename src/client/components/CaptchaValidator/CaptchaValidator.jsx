import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import Http from "../../utility/Http";
import ReCAPTCHA from "react-google-recaptcha";
import "./CaptchaValidator.component.scss";

const CaptchaValidator = props => {
  const [captchaConfig, setCaptchaConfig] = useState();
  const [isValid, setValid] = useState(true);
  useEffect(() => {
    !captchaConfig  &&
    Http.get("/api/getCaptchaConfig")
    .then(res => {
      setCaptchaConfig(res.body);
      if(!res.body.enableCaptcha) {
        verifyCaptcha(true);
      }
    }).catch(e => {
      setCaptchaConfig({});
      verifyCaptcha(true);
      console.log(e)
    });
  }, [captchaConfig]);

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
    <div className={`c-CaptchaValidator mx-auto ${!captchaConfig ? " captcha-container loader" : ""}`}>
      {
        captchaConfig && captchaConfig.enableCaptcha &&
            <React.Fragment>
              <ReCAPTCHA sitekey={captchaConfig.sitekey} onChange={verifyCaptcha} onExpired={onExpired}/>
              <small className={`form-text custom-input-help-text text-danger text-center`}>
                {props.error}
              </small>
            </React.Fragment>
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
