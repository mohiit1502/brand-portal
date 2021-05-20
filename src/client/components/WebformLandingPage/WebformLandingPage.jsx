import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import "./WebformLandingPage.component.scss";
import ContentRenderer from "../../utility/ContentRenderer";
import WEBFORMCONFIG from "../../config/contentDescriptors/webform";

const WebformLandingPage = props => {
  const [contentRenderer, setContentRenderer] = useState();
  const [contentConfig, setContentConfig] = useState({});
  useEffect(() => {
    if (!contentRenderer) {
      setContentRenderer(new ContentRenderer());
    }
    if (!contentConfig) {
    setContentConfig(WEBFORMCONFIG.landingPageConfig.content);
    }
  }, []);

  const contentRenders = contentRenderer && contentConfig && Object.keys(contentConfig).map(node => {
    return contentRenderer.getContent(contentConfig, node);
  });
  return (
    <div className="c-WebformLandingPage">
      <div className="row h4 page-header">
        Submit IP claims
      </div>
      <div className="ml-3 px-5">{contentRenders}</div>
    </div>
  );
};

WebformLandingPage.propTypes = {

};

export default WebformLandingPage;
