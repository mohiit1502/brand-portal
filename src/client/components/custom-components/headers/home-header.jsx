import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {TOGGLE_ACTIONS, toggleModal} from "../../../actions/modal-actions";
import UserMenu from "../UserMenu/UserMenu";
import headerLogo from "../../../images/WMWhite-horizontal.svg";
import helpLogo from "../../../images/help-header.png";
import "../../../styles/custom-components/headers/home-header.scss";

class HomeHeader extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    const isWebform = this.props.isWebform;
    const config = this.props.config;
    return (
      <nav className="navbar navbar-expand-md navbar-dark home-header-nav">
        <Link className="navbar-brand walmart-brand" to="/dashboard">
          {/* <img src={walmartLogo} /> */}
          <img src={headerLogo} />
        </Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsible-header"
                aria-controls="collapsible-header" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"/>
        </button>
        <div className="collapse navbar-collapse navbar-collapsible-header" id="collapsible-header">
          <ul className="navbar-nav ml-auto">
            {window.location.pathname && !window.location.pathname.startsWith("/onboard") &&
            <li className="nav-item nav-item-help mx-4">
              {isWebform
                ? !this.props.hideHelp && <span className="nav-link nav-help" style={{cursor: "pointer"}} onClick={() => this.props.toggleModal(TOGGLE_ACTIONS.SHOW,
                  {templateName: "StatusModalTemplate", MESSAGE: config.help.modalHelpText, HEADER: config.help.modalHeaderText, TYPE: "NON_STATUS", BUTTON_TEXT: config.help.actionBtnText})}>
                    <img src={helpLogo} height="32px" className="pr-2"/> Help
                  </span>
                : <Link to="/help" className="nav-link nav-help" href="#">
                <img src={helpLogo} height="32px" className="pr-2"/> Help
              </Link>}
            </li>
            }
            {!isWebform && <UserMenu isOnboarded={this.props.isOnboarded}/>}
          </ul>
        </div>
      </nav>
    );
  }
}

HomeHeader.propTypes = {
  isOnboarded: PropTypes.bool,
  logoutUrl: PropTypes.string,
  toggleModal: PropTypes.func,
  userProfile: PropTypes.object,
  isWebform: PropTypes.bool
};

const mapDispatchToProps = {
  toggleModal
}

export  default connect(null, mapDispatchToProps)(HomeHeader);
