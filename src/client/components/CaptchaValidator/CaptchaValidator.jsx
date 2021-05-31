import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import CustomInput from "../custom-components/custom-input/custom-input";
import {Refresh} from "../../images";
import Http from "../../utility/Http";
import "./CaptchaValidator.component.scss";

const CaptchaValidator = props => {
  const [captchValue, setcaptchValue] = useState(null);
  const [userInput, setUserInput] = useState(null);
  const [error, setError] = useState("");
  const [captchImage, setCaptchImage] = useState(null);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    !captchImage && generateCaptch();
  });

  const generateCaptch = () => {
    setLoader(true);
    Http.get("/api/generateCaptcha")
      .then(res => {
        setCaptchImage(res.body.data);
        setcaptchValue(res.body.text);
      }).catch(e => console.log(e))
      .finally(() => {
        setLoader(false);
        props.onSubmit && props.parentRef[props.onSubmit](false, "");
      });
  };

  const onClickHandler = e => {
    if (userInput === captchValue) {
      setError("");
      props.onSubmit && props.parentRef[props.onSubmit](true, "");
    } else {
    setError(props.errorMessage || "Please enter valid captcha");
    props.onSubmit && props.parentRef[props.onSubmit] && props.parentRef[props.onSubmit](false, props.errorMessage || "Please enter valid captcha");
    }
  };

  return (
    <div className="c-CaptchaValidator mx-auto">
      <div>
      {
        captchImage &&
            <div className={`row imageContainer mx-3 my-3${loader ? " loader" : ""} `}>
              <img className="col-10" src={`data:image/svg+xml;utf8,${encodeURIComponent(captchImage)}`}/>
              <img onClick={generateCaptch} className = "d-inline-block refresh col-2 h-10 ml-auto" src={Refresh}/>
            </div>
      }
      </div>
      <div className="row mx-3 my-auto">
        <CustomInput type="text" error={error} className="col-8" label={props.captchaFieldName || "Please enter captcha text"} required onChange={e => setUserInput(e.target.value)} />
        <button className="d-inline-block btn btn-sm btn-primary ml-2 col-4" type="button" onClick={onClickHandler}>{props.submitButtonLabel || "Submit"} </button>
      </div>
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
