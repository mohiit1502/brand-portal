import React from "react";
import {connect} from "react-redux";
import CheckGreenIcon from "../../../../images/check-grn.svg";

import PropTypes from "prop-types";
import "../../../../styles/modal/templates/new-user-added-template.scss";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../actions/modal-actions";

class CompanyBrandRegisteredTemplate extends React.Component {

  constructor (props) {
    super(props);
  }

  render() {
    return (
      <div className="modal show" id="singletonModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-body text-center p-5">
              <div className="row">
                <div className="col">
                  <img src={CheckGreenIcon} height={87}/>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col">
                  <span className="status-header">
                    Thank you for sharing your company and brand details
                  </span>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col">
                  <span className="status-description">
                    Your company and brand details are currently being verified. Once complete, you will receive a confirmation on your registred email ID. Please login using shared link.
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


CompanyBrandRegisteredTemplate.propTypes = {
  toggleModal: PropTypes.func,
  modal: PropTypes.object
};

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = {
  toggleModal
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyBrandRegisteredTemplate);
