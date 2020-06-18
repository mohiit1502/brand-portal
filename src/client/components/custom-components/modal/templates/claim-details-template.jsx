import React from "react";
import {connect} from "react-redux";
import PlusIcon from "../../../../images/plus.svg";
import {saveBrandInitiated} from "../../../../actions/brand/brand-actions";
import PropTypes from "prop-types";
import "../../../../styles/custom-components/modal/templates/new-claim-template.scss";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../actions/modal-actions";
import CustomInput from "../../custom-input/custom-input";
import Http from "../../../../utility/Http";
import {NOTIFICATION_TYPE, showNotification} from "../../../../actions/notification/notification-actions";
import ClientUtils from "../../../../utility/ClientUtils";

class ClaimDetailsTemplate extends React.Component {

  constructor(props) {
    super(props);
    console.log(props);
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="modal new-claim-modal show" id="singletonModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
          <div className="modal-content">
            <div className="modal-header align-items-center">
              Claim Details
              <button type="button" className="close text-white" aria-label="Close" onClick={ () => this.props.toggleModal(TOGGLE_ACTIONS.HIDE)}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body text-left">
              sdfsdf
            </div>
            <div className="modal-footer">
              <div className="btn btn-sm cancel-btn text-primary" type="button" onClick={ () => this.props.toggleModal(TOGGLE_ACTIONS.HIDE)}>Okay</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ClaimDetailsTemplate.propTypes = {
  modal: PropTypes.object,
  saveBrandInitiated: PropTypes.func,
  toggleModal: PropTypes.func,
  data: PropTypes.object,
  showNotification: PropTypes.func
};

const mapStateToProps = state => {
  return {
    modal: state.modal
  };
};

const mapDispatchToProps = {
  toggleModal,
  saveBrandInitiated,
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClaimDetailsTemplate);

