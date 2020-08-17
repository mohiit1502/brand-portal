import React from "react";
import { connect } from "react-redux";
import HomeHeader from "../custom-components/headers/home-header";
import Leftnav from "../custom-components/left-nav/left-nav";
import ContentRenderer from "./content-renderer/content-renderer";
import PropTypes from "prop-types";
// import StorageSrvc, {STORAGE_TYPES} from "../../utility/StorageSrvc";
import {TOGGLE_ACTIONS, toggleModal} from "../../actions/modal-actions";
import CONSTANTS from "../../constants/constants";
import * as images from "./../../images";
import "../../styles/home/home.scss";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.updateProfile = this.updateProfile.bind(this);
    // this.storageSrvc = new StorageSrvc(STORAGE_TYPES.SESSION_STORAGE);
    this.state = {
      profile: null
    };
  }

  componentDidMount() {
    // const profile = this.storageSrvc.getJSONItem("userProfile");
    const profile = this.props.userProfile;
    this.updateProfile(profile);
  }

  updateProfile (profile) {
    this.setState({profile}, () => {
      const workflowDecider = profile && profile.workflow;
      const statusTemplateCodes = Object.keys(CONSTANTS.CODES)
        .filter(key => CONSTANTS.CODES[key].MESSAGE && CONSTANTS.CODES[key].TITLE)
        .map(key => CONSTANTS.CODES[key].CODE);
      if (!this.props.isNew) {
        if (workflowDecider && workflowDecider.code && statusTemplateCodes.includes(workflowDecider.code)) {
          const templateKey = Object.keys(CONSTANTS.CODES).find(item => CONSTANTS.CODES[item].CODE === workflowDecider.code);
          let template = templateKey && CONSTANTS.CODES[templateKey];
          const image = images[template.IMAGE];
          // switch (workflowDecider.code) {
          //   case CONSTANTS.TEMPLATE.PORTAL_VERIFICATION.CODE:
          //     template = {...CONSTANTS.TEMPLATE.PORTAL_VERIFICATION};
          //     image = images[CONSTANTS.TEMPLATE.PORTAL_VERIFICATION.IMAGE];
          //     break;
          //   case CONSTANTS.TEMPLATE.USER_ACCESS_REVOKED.CODE:
          //     template = {...CONSTANTS.TEMPLATE.USER_ACCESS_REVOKED};
          //     image = images[CONSTANTS.TEMPLATE.USER_ACCESS_REVOKED.IMAGE];
          //     break;
          //   case CONSTANTS.TEMPLATE.PORTAL_ACCESS_REVOKED.CODE:
          //     template = {...CONSTANTS.TEMPLATE.PORTAL_ACCESS_REVOKED};
          //     image = images[CONSTANTS.TEMPLATE.PORTAL_ACCESS_REVOKED.IMAGE];
          //     break;
          //   case CONSTANTS.TEMPLATE.USER_VERIFICATION.CODE:
          //     template = {...CONSTANTS.TEMPLATE.USER_VERIFICATION};
          //     image = images[CONSTANTS.TEMPLATE.USER_VERIFICATION.IMAGE];
          //     break;
          //   }

          template = {templateName: "StatusModalTemplate", image, ...template};
          // const meta = { ...template  };
          this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...template});
        }
      }
    });
  }

  render () {
    const workflowDecider = this.state.profile && this.state.profile.workflow;
      const codes = Object.keys(CONSTANTS.CODES)
        .filter(key => ["PORTAL_REGISTRATION", "PORTAL_VERIFICATION", "PORTAL_ACCESS_REVOKED", "USER_ACCESS_REVOKED", "REQUEST_ACCESS", "USER_VERIFICATION"].includes(key))
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
  isNew: PropTypes.bool,
  location: PropTypes.object,
  isOnboarded: PropTypes.bool,
  toggleModal: PropTypes.func,
  userProfile: PropTypes.object
};

const mapStateToProps = state => state;

const mapDispatchToProps = {
  toggleModal
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
