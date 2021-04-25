import React, {useEffect, useState} from "react";
import HelpMain from "./../HelpMain";
import HelpSideBar from "./../HelpSideBar";
import ImageViewer from "../ImageViewer/ImageViewer";
import Http from "../../utility/Http";
import helpConfiguration from "../../config/contentDescriptors/help";
import "./Help.component.scss";

const ACTIVE_TAB = "faq";

const Help = props => {

  const [activeTab, setActiveTab] = useState(ACTIVE_TAB);
  const [helpConfig, setHelpConfig] = useState({});
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    (async () => {
      setHelpConfig(helpConfiguration);
      setLoader(false);
      try {
      const response = (await Http.get("/api/helpConfig")).body;
      setHelpConfig(JSON.parse(response));
      } catch (e) {console.log(e);}
    })();
  }, []);

  return (
    <div className={`${loader ? " loader" : ""}`}>
      { helpConfig && Object.keys(helpConfig).length > 0 &&
        <div className="c-Help container h-100">
          <div className="c-Help__header row">
            <div className="col-12">
              <div className="h3 help-header">{helpConfig.header}</div>
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
      }
    </div>
    );
};

Help.propTypes = {

};

export default Help;
