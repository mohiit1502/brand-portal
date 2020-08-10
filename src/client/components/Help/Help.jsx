import React, {useState} from "react";
import HelpMain from "./../HelpMain";
import HelpSideBar from "./../HelpSideBar";
import ImageViewer from "../ImageViewer/ImageViewer";
import helpConfig from "../../config/contentDescriptors/help";
import "./Help.component.scss";

const ACTIVE_TAB = "faq";

const Help = props => {

  const [activeTab, setActiveTab] = useState(ACTIVE_TAB);

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
        <div className="col-10">
          <HelpMain content={helpConfig.content} activeTab={activeTab} />
        </div>
      </div>
      <ImageViewer />
    </div>
  );
};

Help.propTypes = {

};

export default Help;
