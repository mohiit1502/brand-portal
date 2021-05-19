/* eslint-disable quote-props */
import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import ContentRenderer from "../../utility/ContentRenderer";
import { Tile } from "..";
import WEBFORMCONFIG from "../../config/contentDescriptors/webform";
import "./WebformCta.component.scss";

const WebformCta = function(props) {

  const [contentRenderer, setContentRenderer] = useState();
  const [contentConfig, setContentConfig] = useState({});
  useEffect(() => {
    if (!contentRenderer) {
      setContentRenderer(new ContentRenderer());
    }
    setContentConfig(WEBFORMCONFIG.ctaPageConfig);
  }, []);

  const tilesRenders = contentRenderer && contentConfig.tiles.map((tile, key) => <Tile key={key} data={tile} contentRenderer={contentRenderer} />);
  const contentRenders = contentRenderer && Object.keys(contentConfig.messageContent).map(node => contentRenderer.getContent(contentConfig.messageContent, node));

  return (
    <div className="c-WebformCta">
      <div className="row h3 pl-5 header">
        Walmart IP Services
      </div>
      <div className="row h4 pl-5 header ml-3">
        DCMA Claim Form
      </div>
      <div className="pl-5 message-content ml-5">
        {contentRenders}
      </div>
      <div className="h1 mt-5 font-weight-bold text-center">
        Walmart Brand Portal
      </div>
      <div className="c-TilesContainer px-5 row display-flex">
        {tilesRenders}
      </div>
      <div className="text-right pb-5 pr-5">
        <button type="button" className="btn btn-sm new-claim-button">Submit a New Claim</button>
      </div>
    </div>
  );
};

WebformCta.propTypes = {

};

export default WebformCta;
