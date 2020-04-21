import React from "react";
import { connect } from "react-redux";
import "../../styles/dropdown/dropdown.scss";

class Dropdown extends React.Component {

  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className="dropdown custom-dropdown d-inline-block">

        <span className="dropdown-toggle-btn cursor-pointer" data-toggle="dropdown"> &nbsp; ;;; </span>

        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <a className="dropdown-item" href="#">Edit User Profile</a>
          <a className="dropdown-item" href="#">Suspend User Profile</a>
          <a className="dropdown-item" href="#">Delete User Profile</a>
          <a className="dropdown-item" href="#">Resend Invite</a>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => state;

export default connect(
  mapStateToProps,
  dispatch => ({dispatch})
)(Dropdown);
