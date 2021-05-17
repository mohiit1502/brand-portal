import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import UserMenu from "../UserMenu/UserMenu";
import headerLogo from "../../../images/WMWhite-horizontal.svg";
import helpLogo from "../../../images/help-header.png";
import "../../../styles/custom-components/headers/home-header.scss";

class HomeHeader extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    const isWebForm = this.props.isWebForm;
    return (
      <nav className="navbar navbar-expand-md navbar-dark home-header-nav">
        <Link className="navbar-brand walmart-brand" to="/dashboard">
          {/* <img src={walmartLogo} /> */}
          <img src={headerLogo} />
        </Link>
        {!isWebForm &&
        <>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsible-header"
                  aria-controls="collapsible-header" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"/>
          </button>
          <div className="collapse navbar-collapse navbar-collapsible-header" id="collapsible-header">
            <ul className="navbar-nav ml-auto">
              {window.location.pathname && !window.location.pathname.startsWith("/onboard") &&
              <li className="nav-item nav-item-help mx-4">
                <Link to="/help" className="nav-link nav-help" href="#">
                  <img src={helpLogo} height="32px" className="pr-2"/> Help
                </Link>
              </li>
              }
              <UserMenu isOnboarded={this.props.isOnboarded}/>
            </ul>
          </div>
        </>
        }
      </nav>
    );
  }
}

HomeHeader.propTypes = {
  isOnboarded: PropTypes.bool,
  logoutUrl: PropTypes.string,
  userProfile: PropTypes.object,
  isWebForm: PropTypes.bool
};

export  default  HomeHeader;
