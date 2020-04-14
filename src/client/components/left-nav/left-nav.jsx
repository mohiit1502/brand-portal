import React from "react";
import { connect } from "react-redux";
import ClientUtils from "../../utility/ClientUtils";
import {
  useRouteMatch,
  useParams,
  useLocation
} from "react-router-dom";
import "../../styles/left-nav/left-nav.scss";


class Leftnav extends React.Component {
  constructor (props) {
    super(props);
    this.navigateTo = this.navigateTo.bind(this);
  }

  navigateTo (evt, item) {
    return ClientUtils.navigateTo(item.href);
  }

  render () {

    const nav = [
      { id: "1", name: "CLAIMS", value: "CLAIMS", href: "/claims", active: false},
      { id: "2", name: "BRANDS", value: "BRANDS", href: "/brands", active: false},
      {
        id: "3",
        name: "USERS",
        value: "USERS",
        href: "users/user-list",
        children: [
          { id: "31", name: "USERLIST", value: "User List", href: "users/user-list", active: true},
          { id: "32", name: "APPROVALLIST", value: "Approval List", href: "users/approval-list", active: false}
        ]
      }
    ];

    return (
      <div className="left-nav h-100 w-25">
        <ul className="nav flex-column">
          {
            nav.map((item => {
              return (
                <li className={`nav-item ${item.active ? "active" : "inactive"}`} key={item.id}>
                  <a className="nav-link" href={item.href} onClick={evt => {this.navigateTo(evt, item);}}>{item.value}</a>
                  {
                    item.children && <ul className="nav flex-column">
                      {item.children.map(subItem => {
                        return (
                          <li className={`nav-item sub-nav-item pl-3 ${subItem.active ? "active" : "inactive"}`} key={subItem.id}>
                            <a className="nav-link" href={subItem.href}>{subItem.value}</a>
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
