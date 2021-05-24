/* eslint-disable filenames/match-regex */
import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {dispatchMetadata} from "../../actions/content/content-actions";
import {dispatchWebformState} from "../../actions/webform/webform-action";
import { WebformCta, WebformLandingPage } from "..";
import HomeHeader from "../custom-components/headers/home-header";
import Footer from "../Footer";
import Webform from "../Webform/Webform";
import FORMFIELDCONFIG from "../../config/formsConfig/form-field-meta";
import WEBFORMCONFIG from "../../config/contentDescriptors/webform";
import ContentRenderer from "../../utility/ContentRenderer";
import "./WebformWorkflowDecider.component.scss";
import Http from "../../utility/Http";

class WebformWorkflowDecider extends React.Component {
  constructor(props) {
    super(props);
    const contentRenderer = new ContentRenderer();
    this.getContent = contentRenderer.getContent.bind(this);
    this.commonClickHandler = this.commonClickHandler.bind(this);
    this.props.dispatchMetadata(FORMFIELDCONFIG);
    this.dispatchWebformState = this.props.dispatchWebformState;
    const webformConfig = WEBFORMCONFIG;

    this.getMetaData();
  }

  getMetaData() {
    try {
      Http.get("/api/webformConfig")
        .then(response => {
          if (response.body) {
            try {
              response = JSON.parse(response.body);
              this.setState({webformConfig: response});
            } catch (e) {
              console.log(e);
            }
          }
        });

        Http.get("/api/formConfig")
        .then(response => {
          if (response.body) {
            try {
              response = JSON.parse(response.body);
              response = FORMFIELDCONFIG;
              this.props.dispatchMetadata(response);
            } catch (e) {
                console.log(e);
            }
          }
        });

      } catch (err) {
        console.log(err);
    }

  }

  componentDidMount() {
  }

  commonClickHandler(e) {
    console.log(this.props.webformWorkflow);
    this.dispatchWebformState(e.target.value);
  }

  render() {
      let configuration, childComponent;
      if (this.props.webformWorkflow === "2") {
        configuration = WEBFORMCONFIG.ctaPageConfig;
        childComponent = (<WebformCta configuration= {configuration} getContent={this.getContent}/>);

      } else if (this.props.webformWorkflow === "1") {
        childComponent = (<Webform getContent={this.getContent} dispatchWebformState={this.dispatchWebformState}/>);
        configuration = WEBFORMCONFIG.webform;
      } else {
        configuration = WEBFORMCONFIG.landingPageConfig;
        childComponent = (<WebformLandingPage  configuration= {configuration} getContent={this.getContent}/>);
      }

      return (
        <div className="c-WebformWorkflowDecider">
          <HomeHeader isWebform={true}/>
          <div className="px-5 py-3">
            <div className="row h3 page-title">
              Walmart IP Services
            </div>
            <div className={`row h4 page-header pt-1 ${configuration.header.text ? configuration.header.text : ""}`}>
              {
                configuration.header.text
              }
            </div>
            {childComponent}
          </div>
          <div className="fixed-bottom">
            <Footer/>
          </div>
        </div>
      );
  }
}

WebformWorkflowDecider.propTypes = {
  dispatchMetadata: PropTypes.func,
  dispatchWebformState: PropTypes.func,
  webformWorkflow: PropTypes.number
};
const mapDispatchToProps = {
  dispatchMetadata,
  dispatchWebformState
};
const mapStateToProps = state => {
  return {
    webformWorkflow: state.webform.state
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(WebformWorkflowDecider);
