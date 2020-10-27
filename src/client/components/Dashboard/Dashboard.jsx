// eslint-disable-next-line filenames/match-regex
import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import DashboardHeader from "./../DashboardHeader";
import WidgetContainer from "./../WidgetContainer";
import widgetConfig from "./../../config/contentDescriptors/widgets";
import restConfig from "../../config/rest";
import AUTH_CONFIG from "../../config/authorizations";
import "./Dashboard.component.scss";

const Dashboard = props => {
  return (
    <div className="c-Dashboard">
      <DashboardHeader userInfo={props.userProfile} />
      <WidgetContainer authConfig={AUTH_CONFIG} restConfig={restConfig} userProfile={props.userProfile} widgets={widgetConfig.WIDGETS} widgetCommon={widgetConfig.WIDGETCOMMON} />
    </div>
  );
};

Dashboard.propTypes = {
  userProfile: PropTypes.object
};

const mapStateToProps = state => {
  return {
    userProfile: state.user.profile
  };
};

export default connect(mapStateToProps)(Dashboard);
