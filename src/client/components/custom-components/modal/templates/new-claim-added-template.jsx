import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import "../../../../styles/custom-components/modal/templates/new-user-added-template.scss";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../actions/modal-actions";
import CheckGreenIcon from "../../../../images/check-grn.svg";

class NewClaimAddedTemplate extends React.Component {

  constructor (props) {
    super(props);
    this.getHeaderString = this.getHeaderString.bind(this);
    this.getDescriptionString = this.getDescriptionString.bind(this);
    this.addNewClaim = this.addNewClaim.bind(this);

    this.state = {

    };
  }

  getHeaderString() {
    return `Claim submitted`;
  }

  getDescriptionString() {
    return `You will receive a confirmation email with your claim number (INC14092477) details shortly. You can also check your claim status in 'My claims`;
  }

  addNewClaim () {
    this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
    const meta = { templateName: "NewClaimTemplate" };
    this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
  }

  render() {
    return (
      <div className="modal show" id="singletonModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
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
                  <div className="btn btn-sm btn-primary px-5" onClick={this.addNewClaim}>Submit another claim</div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col">
                  <div className="btn btn-sm btn-block cancel-btn text-primary px-5" onClick={() => this.props.toggleModal(TOGGLE_ACTIONS.HIDE)}>Done</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


NewClaimAddedTemplate.propTypes = {
  toggleModal: PropTypes.func,
  modal: PropTypes.object
};

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = {
  toggleModal
};

export default connect(mapStateToProps, mapDispatchToProps)(NewClaimAddedTemplate);
