import React, {useState} from "react";
import HelpMain from "./../HelpMain";
import HelpSideBar from "./../HelpSideBar";
import helpConfig from "../../config/helpDescriptor";
import "./Help.component.scss";

const ACTIVE_TAB = "faq";

const Help = props => {

  const [activeTab, setActiveTab] = useState(ACTIVE_TAB);
  const isSideAnimate = activeTab && activeTab === "claim";
  return (
    <div className="c-Help container h-100">
      <div className="c-Help__header row">
        <div className="col-12">
          <div className="h3">{helpConfig.header}</div>
        </div>
      </div>
      <div className="c-Help__content row h-100">
        <div className="col-2 h-100">
          <HelpSideBar categoryHeader={helpConfig.categoryHeader} categories={helpConfig.categories} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className={`col-10${isSideAnimate ? " relative" : ""}`}>
          <HelpMain content={helpConfig.content} activeTab={activeTab} isSideAnimate={isSideAnimate} />
        </div>
      </div>
    </div>
  );
};

Help.propTypes = {

};

export default Help;
