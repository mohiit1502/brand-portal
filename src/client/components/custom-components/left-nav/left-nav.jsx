import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import ClientUtils from "../../../utility/ClientUtils";
import authorizations from "./../../../config/authorizations";
import restConfig from "./../../../config/rest";
import CONSTANTS from "../../../constants/constants";
import * as images from "./../../../images";
import "../../../styles/custom-components/left-nav/left-nav.scss";

class Leftnav extends React.Component {
  constructor (props) {
    super(props);
    this.constructNavigationPanel = this.constructNavigationPanel.bind(this);

    this.state = {
      NAVIGATION_PANEL: this.constructNavigationPanel(CONSTANTS.NAVIGATION_PANEL, props.location.pathname, authorizations)
    };
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen(location => {
      this.updateNavigationPanel(this.state.NAVIGATION_PANEL, location.pathname);
    });
  }
  componentWillUnmount() {
      this.unlisten();
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

  render () {
    return (
      <div className="left-nav d-inline-block">
        <ul className="nav flex-column mt-3">
          {
            this.state.NAVIGATION_PANEL.map(item => {
              return (
                <li className={`nav-item main-nav-item py-2 ${item.active ? "active" : "inactive"}`} key={item.id}>
                  <Link className="nav-link" to={item.href} onClick={ () => {this.updateNavigationPanel(this.state.NAVIGATION_PANEL, item.href);}}>
                    <img className="nav-link-image pl-3 pr-1" src={images[item.image]} width="46px"/>{item.value}
                  </Link>
                  {
                    item.children && <ul className="nav flex-column">
                      {item.children.map(subItem => {
                        return (
                          <li className={`nav-item sub-nav-item pl-3 ${subItem.active ? "active" : "inactive"}`} key={`${item.id}-${subItem.id}`}>
                            <Link className="nav-link" to={{pathname: subItem.href, state: {prevPath: this.props.location.pathname}}} onClick={ () => {this.updateNavigationPanel(this.state.NAVIGATION_PANEL, subItem.href);}}>
                              {subItem.value}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  }
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }
}

Leftnav.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  userProfile: PropTypes.object
};


export  default  connect()(withRouter(Leftnav));
