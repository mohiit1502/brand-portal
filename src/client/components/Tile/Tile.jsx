import React from "react";
import PropTypes from "prop-types";
import * as images from "./../../images";
import "./Tile.component.scss";

const Tile = props => {
  const {contentRenderer, data} = props;
  const bodyContent = data && data.content ? data.content : {};
  const contentRenders = Object.keys(bodyContent).map(node => contentRenderer.getContent(bodyContent, node));

  return (
    // <div className={`c-Tile col ${props.data.classes ? props.data.classes : ""}`} style={{background: "url("}>
    <div className={`c-Tile col ${props.data.classes ? props.data.classes : ""}`}>
      <div className={`c-Tile__content ${props.data.contentClasses ? props.data.contentClasses : ""}`}>
        {props.data.svg && <div className="c-Tile__content__symbol"><img src={images[props.data.svg]} alt=""/></div>}
        {
          props && props.data && typeof props.data.header === "string" ? <div className="c-Tile__content__header">{props.data.header}</div> :
          <div className={`c-Tile__content__header ${props.data.header.classes ? props.data.header.classes : ""}`}>{props.data.header.text}</div>
        }
        <div className={`c-Tile__content__body ${props.data.content.classes ? props.data.content.classes : ""}`}>{contentRenders}</div>
      </div>
    </div>
  );
};

Tile.propTypes = {
  contentRenderer: PropTypes.object,
  data: PropTypes.object
};

export default Tile;
