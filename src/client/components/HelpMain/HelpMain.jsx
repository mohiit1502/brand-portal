import React from "react";
import PropTypes from "prop-types";
import FaqSingle from "./../FaqSingle";
import "./HelpMain.component.scss";
import ContactUsForm from "../ContactUsForm";

const HelpMain = ({activeTab, content}) => {

  const activeTabContent = content && content[activeTab];
  const isSingleQuestion = !(activeTabContent && activeTabContent.items);

  const contentRendered = activeTabContent && activeTabContent.items ? activeTabContent.items.map((item, index) => {
    item.id = `${activeTab}-${index}`;
    return <FaqSingle key={`${activeTab}-${index}`} data={item}/>;
  }) : <div className="c-HelpMain__content__qContainer"><ContactUsForm/></div>;

  return (
    <div id={activeTabContent.id} className="c-HelpMain">
      <div className="c-HelpMain__header h4 font-weight-bold">{activeTabContent.header}</div>
      <div className="c-HelpMain__content">
        {contentRendered}
      </div>
    </div>
  );
};

HelpMain.propTypes = {
  activeTab: PropTypes.string,
  content: PropTypes.object,
  goToContactUs: PropTypes.func
};

export default HelpMain;
