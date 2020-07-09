import React from "react";
import { connect } from "react-redux";
import HomeHeader from "../custom-components/headers/home-header";
import Leftnav from "../custom-components/left-nav/left-nav";
import ContentRenderer from "./content-renderer/content-renderer";
import PropTypes from "prop-types";
import "../../styles/home/home.scss";
import StorageSrvc, {STORAGE_TYPES} from "../../utility/StorageSrvc";
import {TOGGLE_ACTIONS, toggleModal} from "../../actions/modal-actions";


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.updateProfile = this.updateProfile.bind(this);
    this.storageSrvc = new StorageSrvc(STORAGE_TYPES.SESSION_STORAGE);
    this.state = {
      profile: null
    };
  }

  componentDidMount() {
    const profile = this.storageSrvc.getJSONItem("userProfile");
    this.updateProfile(profile);
  }

  updateProfile (profile) {
    this.setState({profile}, () => {
      if (!this.state.profile.isOrgEnabled) {
        const meta = { templateName: "CompanyVerificationPendingTemplate" };
        this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
      }
    });
  }

  render () {
    if (this.state.profile && this.state.profile.isOrgEnabled) {
      return (
        <div className="view-container home-container">
          <HomeHeader {...this.props}/>
          <div className="mx-n3">
            <Leftnav {...this.props}/>
            <ContentRenderer {...this.props}/>
          </div>
        </div>
      );
    }

    return null;
  }
}

Home.propTypes = {
  location: PropTypes.object,
  isOnboarded: PropTypes.bool,
  toggleModal: PropTypes.func
};

const mapStateToProps = state => state;

const mapDispatchToProps = {
  toggleModal
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
