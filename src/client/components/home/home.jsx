/* eslint-disable max-statements */
import React from "react";
import { connect } from "react-redux";
 import HomeHeader from "../custom-components/headers/home-header";
import Leftnav from "../custom-components/left-nav/left-nav";
import ContentRenderer from "./content-renderer/content-renderer";
import PropTypes from "prop-types";
import {TOGGLE_ACTIONS, toggleModal} from "../../actions/modal-actions";
import * as images from "./../../images";
import "../../styles/home/home.scss";
import {withRouter} from "react-router";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.updateProfile = this.updateProfile.bind(this);
  }

  componentDidMount() {
    const profile = this.props.userProfile;
    this.updateProfile(profile);
  }

  updateProfile (profile) {
    const {modalsMeta} = this.props;
    this.setState({profile}, () => {
      const workflowDecider = profile && profile.workflow;
      const statusTemplateCodes = Object.keys(modalsMeta)
        .filter(key => modalsMeta[key].MESSAGE && modalsMeta[key].TITLE)
        .map(key => modalsMeta[key].CODE);
      const genericTemplateCodes = Object.keys(modalsMeta)
        .filter(key => modalsMeta[key].GENERIC)
        .map(key => modalsMeta[key].CODE);
      if (!this.props.isNew) {
        if (workflowDecider && workflowDecider.code) {
          const templateKey = Object.keys(modalsMeta).find(item => {
            if (modalsMeta[item].CODE && typeof modalsMeta[item].CODE === "object" && modalsMeta[item].CODE.length) {
              return modalsMeta[item].CODE.indexOf(workflowDecider.code) > -1;
            } else {
              return modalsMeta[item].CODE === workflowDecider.code;
            }
          });
          let template = templateKey && modalsMeta[templateKey];
          const userProfile = this.props.userProfile;
          const isStatusTemplateCode = statusTemplateCodes.findIndex(code => typeof code === "object" ? code.indexOf(workflowDecider.code) > -1 : code === workflowDecider.code) > -1;
          if (isStatusTemplateCode) {
            const image = images[template.IMAGE];
            template = {templateName: "StatusModalTemplate", image, ...template};
            this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...template});
          } else if (genericTemplateCodes.includes(workflowDecider.code)) {
            template = {templateName: template.TEMPLATE, userProfile, ...template};
            this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...template});
          }
        }
      }
    });
  }

  render () {
    const workflowDecider = this.props.userProfile && this.props.userProfile.workflow;
    const codes = Object.keys(this.props.modalsMeta)
      .filter(key => ["PORTAL_REGISTRATION", "PORTAL_VERIFICATION", "APPLICATION_INFORMATION", "USER_ACCESS_REVOKED",
        "REQUEST_ACCESS", "USER_VERIFICATION", "TOU_VERIFICATION", "ACCOUNT_LINKING", "ACCOUNT_LINKING_CONFIRM", "ACCOUNT_LINKED"].includes(key))
      .map(key => this.props.modalsMeta[key].CODE);
    const disablePortalAccess = (!workflowDecider || !workflowDecider.code
      || (workflowDecider && workflowDecider.code && codes.findIndex(code => typeof code === "object" ? code.indexOf(workflowDecider.code) > -1 : code === workflowDecider.code) > -1))
      || (this.props.modal && this.props.modal.value === "show" && this.props.modal.templateName === "StatusModalTemplate");
//     disablePortalAccess && this.props.history.push(CONSTANTS.ROUTES.PROTECTED.PREBOARD);
    return (
      <div className="view-container home-container">
        <HomeHeader {...this.props}/>
        {
          !disablePortalAccess &&
            <div className="mx-n3">
              <Leftnav {...this.props}/>
              <ContentRenderer {...this.props}/>
            </div>
        }
      </div>
    );
  }
}

Home.propTypes = {
  isNew: PropTypes.bool,
  location: PropTypes.object,
  isOnboarded: PropTypes.bool,
  modal: PropTypes.object,
  modalsMeta: PropTypes.object,
  toggleModal: PropTypes.func,
  userProfile: PropTypes.object
};

const mapStateToProps = state => {
  return {
    modal: state.modal,
    modalsMeta: state.content.metadata ? state.content.metadata.MODALSCONFIG : {}
  };
};

const mapDispatchToProps = {
  toggleModal
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home));
