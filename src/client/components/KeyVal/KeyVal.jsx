import React, {useLayoutEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import ContentRenderer from "../../utility/ContentRenderer";
import "./KeyVal.component.scss";
import $ from "jquery";

const KeyVal = props => {
  const {content, node, user} = props;
  const valueRef = useRef(null);
  const [overflows, setOverflows] = useState();

  const nodeContent = content ? JSON.parse(JSON.stringify(content[node])) : {};
  let text = typeof nodeContent === "string" ? nodeContent : nodeContent.value;
  ContentRenderer.getDynamicReplacementConfig(nodeContent, user || {});
  const dynamicReplacements = nodeContent.dynamicReplacementConfig;
  text = ContentRenderer.implementDynamicReplacements(dynamicReplacements, text);
  text = text && text.indexOf("undefined") === -1 && text.indexOf("null") === -1 && text !== "0000000000" && text !== "(000) 000-0000" ? text : "-";

  useLayoutEffect(() => {
    try {
      $(".content-overflow")
        .on("mouseenter", () => $(".tooltip").removeClass("move-beneath"))
        .tooltip();
      $("body")
        .on("click", ".tooltip-close-button", () => $(".tooltip").addClass("move-beneath"))
        .on("mouseleave", ".tooltip, [title]", () => $(".tooltip").addClass("move-beneath"));
    } catch (e) {}
  });

  useLayoutEffect(() => {
    const el = valueRef.current;
    if (el && el.scrollWidth > el.offsetWidth) {
      setOverflows(true);
    }
  }, [valueRef.current]);
  return <div className={`c-KeyVal text-overflow-ellipsis${nodeContent ? " " + nodeContent.containerClasses : ""}`} ref={valueRef}>
    <span className="mr-4 font-disabled font-size-14">{nodeContent.key}</span>
    <span className={overflows ? "content-overflow" : ""} title={text}>{text}</span>
  </div>
};

KeyVal.propTypes = {
  content: PropTypes.object,
  node: PropTypes.string,
  user: PropTypes.object
};

export default KeyVal;
