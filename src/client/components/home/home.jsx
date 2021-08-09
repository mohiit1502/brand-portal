import React from "react";
import { connect } from "react-redux";
import HomeHeader from "../custom-components/headers/home-header";
import Leftnav from "../custom-components/left-nav/left-nav";
import ContentRenderer from "./content-renderer/content-renderer";
import PropTypes from "prop-types";
// import StorageSrvc, {STORAGE_TYPES} from "../../utility/StorageSrvc";
import {TOGGLE_ACTIONS, toggleModal} from "../../actions/modal-actions";
// import Tooltip from "./../../utility/tooltiplib";
import CONSTANTS from "../../constants/constants";
import * as images from "./../../images";
import "../../styles/home/home.scss";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.updateProfile = this.updateProfile.bind(this);
    this.state = {
      profile: null
    };
  }

  componentDidMount() {
    // const profile = this.storageSrvc.getJSONItem("userProfile");
    // Tooltip.register();
    // Tooltip.showTooltip(document.getElementById("nav-item-3-31"));
    const profile = this.props.userProfile;
    this.updateProfile(profile);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.displayAdditionalAction !== this.props.displayAdditionalAction) {
      this.updateProfile((this.props.userProfile));
    }
  }

  updateProfile (profile) {
    this.setState({profile}, () => {
      const workflowDecider = profile && profile.workflow;
      const statusTemplateCodes = Object.keys(CONSTANTS.CODES)
        .filter(key => CONSTANTS.CODES[key].MESSAGE && CONSTANTS.CODES[key].TITLE)
        .map(key => CONSTANTS.CODES[key].CODE);
      const genericTemplateCodes = Object.keys(CONSTANTS.CODES)
        .filter(key => CONSTANTS.CODES[key].GENERIC)
        .map(key => CONSTANTS.CODES[key].CODE);
      if (!this.props.isNew) {
        if (workflowDecider && workflowDecider.code) {
          if (statusTemplateCodes.includes(workflowDecider.code)) {
            const templateKey = Object.keys(CONSTANTS.CODES).find(item => CONSTANTS.CODES[item].CODE === workflowDecider.code);
            let template = templateKey && CONSTANTS.CODES[templateKey];
            const image = images[template.IMAGE];
            const displayAdditionalAction = this.props.displayAdditionalAction;
            const remaining = this.props.remaining;
            template = {templateName: "StatusModalTemplate", image, displayAdditionalAction, remaining, ...template};
            this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...template});
          } else if (genericTemplateCodes.includes(workflowDecider.code)) {
            const userProfile = this.props.userProfile;
            const template = {templateName: "TouTemplate", userProfile};
            this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...template})
          }
        }
      }
    });
  }

  render () {
    const workflowDecider = this.state.profile && this.state.profile.workflow;
    const codes = Object.keys(CONSTANTS.CODES)
      .filter(key => ["PORTAL_REGISTRATION", "PORTAL_VERIFICATION", "PORTAL_ACCESS_REVOKED", "USER_ACCESS_REVOKED", "REQUEST_ACCESS", "USER_VERIFICATION", "TOU_VERIFICATION"].includes(key))
      .map(key => CONSTANTS.CODES[key].CODE);
    const disablePortalAccess = workflowDecider && workflowDecider.code && codes.includes(workflowDecider.code);
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
  displayAdditionalAction: PropTypes.bool,
  isNew: PropTypes.bool,
  location: PropTypes.object,
  isOnboarded: PropTypes.bool,
  remaining: PropTypes.number,
  toggleModal: PropTypes.func,
  userProfile: PropTypes.object
};

const mapStateToProps = state => state;

const mapDispatchToProps = {
  toggleModal
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
