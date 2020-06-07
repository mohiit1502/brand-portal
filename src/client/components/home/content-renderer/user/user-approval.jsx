import React from "react";
import { connect } from "react-redux";
import "../../../../styles/content-renderer/user/user-approval.scss";
import PropTypes from "prop-types";


class UserApproval extends React.Component {

  constructor (props) {
    super(props);

  }


  render () {

    return (
      <div className="row user-approval-content h-100">
        <div className="col h-100">
          <div className="row h-10">
            <div className="col">
              <h3>User Approval</h3>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

const mapStateToProps = state => state;

export default connect(
  mapStateToProps,
  dispatch => ({dispatch})
)(UserApproval);
