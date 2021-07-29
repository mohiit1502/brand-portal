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
import mixpanel from "../../utility/mixpanelutils";

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
        if (!mixpanel.getToken()) {
          Http.get("/api/mixpanelConfig")
          .then(res => {
            mixpanel.intializeMixpanel(res.body.projectToken, res.body.enableTracking);
          }).catch(e => mixpanel.intializeMixpanel(CONSTANTS.MIXPANEL.PROJECT_TOKEN));
        }

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
        childComponent = this.props.webformFieldsConfiguration
          ? <Webform
              getContent={this.getContent}
              webformFieldsConfiguration={this.props.webformFieldsConfiguration}
              configuration={configuration}
              dispatchWebformState={this.dispatchWebformState}/>
          : null;
      }

      return (
        <div className="c-WebformWorkflowDecider">
          <HomeHeader isWebform={true} hideHelp={this.props.webformWorkflow !== CONSTANTS.WEBFORM.CLAIM_SUBMISSION} config={this.state.webformConfig ? this.state.webformConfig.webform : {}} />
          <div className="">
            {childComponent}
          </div>
          <div className="fixed-bottom">
            <Footer isWebform={true}/>
          </div>
        </div>
      );
  }
}

WebformWorkflowDecider.propTypes = {
  dispatchMetadata: PropTypes.func,
  dispatchWebformState: PropTypes.func,
  webformWorkflow: PropTypes.string,
  webformFieldsConfiguration: PropTypes.object
};

const mapDispatchToProps = {
  dispatchMetadata,
  dispatchWebformState
};

const mapStateToProps = state => {
  return {
    webformWorkflow: state.webform.state,
    webformFieldsConfiguration: state.content && state.content.metadata && state.content.metadata.SECTIONSCONFIG && state.content.metadata.SECTIONSCONFIG.WEBFORM
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(WebformWorkflowDecider);
