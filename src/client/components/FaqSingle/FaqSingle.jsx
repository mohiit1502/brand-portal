/* eslint-disable filenames/match-regex */
/* eslint-disable no-use-before-define */
import React, {useCallback, useEffect, useState} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {toggleImageViewer} from "../../actions/content/content-actions";
import Accordion from "./../Accordion";
import ContentRenderer from "../../utility/ContentRenderer";
import "./FaqSingle.component.scss";
import {withRouter} from "react-router";
import CONSTANTS from "../../constants/constants";

const FaqSingle = ({data, expandPreState, toggleImageViewerDispatcher,...props}) => {

  const [expanded, setExpanded] = useState(expandPreState ? expandPreState : false);
  const [contentRenderer, setContentRenderer] = useState();

  const funcMap = useCallback((e,funcName) => {
    switch (funcName){
      case "goToContactUs":
        return props.history.push(CONSTANTS.ROUTES.HELP.CONTACT);
    }
  })
  useEffect(() => {
    setContentRenderer(new ContentRenderer(data, "c-FaqSingle__helpImage", toggleImageViewerDispatcher,funcMap));
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
  toggleImageViewerDispatcher: PropTypes.func,
  goToContactUs: PropTypes.func
};

const mapDispatchToProps = {
  toggleImageViewerDispatcher: toggleImageViewer
}

export default withRouter(connect(null, mapDispatchToProps)(FaqSingle));
