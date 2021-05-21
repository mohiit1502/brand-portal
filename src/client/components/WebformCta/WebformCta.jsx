/* eslint-disable quote-props */
import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import "./WebformCta.component.scss";

const WebformCta = function(props) {
  const [contentConfig, setContentConfig] = useState({});
  useEffect(() => {
      setContentConfig(props.configuration.content ? props.configuration.content : {});
  }, [props.configuration]);

  const contentRenders = contentConfig && props.getContent && Object.keys(contentConfig).map(node => {
    return props.getContent(contentConfig, node);
  });

  return (
    <div className="c-WebformCta">
      <div className="px-5">
        {contentRenders}
      </div>
    </div>
  );
};

WebformCta.propTypes = {
  getContent: PropTypes.func,
  configuration: PropTypes.Object
};

export default WebformCta;
