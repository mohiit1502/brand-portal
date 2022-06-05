import React from "react";
import PropTypes from "prop-types";
import "./FileUploader.component.scss";
import Tooltip from "../custom-components/tooltip/tooltip";
import * as images from "../../images";
import ProgressBar from "../custom-components/progress-bar/progress-bar";
import {ItemList} from "../index";

/* eslint-disable complexity, no-nested-ternary */
const FileUploader = props => {
  const formToDocMapper = {
    companyreg: {
      sectionName: "org",
      attachmentKey: "businessRegistrationDocList"
    },
    brandreg: {
      sectionName: "brand",
      attachmentKey: "additionalDocList"
    }
  };
  const cancelHandler = props.onCancel && props.parentRef[props.onCancel] ? props.cancelHandlerArg ? () => props.parentRef[props.onCancel](props.cancelHandlerArg) : props.parentRef[props.onCancel] : null;
  const tooltipContent = {
    webformDocContent: <div>
      <ol className="m-0 p-0">
        <ul className="m-0 pl-3 text-left font-size-12">
          <li>Please attach supporting documents in .doc, .pdf, .csv, .excel or image formats. The file should be less than 7MB</li>
          <li>Filenames should contain English alphanumeric characters only.</li>
        </ul>
      </ol>
    </div>,
    businessDocContent: <div>
      <ol className="m-0 p-0">
        <ul className="m-0 pl-3 text-left font-size-12">
          <li>Supported File Types: pdf, doc, docx, xls, xlsx, csv, jpeg, png</li>
          <li>Maximum file size: 7 MB</li>
          <li>Filenames should contain English alphanumeric characters only.</li>
        </ul>
      </ol>
    </div>,
    additionalDocContent: <div>
      <ol className="m-0 p-0">
        <ul className="m-0 pl-3 text-left font-size-12">
          <li>Upload IP Registration Documents or Letter of Authorization</li>
          <li>Supported File Types: pdf, doc, docx, xls, xlsx, csv, jpeg, png</li>
          <li>Maximum file size: 7 MB</li>
          <li>Filenames should contain English alphanumeric characters only.</li>
        </ul>
      </ol>
    </div>,
    claimDocContent: <div>
      <ol className="m-0 p-0">
        <ul className="m-0 pl-3 text-left font-size-12">
          <li>The maximum no. of files that can be uploaded are 3</li>
          <li>Supported File Types: pdf, doc, docx, xls, xlsx, csv, jpeg, png</li>
          <li>Maximum file size: 7 MB</li>
          <li>Filenames should contain English alphanumeric characters only.</li>
        </ul>
      </ol>
    </div>,
    orderNumberContent: <div>
      <ol className="m-0 p-0">
        <ul className="m-0 pl-3 text-left font-size-12">
          {/*<li>Upload IP Registration Documents or Letter of Authorization</li>*/}
          <li>Supported File Types: pdf, doc, docx, xls, xlsx, csv, jpeg, png</li>
          <li>Maximum file size: 7 MB</li>
          <li>Filenames should contain English alphanumeric characters only.</li>
        </ul>
      </ol>
    </div>
  };
  const itemList = props.parentRef && props.parentRef.state.form.docList;
  const formIdentifier = props.formId;
  const sectionObject = props.company && props.company.onboardingDetails && props.company.onboardingDetails[formToDocMapper[formIdentifier].sectionName];
  let uploadedAttachments =  sectionObject && sectionObject[formToDocMapper[formIdentifier].attachmentKey];
  uploadedAttachments = uploadedAttachments && uploadedAttachments.filter(doc => doc.createTS);
  return (
    <div className={`c-FileUploader form-row primary-file-upload mb-3${props.containerClasses ? ` ${  props.containerClasses}` : ""}`}>
      <div className="col">
        <div className="file-upload-title mb-2">
          {props.label} <Tooltip placement={"right"}
            content={tooltipContent[props.tooltipContentKey]}
            icon={images[props.icon]}/>
        </div>
        {uploadedAttachments && uploadedAttachments.length > 0 && props.user && props.user.profile && props.user.profile.context=="edit"
         && <div className="mb-3">
          <b>Uploaded attachments: </b>
          <span>{uploadedAttachments.map(obj => obj.documentName).join(", ")}</span>
        </div>}
        {
          (props.multiple || (!props.uploading && !props.id)) &&
          <>
            <label
              className={`btn btn-sm btn-outline-primary upload-btn my-2${props.disabled ? " disabled" : ""}`}>
              {props.buttonText}
              <input type="file" className="d-none" onChange={props.onChange} onClick={e => e.target.value = null}
                     disabled={props.disabled} accept={props.accept}/>
            </label>
            {props.error && <small className="d-block error">{props.error}</small>}
          </>
        }

          <ItemList name={props.filename} cancelHandler={cancelHandler} multiple={props.multiple} itemList={itemList} uploading={props.uploading}
                    filename={props.filename} uploadPercentage={props.uploadPercentage}/>

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
