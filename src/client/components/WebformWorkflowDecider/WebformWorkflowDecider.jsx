/* eslint-disable filenames/match-regex */
import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {dispatchWebformState} from "../../actions/webform/webform-action";
import { WebformCta } from "..";
import HomeHeader from "../custom-components/headers/home-header";
import Webform from "../Webform/Webform";
import Footer from "../Footer";
import ContentRenderer from "../../utility/ContentRenderer";
import Http from "../../utility/Http";
import mixpanel from "../../utility/mixpanelutils";
import WEBFORMCONFIG from "../../config/contentDescriptors/webform";
import CONSTANTS from "../../constants/constants";
import "./WebformWorkflowDecider.component.scss";

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

        if (!mixpanel.getToken()) {
          Http.get("/api/mixpanelConfig")
          .then(res => {
            mixpanel.intializeMixpanel(res.body.projectToken, res.body.enableTracking);
          }).catch(e => mixpanel.intializeMixpanel(CONSTANTS.MIXPANEL.PROJECT_TOKEN));
        }

      } catch (err) {
        console.log(err);
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
        childComponent = <Webform
              getContent={this.getContent}
              configuration={configuration}
              dispatchWebformState={this.dispatchWebformState}/>
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
  dispatchWebformState: PropTypes.func,
  webformWorkflow: PropTypes.string
};

const mapDispatchToProps = {
  dispatchWebformState
};

const mapStateToProps = state => {
  return {
    webformWorkflow: state.webform.state
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(WebformWorkflowDecider);
