import React from "react";
import {connect} from "react-redux";
import NewUserSVG from "../../../images/user.svg";
import PropTypes from "prop-types";
import "../../../styles/modal/templates/new-user-added-template.scss";
import {TOGGLE_ACTIONS, toggleModal} from "../../../actions/modal-actions";

class NewUserAddedTemplate extends React.Component {

  constructor (props) {
    super(props);
    this.getHeaderString = this.getHeaderString.bind(this);
    this.getDescriptionString = this.getDescriptionString.bind(this);

    this.state = {

    };
  }

  getHeaderString() {
    return `${this.props.modal.data.firstName} ${this.props.modal.data.lastName} added as '${this.props.modal.data.role && this.props.modal.data.role.name}'`;
  }

  getDescriptionString() {
    return `An email has been sent to ${this.props.modal.data.loginId}. The profile will become active once ${this.props.modal.data.firstName} completes account setup.`;
  }

  render() {
    return (
      <div className="modal show" id="singletonModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body text-center p-5">
              <div className="row">
                <div className="col">
                  <img src={NewUserSVG} />
                </div>
              </div>
              <div className="row mt-4">
                <div className="col">
                  <span className="status-header">
                    {this.getHeaderString()}
                  </span>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col">
                  <span className="status-description">
                    {this.getDescriptionString()}
                  </span>
                </div>
              </div>
              <div className="row mt-5">
                <div className="col">
                  <div className="btn btn-sm btn-outline-primary px-5" onClick={() => this.props.toggleModal(TOGGLE_ACTIONS.HIDE)}>Okay</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


NewUserAddedTemplate.propTypes = {
  toggleModal: PropTypes.func,
  modal: PropTypes.object
};

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = {
  toggleModal
};

export default connect(mapStateToProps, mapDispatchToProps)(NewUserAddedTemplate);
