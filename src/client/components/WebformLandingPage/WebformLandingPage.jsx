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
    setContentConfig(WEBFORMCONFIG.landingPageConfig.contents);
  }, []);

  const contentRenders = contentConfig && contentRenderer && contentConfig.map(content => Object.keys(content).map(node => {
    if (node.startsWith("header")) {
      return (<div className="content-header">{content.header}</div>);
    } else if (node.startsWith("button")) {
      return (<div className="content-button  text-right pl-5"><button type="button" className={content[node].classes} key={content[node].key} >{content[node].buttonText}</button></div>);
    } else {
      return (Object.keys(content[node]).map(subcontent => {
        return contentRenderer.getContent(content[node], subcontent);
      }));
    }
  }));

  return (
    <div className="c-WebformLandingPage">
      <div className="row h3 header">
        Walmart IP Services
      </div>
      <div className="row h4 header ml-3">
        Submit IP claims
      </div>
      <div className="px-5">{contentRenders}</div>
    </div>
  );
};

WebformLandingPage.propTypes = {

};

export default WebformLandingPage;
