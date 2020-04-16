import React from "react";
import { connect } from "react-redux";
import ClientUtils from "../../utility/ClientUtils";
import "../../styles/left-nav/left-nav.scss";
import CONSTANTS from "../../constants/constants";

class Leftnav extends React.Component {
  constructor (props) {
    super(props);
    this.navigateTo = this.navigateTo.bind(this);
    this.constructNavigationPanel = this.constructNavigationPanel.bind(this);

    this.state = {
      NAVIGATION_PANEL: this.constructNavigationPanel(CONSTANTS.NAVIGATION_PANEL, props.location.pathname)
    };
  }

  constructNavigationPanel (panel, pathname) {

    panel = [...panel];

    for (const i in panel) {
      panel[i].active = panel[i].href === pathname;
      if (panel[i].hasOwnProperty("children")) {
        panel[i].children = this.constructNavigationPanel(panel[i].children, pathname);
      }
    }
    return panel;
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
                <li className={`nav-item ${item.active ? "active" : "inactive"}`} key={item.id}>
                  <a className="nav-link" href={item.href} onClick={evt => {this.navigateTo(evt, item);}}>{item.value}</a>
                  {
                    item.children && <ul className="nav flex-column">
                      {item.children.map(subItem => {
                        return (
                          <li className={`nav-item sub-nav-item pl-3 ${subItem.active ? "active" : "inactive"}`} key={subItem.id}>
                            <a className="nav-link" href={subItem.href} onClick={ () => {this.updateNavigationPanel(this.state.NAVIGATION_PANEL, subItem.href);}}>
                              {subItem.value}
                            </a>
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

export  default  connect()(Leftnav);
