import React from "react";
import PropTypes from "prop-types";
import "./NoRecordsMatch.component.scss";

const NoRecordsMatch = props => {
  return (
    <div className="c-NoRecordsMatch">
      <div className="text-center p-5">
        <div className="row mt-3">
          <div className="col">
            <span className="status-description">
              {props.message}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

NoRecordsMatch.defaultProps = {
  message: "No Records Found matching search and filters provided."
};

NoRecordsMatch.propTypes = {
  message: PropTypes.string
};

export default NoRecordsMatch;
