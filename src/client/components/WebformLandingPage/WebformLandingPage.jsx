import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import mixpanel from "../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../constants/mixpanelConstants";
import "./WebformLandingPage.component.scss";

const WebformLandingPage = props => {
  const [contentConfig, setContentConfig] = useState({});
  useEffect(() => {
    setContentConfig(props.configuration.content ? props.configuration.content : {});
    const mixpanelPayload = {WORK_FLOW: "WEB_FORM"};
    mixpanel.trackEvent(MIXPANEL_CONSTANTS.WEBFORM.VIEW_WEBFORM_LANDING_PAGE, mixpanelPayload);
}, [props.configuration]);

  const contentRenders = props.getContent && contentConfig && Object.keys(contentConfig).map(node => {
    return props.getContent(contentConfig, node);
  });
  return (
    <div className="c-WebformLandingPage">
      <div className="page-body">
          <div className="page-header h4 font-weight-bold">
            {
              props.configuration.header.text
            }
          </div>
          <div>{contentRenders}</div>
      </div>
    </div>
  );
};

WebformLandingPage.propTypes = {
  getContent: PropTypes.func,
  configuration: PropTypes.Object
};

export default WebformLandingPage;
