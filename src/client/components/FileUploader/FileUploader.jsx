import React, {useState} from "react";
import PropTypes from "prop-types";
import "./FileUploader.component.scss";
import Tooltip from "../custom-components/tooltip/tooltip";
import * as images from "../../images";
import ProgressBar from "../custom-components/progress-bar/progress-bar";

const FileUploader = props => {

  const [tooltipContent, setTooltipContent] = useState({
    "businessDocContent": <div>
      <ol className="m-0 p-0">
        <ul className="m-0 pl-3 text-left font-size-12">
          <li>Upload an official copy of Business Registration Certificate</li>
          <li>Supported Documents: PDF, DOC, DOCX | Max : 8MB</li>
        </ul>
      </ol>
    </div>,
    "additionalDocContent": <div>
      <ol className="m-0 p-0">
        <ul className="m-0 pl-3 text-left font-size-12">
          <li>Upload IP Registration Documents or Letter of Authorization</li>
          <li>Supported Documents: PDF, DOC, DOCX | Max : 8MB</li>
        </ul>
      </ol>
    </div>
  })

  return (
    <div className="c-FileUploader form-row primary-file-upload mb-3">
      <div className="col">
        <div className="file-upload-title mb-2">
          {props.label} <Tooltip placement={"right"}
                                 content={tooltipContent[props.content]}
                                 icon={images[props.icon]}/>
        </div>
        {
          !props.uploading && !props.id &&
          <label
            className={`btn btn-sm btn-primary upload-btn mb-2${props.disabled ? " disabled" : ""}`}>
            Upload
            <input type="file" className="d-none" onChange={props.parentRef[props.onChange]}
                   disabled={props.disabled}/>
          </label>
        }
        {props.uploading && !props.id && <ProgressBar filename={props.filename} uploadPercentage={props.uploadPercentage}/>}
        {!props.uploading && props.id &&
          <div className={`uploaded-file-label form-control mb-2`}>{props.filename}
            <span aria-hidden="true" className="cancel-file-selection-btn float-right cursor-pointer"
                  onClick={props.parentRef[props.cancelSelection]}>&times;</span>
          </div>
        }
      </div>
    </div>
  );
};

FileUploader.propTypes = {};

export default FileUploader;
