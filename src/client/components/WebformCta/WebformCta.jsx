/* eslint-disable quote-props */
import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import "./WebformCta.component.scss";
import mixpanel from "../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../constants/mixpanelConstants";

const WebformCta = function(props) {
  const [contentConfig, setContentConfig] = useState({});
  useEffect(() => {
      setContentConfig(props.configuration.content ? props.configuration.content : {});
      const mixpanelPayload = {WORK_FLOW: "WEB_FORM"};
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.WEBFORM.VIEW_WEBFORM_CTA, mixpanelPayload);
  }, [props.configuration]);

  const contentRenders = contentConfig && props.getContent && Object.keys(contentConfig).map(node => {
    return props.getContent(contentConfig, node);
  });

  return (
    <div className="c-WebformCta">
      <div className="page-body">
          <div className="page-header h4 font-weight-bold">
            {
              props.configuration.header.text
            }
          </div>
          <div className="">{contentRenders}</div>
      </div>
    </div>
  );
};

WebformCta.propTypes = {
  getContent: PropTypes.func,
  configuration: PropTypes.Object
};

export default WebformCta;
