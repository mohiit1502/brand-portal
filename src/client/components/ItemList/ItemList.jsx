import React from "react";
import PropTypes from "prop-types";
import "./ItemList.component.scss";
import ProgressBar from "../custom-components/progress-bar/progress-bar";

const ItemList = props => {

  const {name, cancelHandler, itemList, multiple} = props;

  const getItem =  (name, index) => {
    return <div className="c-Item col-6 field-container position-relative" id={`c-item-${index}`}>
      <div className={`uploaded-file-label form-control mb-2`}>
        <span className="d-block overflow-auto">{name}</span>
      </div>
      <span aria-hidden="true" className="cancel-file-selection-btn position-absolute cursor-pointer"
            onClick={docKey => cancelHandler(docKey, index) || (()=>{})}>&times;</span>

    </div>
  }

  return <div className="c-ItemList">
    {
      props.uploading && <ProgressBar filename={props.filename} uploadPercentage={props.uploadPercentage}/>
    }
    {
      multiple ? itemList && itemList.map((item) => getItem(item.documentName, item.documentId)) : (!props.uploading && getItem(name))
    }
  </div>
};

ItemList.propTypes = {
  filename: PropTypes.string,
  cancelHandler: PropTypes.func,
  fileList: PropTypes.array,
  multiple: PropTypes.bool
};

export default ItemList;
