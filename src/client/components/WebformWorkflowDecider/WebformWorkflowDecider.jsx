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
import "./WebformWorkflowDecider.component.scss";
import ContentRenderer from "../../utility/ContentRenderer";

class WebformWorkflowDecider extends React.Component {
  constructor(props) {
    super(props);
    const contentRenderer = new ContentRenderer();
    this.getContent = contentRenderer.getContent.bind(this);
    this.commonClickHandler = this.commonClickHandler.bind(this);
    this.dispatchWebformState = this.props.dispatchWebformState;
  }

  componentDidMount() {
    this.props.dispatchMetadata(FORMFIELDCONFIG);
  }

  commonClickHandler() {
  console.log("console");
  }

  render() {
      return (
        <div className="c-WebformWorkflowDecider">
          <HomeHeader isWebform={true}/>
          <div className="px-5 py-3">
            <div className="row h3 page-title">
              Walmart IP Services
            </div>
            {/* <WebformLandingPage/> */}
            {/* <Webform/> */}
            <WebformCta getContent={this.getContent}/>
          </div>
          <div className="">
            <Footer/>
          </div>
        </div>
      );
  }
}

WebformWorkflowDecider.propTypes = {
  dispatchMetadata: PropTypes.func,
  dispatchWebformState: PropTypes.func
};
const mapDispatchToProps = {
  dispatchMetadata,
  dispatchWebformState
};
const mapStateToProps = state => {
  return {
    webformWorkflow: state.webform.workflow
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(WebformWorkflowDecider);
