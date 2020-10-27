import React from "react";
import PropTypes from "prop-types";
import "./DashboardHeader.component.scss";

const DashboardHeader = props => {
  return (
    <div className="c-DashboardHeader row p-4 h-10 mx-0">
      <div className="col">
        <h3>Hello {props.userInfo.firstName}!</h3>
      </div>
    </div>
  );
};

DashboardHeader.propTypes = {
  userInfo: PropTypes.object
};

export default DashboardHeader;
