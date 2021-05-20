/* eslint-disable quote-props */
import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import WEBFORMCONFIG from "../../config/contentDescriptors/webform";
import "./WebformCta.component.scss";

const WebformCta = function(props) {
  const [contentConfig, setContentConfig] = useState({});
  useEffect(() => {
      setContentConfig(WEBFORMCONFIG.ctaPageConfig.content);
  }, []);

  const contentRenders = contentConfig && props.getContent && Object.keys(contentConfig).map(node => {
    return props.getContent(contentConfig, node);
  });

  return (
    <div className="c-WebformCta">
      <div className="row h4 page-header">
        DCMA Claim Form
      </div>
      <div className="px-5">
        {contentRenders}
      </div>
    </div>
  );
};

WebformCta.propTypes = {
  getContent: PropTypes.func
};

export default WebformCta;
