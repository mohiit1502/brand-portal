import React from "react";
import { connect } from "react-redux";
import walmartLogo from "../../images/wm-white-logo.png";
import "../../styles/headers/home-header.scss";
import CONSTANTS from "../../constants/constants";

class HomeHeader extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {

    return (
      <nav className="navbar navbar-expand-md navbar-dark home-header-nav">
        <a className="navbar-brand walmart-brand" href="#">
          <img src={walmartLogo} />
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsible-header"
                aria-controls="collapsible-header" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"/>
        </button>

        <div className="collapse navbar-collapse navbar-collapsible-header" id="collapsible-header">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item nav-item-help mx-4">
              <a className="nav-link" href="#">
                <span className="badge badge-pill bg-white text-blue"> ? </span> &nbsp; Help
              </a>
            </li>
            <li className="nav-item dropdown nav-item-profile ml-4">
              <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true"
                 aria-expanded="false">Josh Hopkins</a>
              <div className="dropdown-menu dropdown-menu-right no-border-radius shadow-sm mt-2">
                <a className="dropdown-item" href={CONSTANTS.ROUTES.PROFILE.USER}>Profile</a>
                <a className="dropdown-item" href="#">Logout</a>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export  default  connect()(HomeHeader);
