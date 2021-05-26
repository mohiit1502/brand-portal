import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import CustomInput from "../custom-components/custom-input/custom-input";
import "./CaptchValidator.component.scss";
import { Button } from "bootstrap";

const CaptchValidator = props => {

  const [canvasRef, setcanvasRef] = useState(null);
  const [captchValue, setcaptchValue] = useState(null);
  const [userInput, setUserInput] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    canvasRef && generateCaptch();

  }, [canvasRef]);

  const generateCaptch = () => {
    const canvas = canvasRef;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const alphaNumerics = ("A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,0,1,2,3,4,5,6,7,8,9").split(",");
    const totalCount = 5;
    let xCord = 15, yCord = 100;
    ctx.font = "40px Arial";
    ctx.fillStyle = "#006799";
    let currentCaptchString = "";
    for (let i = 0; i < totalCount; i++) {
      const sIndex = Math.floor(Math.random() * alphaNumerics.length);
      currentCaptchString = `${currentCaptchString}${alphaNumerics[sIndex]}`;
      ctx.strokeText(alphaNumerics[sIndex], xCord, yCord);
      xCord += 40;
    }
    setcaptchValue(currentCaptchString);
  };

  const onClickHandler = e => {
    if (userInput === captchValue) {
      setError("");
    } else {
    setError("Enter valid captch");
    }
  };

  return (
    <div className="c-CaptchValidator">
      <div className="imageContainer mx-3 my-3" >
        <canvas ref={input => setcanvasRef(input)} className="row w-100"/>
        <img height={20} width={20} onClick={generateCaptch} className = "d-inline-block refresh" src="https://i5.walmartimages.com/dfw/63fd9f59-1e2a/a6d38100-63e9-4025-8c8c-b0dda8698221/v1/801d665da4b5bb8f7f49e679f1850b73.svg" />
      </div>
      {/* <span className = "d-inline-block"><img src=""/></span> */}
      <div className="row mx-3 mt-3 mb-1">
        <CustomInput type="text" error={error} className="col-9" label="Please enter captch text" required onChange={e => setUserInput(e.target.value)} />
        <button className="d-inline-block btn btn-sm btn-primary ml-2 col-3" type="button" onClick={onClickHandler}>Submit </button>
      </div>
    </div>
  );
};

CaptchValidator.propTypes = {

};

export default CaptchValidator;
