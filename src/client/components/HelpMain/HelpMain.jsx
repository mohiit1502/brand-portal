import React, {useState} from "react";
import PropTypes from "prop-types";
import FaqSingle from "./../FaqSingle";
import "./HelpMain.component.scss";

const HelpMain = ({activeTab, content, isSideAnimate}) => {

  const activeTabContent = content && content[activeTab];
  const isSingleQuestion = !(activeTabContent && activeTabContent.items);
  const [claimExpanded, setClaimExpanded] = useState(false);

  const contentRendered = activeTabContent && activeTabContent.items ? activeTabContent.items.map((item, index) => {
    item.id = `${activeTab}-${index}`;
    return <FaqSingle key={`${activeTab}-${index}`} data={item} isSideAnimate={isSideAnimate} claimExpanded={claimExpanded} setClaimExpanded={setClaimExpanded} />;
  }) : <div className="c-HelpMain__content__qContainer"><FaqSingle data={activeTabContent} expandPreState={true} /></div>;

  return (
    <div id={activeTabContent.id} className={`c-HelpMain${isSideAnimate ? " absolute" : ""}${isSideAnimate && claimExpanded ? " slideout" : ""}`}>
      <div className="c-HelpMain__header h4" style={{borderBottom: isSingleQuestion && "none"}}>{activeTabContent.header}</div>
      <div className="c-HelpMain__content">
        {contentRendered}
      </div>
    </div>
  );
};

HelpMain.propTypes = {
  activeTab: PropTypes.string,
  content: PropTypes.object,
  isSideAnimate: PropTypes.bool
};

export default HelpMain;
