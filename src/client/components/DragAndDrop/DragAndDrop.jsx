import React, { useRef, useState} from "react";
import PropTypes from "prop-types";
import {FileUploaded} from "../../images/index";
import "./DragAndDrop.component.scss";

const DragAndDrop = props => {
    const fileInputRef = useRef();
    const [errorMessage, setErrorMessage] = useState("");
    const [inputFile, setInputFile] = useState(null);

    const validateFile = file => { //todo: move to validationUtil
      if (file.size > (props.maxSize || 5000000) || file.name.split(".").pop() !==  (props.fileType || "xlsx")) {
        return false;
      }
      return true;
    };

    const handleFiles = files => {
      if (files && validateFile(files[0])) {
          setInputFile(files[0]);
          //setErrorMessage("");
          props.onChange && props.onChange(files && files[0], props.inputId);
      } else {
          setInputFile(null);
          //setErrorMessage(props.error || "Enter Valid file");
          props.onChange && props.onChange(files && files[0], props.inputId, props.errorMessage);
      }
        //todo
    };

    const fileDrop = e => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length) {
            handleFiles(files);
        }
    };

    const filesSelected = () => {
        if (fileInputRef.current.files.length) {
            handleFiles(fileInputRef.current.files);
        }
    };

    const fileInputClicked = () => {
        fileInputRef.current.click();
    };

    const removeFile = () => {
        setInputFile(null);
        //setErrorMessage("");
        fileInputRef.current.files = null;
        props.onChange && props.onChange(null, props.inputId);
    };

    const handleDrag = e => {
        e.preventDefault();
    };

    return (
        <React.Fragment>
            <div className={`c-DragAndDrop ${!props.display ? "invisible" : ""}`}>
                    <div className={`drop-container mx-auto ${inputFile ? "scale-down" : ""}`}
                      onDragOver={handleDrag}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={fileDrop}
                      onClick={fileInputClicked}
                    >
                    {
                        !inputFile ?
                        <div>
                            <div className="drop-message">
                                <div className="upload-icon d-inline-block" />
                                <div className="drag-and-drop-text ml-2 d-inline-block">
                                {props.dragAndDropText}
                                </div>
                                <button className="btn btn-primary ml-3 d-inline-block" type="button" onClick={() => {}}>{props.UploadText}</button>
                            </div>
                            <input
                            ref={fileInputRef}
                            className="file-input"
                            type="file" accept={props.inputType || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}
                            onChange={filesSelected}
                            />
                        </div> : <img className="uploaded-image" src ={FileUploaded} />
                    }
                    </div>
                        {
                            inputFile &&
                                <div className="file-display-container  font-weight-bold mx-auto" key={inputFile.name}>
                                    <span className={`file-name ${inputFile.invalid ? "file-error" : ""}`}>{inputFile.name}</span>
                                    <div className="file-remove ml-3" onClick={() => removeFile(inputFile.name)}>x</div>
                                </div>
                        }
                        {
                            props.error && <span className="file-error-message">{ props.error}</span>
                        }
            </div>
        </React.Fragment>
        );
};

DragAndDrop.propTypes = {

};

export default DragAndDrop;
