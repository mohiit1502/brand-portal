import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {saveUser} from "../../../actions/user/edit-user-actions";
import {TOGGLE_ACTIONS} from "../../../actions/modal-actions";

class CreateUserTemplate extends React.Component {

  constructor(props) {
    super(props);
    this.saveChanges = this.saveChanges.bind(this);
  }

  saveChanges() {
    this.props.saveUser();
  }

  render() {
    return (
      <div className="modal fade show" id="singletonModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title mx-auto" id="exampleModalCenterTitle">
asdfksdfk jkasflksdj fkldsa
              </h5>
            </div>
            <div className="modal-body text-center">
              You still have remaining steps to complete your account activation process. Please check XXXX.XXXX@XXX.com and click the email sent to you to activate your account.
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary"  onClick={() => this.props.toggleModal(TOGGLE_ACTIONS.HIDE)}>Close</button>
              <button type="button" className="btn btn-primary" onClick={this.saveChanges}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateUserTemplate.propTypes = {
  toggleModal: PropTypes.func,
  saveUser: PropTypes.func
};

const mapStateToProps = state => {
  return {
    userEdit: state.userEdit
  };
};

const mapDispatchToProps = {
  saveUser
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateUserTemplate);
