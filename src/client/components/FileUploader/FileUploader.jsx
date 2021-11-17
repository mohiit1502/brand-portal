import React from "react";
import PropTypes from "prop-types";
import "./FileUploader.component.scss";
import Tooltip from "../custom-components/tooltip/tooltip";
import * as images from "../../images";
import ProgressBar from "../custom-components/progress-bar/progress-bar";

/* eslint-disable complexity, no-nested-ternary */
const FileUploader = props => {
  const cancelHandler = props.onCancel && props.parentRef[props.onCancel] ? props.cancelHandlerArg ? () => props.parentRef[props.onCancel](props.cancelHandlerArg) : props.parentRef[props.onCancel] : null;
  const tooltipContent = {
    webformDocContent: <div>
      <ol className="m-0 p-0">
        <ul className="m-0 pl-3 text-left font-size-12">
          <li>Please attach supporting documents in .doc,.pdf,.csv format. The file should be less than 7MB</li>
        </ul>
      </ol>
    </div>,
    businessDocContent: <div>
      <ol className="m-0 p-0">
        <ul className="m-0 pl-3 text-left font-size-12">
          <li>Upload an official copy of Business Registration Certificate</li>
          <li>Supported Documents: PDF, DOC, DOCX | Max : 7MB</li>
        </ul>
      </ol>
    </div>,
    additionalDocContent: <div>
      <ol className="m-0 p-0">
        <ul className="m-0 pl-3 text-left font-size-12">
          <li>Upload IP Registration Documents or Letter of Authorization</li>
          <li>Supported Documents: PDF, DOC, DOCX | Max : 7MB</li>
        </ul>
      </ol>
    </div>
  };

  return (
    <div className={`c-FileUploader form-row primary-file-upload mb-3${props.containerClasses ? ` ${  props.containerClasses}` : ""}`}>
      <div className="col">
        <div className="file-upload-title mb-2">
          {props.label} <Tooltip placement={"right"}
            content={tooltipContent[props.tooltipContentKey]}
            icon={images[props.icon]}/>
        </div>
        {
          !props.uploading && !props.id &&
          <>
            <label
              className={`btn btn-sm btn-primary upload-btn my-2${props.disabled ? " disabled" : ""}`}>
              {props.buttonText}
              <input type="file" className="d-none" onChange={props.onChange} onClick={e => e.target.value = null} accept={props.accept}
                disabled={props.disabled}/>
            </label>
            {props.error && <small className="d-block error">{props.error}</small>}
          </>
        }
        {props.uploading && !props.id && <ProgressBar filename={props.filename} uploadPercentage={props.uploadPercentage}/>}
        {!props.uploading && props.id &&
          <div className="col-6 field-container position-relative">
            <div className={`uploaded-file-label form-control mb-2`}>
              <span className="d-block overflow-auto">{props.filename}</span>
            </div>
            <span aria-hidden="true" className="cancel-file-selection-btn position-absolute cursor-pointer"
                onClick={cancelHandler}>&times;</span>
          </div>
        }
      </div>
    </div>
  );
};

FileUploader.propTypes = {
  buttonText: PropTypes.string,
  cancelHandlerArg: PropTypes.string,
  containerClasses: PropTypes.string,
  disabled: PropTypes.bool,
  filename: PropTypes.string,
  icon: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  parentRef: PropTypes.object,
  setTooltipContent: PropTypes.func,
  tooltipContentKey: PropTypes.string,
  uploading: PropTypes.bool,
  uploadPercentage: PropTypes.number
};

export default FileUploader;
