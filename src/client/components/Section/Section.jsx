import React from "react";
import PropTypes from "prop-types";
import ContentRenderer from "../../utility/ContentRenderer";
import "./Section.component.scss";

const Section = props => {
  const {config: {header, body, footer, innerClasses, layoutClasses}, data, parent} = props;
  const {user} = data || {};
  const renderer = new ContentRenderer();
  return (
    <div className={`c-Section${layoutClasses ? " " + layoutClasses : ""}`}>
      <div className={`${innerClasses ? " " + innerClasses : ""}`}>
        {body && <div className={`c-SectionBox${body.classes ? " " + body.classes : ""}`}>
          {header && <header className={header.classes}>{header.text}</header>}
          {ContentRenderer.getSectionRenders.call(parent, body.content)}
          {/*{Object.keys(body.content).map(contentKey => {*/}
          {/*  const content = body.content[contentKey];*/}
          {/*  return content.wrapInRow ? <div className="row">{renderer.getContent.call(parent, body.content, contentKey, "", false, {user})}</div>*/}
          {/*    : renderer.getContent.call(parent, body.content, contentKey, "", false, {user});*/}
          {/*})}*/}
        </div>}
        {footer && <footer className={`${footer.classes ? " " + footer.classes : ""}`}>{footer.text}</footer>}
      </div>
    </div>
  );
};

Section.propTypes = {
  config: PropTypes.object,
  data: PropTypes.object,
  parent: PropTypes.object
};

export default Section;
