import React from "react";
import { connect } from "react-redux";
import ClientUtils from "../../../utility/ClientUtils";
import PropTypes from "prop-types";
import CONSTANTS from "../../../constants/constants";
import "../../../styles/custom-components/left-nav/left-nav.scss";
import authorizations from "./../../../config/authorizations";
import restConfig from "./../../../config/rest";
import { Link } from "react-router-dom";

class Leftnav extends React.Component {
  constructor (props) {
    super(props);
    this.navigateTo = this.navigateTo.bind(this);
    this.constructNavigationPanel = this.constructNavigationPanel.bind(this);

    this.state = {
      NAVIGATION_PANEL: this.constructNavigationPanel(CONSTANTS.NAVIGATION_PANEL, props.location.pathname, authorizations)
    };
  }

  // eslint-disable-next-line complexity
  constructNavigationPanel (panel, pathname) {
    const {userProfile} = this.props;
    const panelFiltered = [];
    for (const i in panel) {
      const currentPanel = panel[i].name;
      const sectionAccessKey = authorizations[panel[i].name] && authorizations[currentPanel].SECTION_ACCESS;
      if (!restConfig.AUTHORIZATIONS_ENABLED
        || (currentPanel === CONSTANTS.SECTION.CLAIMS
        || !sectionAccessKey
        || (sectionAccessKey && sectionAccessKey.includes(userProfile && userProfile.role ? userProfile.role.name : "")))
      ) {
        // TODO remove below two lines when approval list adds to MVP
        const shouldRender = restConfig.IS_MVP ? currentPanel !== CONSTANTS.SECTION.APPROVALLIST : true;
        if (shouldRender) {
          panelFiltered[i] = {...panel[i]};
          // panelFiltered[i].active = panelFiltered[i].href === pathname;
          panelFiltered[i].active = pathname && new RegExp(panelFiltered[i].href).test(pathname);
          if (panelFiltered[i].hasOwnProperty("children")) {
            panelFiltered[i].children = this.constructNavigationPanel(panelFiltered[i].children, pathname);
          }
        }
      }
    }
    return panelFiltered;
  }

  updateNavigationPanel (panel, pathname) {
    const updatedPanel = this.constructNavigationPanel(panel, pathname);
    this.setState({
      NAVIGATION_PANEL: updatedPanel
    });
  }

  navigateTo (evt, item) {
    return ClientUtils.navigateTo(item.href);
  }

  render () {
    return (
      <div className="left-nav d-inline-block">
        <ul className="nav flex-column">
          {
            this.state.NAVIGATION_PANEL.map((item => {
              return (
                <li className={`nav-item main-nav-item ${item.active ? "active" : "inactive"}`} key={item.id}>
                  <Link className="nav-link" to={item.href} onClick={ () => {this.updateNavigationPanel(this.state.NAVIGATION_PANEL, item.href);}}>{item.value}</Link>
                  {
                    item.children && <ul className="nav flex-column">
                      {item.children.map(subItem => {
                        return (
                          <li className={`nav-item sub-nav-item pl-3 ${subItem.active ? "active" : "inactive"}`} key={subItem.id}>
                            <Link className="nav-link" to={subItem.href} onClick={ () => {this.updateNavigationPanel(this.state.NAVIGATION_PANEL, subItem.href);}}>
                              {subItem.value}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  }
                </li>
              );
            }))
          }
        </ul>
      </div>
    );
  }
}

Leftnav.propTypes = {
  location: PropTypes.object,
  userProfile: PropTypes.object
};


export  default  connect()(Leftnav);
