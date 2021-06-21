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
import CONSTANTS from "../../constants/constants";

class WebformWorkflowDecider extends React.Component {
  constructor(props) {
    super(props);
    const contentRenderer = new ContentRenderer();
    this.getContent = contentRenderer.getContent.bind(this);
    this.commonClickHandler = this.commonClickHandler.bind(this);
    this.dispatchWebformState = this.props.dispatchWebformState;
    this.state = {
      webformConfig: WEBFORMCONFIG
    };
  }

  componentDidMount() {
    try {
      this.setState({webformConfig: WEBFORMCONFIG});
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

        this.props.dispatchMetadata(FORMFIELDCONFIG);
        Http.get("/api/formConfig")
        .then(response => {
          if (response.body) {
            try {
              response = JSON.parse(response.body);
              //response = FORMFIELDCONFIG;
              this.props.dispatchMetadata(response);
            } catch (e) {
                console.log(e);
            }
          }
        });

      } catch (err) {
        console.log(err);
        this.props.dispatchMetadata(FORMFIELDCONFIG);
        this.setState({webformConfig: WEBFORMCONFIG});
    }
  }

  commonClickHandler(e) {
    console.log(this.props.webformWorkflow);
    this.dispatchWebformState(e.target.value);
  }

  render() {
      let configuration, childComponent;
      if (this.state.webformConfig && this.props.webformWorkflow === CONSTANTS.WEBFORM.CTA) {
        configuration = this.state.webformConfig.ctaPageConfig;
        childComponent = (<WebformCta configuration= {configuration} getContent={this.getContent}/>);

      } else if (this.state.webformConfig && this.props.webformWorkflow === CONSTANTS.WEBFORM.CLAIM_SUBMISSION) {
        configuration = this.state.webformConfig.webform;
        childComponent = (<Webform getContent={this.getContent} configuration= {configuration} dispatchWebformState={this.dispatchWebformState}/>);

      } else {
        configuration = this.state.webformConfig.landingPageConfig;
        childComponent = (<WebformLandingPage  configuration= {configuration} getContent={this.getContent}/>);
      }

      return (
        <div className="c-WebformWorkflowDecider">
          <HomeHeader isWebform={true}/>
          <div className="">
            <div className={`page-title mp-blue ${configuration && configuration.titleClass ? configuration.titleClass : ""}`}>
                Walmart IP Services
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
