/* eslint-disable filenames/match-regex */
import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router";
import HelpMain from "./../HelpMain";
import HelpSideBar from "./../HelpSideBar";
import ImageViewer from "../ImageViewer/ImageViewer";
import Http from "./../../../client/utility/Http";
import helpConfiguration from "../../config/contentDescriptors/help";
import "./Help.component.scss";

const Help = props => {

  const [activeTabUrl, setActiveTabUrl] = useState(props.location.pathname);
  const [helpConfig, setHelpConfig] = useState(helpConfiguration);
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    (async () => {
      setLoader(false);
      try {
        setHelpConfig(helpConfiguration);
        const response = (await Http.get("/api/helpConfig")).body;
        setHelpConfig(JSON.parse(response));
      /* eslint-disable no-empty */
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    setActiveTabUrl(props.location.pathname);
  }, [props.location.pathname]);

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
              <HelpSideBar categoryHeader={helpConfig.categoryHeader} categories={helpConfig.categories}
                activeTab={helpConfig.sectionMap[activeTabUrl]}/>
            </div>
            <div className="col-10">
              <HelpMain content={helpConfig.content} activeTab={helpConfig.sectionMap[activeTabUrl]}/>
            </div>
          </div>
          <ImageViewer />
        </div>
      }
    </div>
    );
};

Help.propTypes = {
  location: PropTypes.object
};

export default withRouter(Help);
