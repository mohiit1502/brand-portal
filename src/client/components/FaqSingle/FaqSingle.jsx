/* eslint-disable filenames/match-regex */
/* eslint-disable no-use-before-define */
import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {toggleImageViewer} from "./../../actions/help/help-actions";
import Accordion from "./../Accordion";
import ContentRenderer from "../../utility/ContentRenderer";
import "./FaqSingle.component.scss";

const FaqSingle = ({data, expandPreState, toggleImageViewerDispatcher}) => {

  const [expanded, setExpanded] = useState(expandPreState ? expandPreState : false);
  const [contentRenderer, setContentRenderer] = useState();

  useEffect(() => {
    setContentRenderer(new ContentRenderer(data, "c-FaqSingle__helpImage", toggleImageViewerDispatcher));
  }, [data]);

  return (
    <div className="c-FaqSingle" id={data.id}>
      <Accordion data={data} expanded={expanded} setExpanded={setExpanded}>{contentRenderer && contentRenderer.generateContentDOM(expanded, expandPreState)}</Accordion>
    </div>
  );
};

FaqSingle.propTypes = {
  data: PropTypes.object,
  expandPreState: PropTypes.bool,
  toggleImageViewerDispatcher: PropTypes.func
};

const mapDispatchToProps = {
  toggleImageViewerDispatcher: toggleImageViewer
}

export default connect(null, mapDispatchToProps)(FaqSingle);
