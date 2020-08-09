/* eslint-disable filenames/match-regex */
/* eslint-disable no-use-before-define */
import React, {useState} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {toggleImageViewer} from "./../../actions/help/help-actions";
import Accordion from "./../Accordion";
import * as imagesAll from "./../../images";
import "./FaqSingle.component.scss";

const FaqSingle = ({data, expandPreState, toggleImageViewerDispatcher}) => {

  const [expanded, setExpanded] = useState(expandPreState ? expandPreState : false);

  const insertImages = images => {
    const colClass = images && images.length === 1 ? "col-8" : "col-6";
    return images && images.map((image, key) => {
    return (
        <div className={colClass} key={key}>
          {image ? <img className="c-FaqSingle__helpImage" src={imagesAll[image]} onClick={() => toggleImageViewerDispatcher({show: true, imageSrc: image})} /> : <i>Image PlaceHolder</i>}
        </div>
      );
    });
  };

  const processNodeDetails = nodeDetails => {
    return nodeDetails.steps.map((step, key) => {
      if (typeof step === "string") {
        return <li key={key}>{step}</li>;
      } else {
        return (
          <li key={key}>
            {step.main}
            {step.subList && getListContent(step.subList)}
            <div className="row">
              {step.image && insertImages(step.image)}
            </div>
          </li>
        );
      }
    });
  };

  const getListContent = nodeDetails => {
    const isOl = nodeDetails.type === "ol";
    if (isOl) {
      return <ol type={nodeDetails.subType}>{processNodeDetails(nodeDetails)}</ol>;
    } else {
      return <ul className="dashed">{processNodeDetails(nodeDetails)}</ul>;
    }
  };

  const getAnswerContent = (answer, node) => {
    if (node.startsWith("partial")) {
      const partial = answer[node];
      return (<div className="c-HelpMain__partial">{Object.keys(partial).map(partialNodeKey => {
        const node1 = partial[partialNodeKey];
        if (partialNodeKey.startsWith("chunk")) {
          return <span>{node1}</span>;
        } else if (partialNodeKey.startsWith("anchor")) {
          return <a href={node1.href}>{node1.text}</a>;
        }
      })}</div>);
    } else if (node.startsWith("para")) {
      return <p>{answer[node]}</p>;
    } else if (node.startsWith("list")) {
      return getListContent(answer[node]);
    } else {
      return null;
    }
  };

  // eslint-disable-next-line complexity
  const generateContentDOM = () => {
    const accNode = document.getElementById(data.id);
    const accButtonNode = accNode && accNode.getElementsByClassName("c-Accordion__button-container");
    const accPanelNode = accButtonNode && accButtonNode.length > 0 && accButtonNode[0].nextElementSibling;
    const answer = data.answer;
    const classes = `c-Accordion__panel${expanded ? " expanded" : ""}`;
    const styles = {maxHeight: expandPreState ? "100%" : expanded && accPanelNode ? accPanelNode.scrollHeight + 24 : 0}
    return (
      <div className={classes} style={styles}>
        {answer && Object.keys(answer).map(node => getAnswerContent(answer, node))}
      </div>
    );
  };

  return (
    <div className="c-FaqSingle" id={data.id}>
      <Accordion data={data} expanded={expanded} setExpanded={setExpanded}>{generateContentDOM()}</Accordion>
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
