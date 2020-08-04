/* eslint-disable no-use-before-define */
import React, {useState} from "react";
import PropTypes from "prop-types";
import Accordion from "./../Accordion";
import "./FaqSingle.component.scss";

const FaqSingle = ({claimExpanded, data, expandPreState, isSideAnimate, setClaimExpanded}) => {

  const [expanded, setExpanded] = useState(expandPreState ? expandPreState : false);

  const processNodeDetails = nodeDetails => {
    return nodeDetails.steps.map((step, key) => {
      if (typeof step === "string") {
        return <li key={key}>{step}</li>;
      } else {
        return (
          <li key={key}>
            {step.main}
            {step.subList && getListContent(step.subList)}
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

  const generateContentDOM = () => {
    const accNode = document.getElementById(data.id);
    const accButtonNode = accNode && accNode.getElementsByClassName("c-Accordion__button-container");
    const accPanelNode = accButtonNode && accButtonNode.length > 0 && accButtonNode[0].nextElementSibling;
    const answer = data.answer;
    return (
      <div className={`c-Accordion__panel${expanded ? " expanded slideout" : ""}${isSideAnimate ? " absolute" : ""}`} style={{maxHeight: expandPreState ? "100%" : expanded && accPanelNode ? accPanelNode.scrollHeight + 24 : 0}}>
        {answer && Object.keys(answer).map(node => getAnswerContent(answer, node))}
      </div>
    );
  };

  return (
    <div className="c-FaqSingle" id={data.id}>
      <Accordion data={data} expanded={expanded} setExpanded={!isSideAnimate ? setExpanded : setClaimExpanded}>{generateContentDOM()}</Accordion>
    </div>
  );
};

FaqSingle.propTypes = {
  claimExpanded: PropTypes.bool,
  data: PropTypes.object,
  expandPreState: PropTypes.bool,
  isSideAnimate: PropTypes.bool,
  setClaimExpanded: PropTypes.func
};

export default FaqSingle;
