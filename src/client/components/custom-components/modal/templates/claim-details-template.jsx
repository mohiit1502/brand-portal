import React from "react";
import {connect} from "react-redux";
import {saveBrandInitiated} from "../../../../actions/brand/brand-actions";
import PropTypes from "prop-types";
import "../../../../styles/custom-components/modal/templates/claim-details-template.scss";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../actions/modal-actions";
import {showNotification} from "../../../../actions/notification/notification-actions";
import helper from "./../../../../utility/helper";

class ClaimDetailsTemplate extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const firstName = this.props.data.firstName ? helper.toCamelCaseIndividual(this.props.data.firstName) : "";
    const lastName = this.props.data.lastName ? helper.toCamelCaseIndividual(this.props.data.lastName) : "";
    // const brandName = this.props.data.brandName ? helper.toCamelCaseEach(this.props.data.brandName) : "";

    return (
      <div className="modal claim-details-modal show" id="singletonModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
          <div className="modal-content">
            <div className="modal-header align-items-center px-5">
              Claim Details
              <button type="button" className="close text-white" aria-label="Close" onClick={ () => this.props.toggleModal(TOGGLE_ACTIONS.HIDE)}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body text-left px-5">
              <div className="row case-header-row">
                <div className="col">
                  <div className="case-header-text">{this.props.data.caseNumber}
                    <div className=" case-status badge badge-pill badge-warning font-weight-normal">{this.props.data.claimStatus}</div>
                  </div>
                </div>
              </div>
              <div className="row claim-snapshots-row mt-4">
                <div className="col">
                  <div className="snapshot-header">Claim Type </div>
                  <div className="snapshot-value"> {this.props.data.claimType} </div>
                </div>
                <div className="col">
                  <div className="snapshot-header">Copyright Number </div>
                  <div className="snapshot-value"> {this.props.data.registrationNumber} </div>
                </div>
                <div className="col">
                  <div className="snapshot-header">Brand Name </div>
                  <div className="snapshot-value"> {this.props.data.brandName} </div>
                </div>
                <div className="col">
                  <div className="snapshot-header">Claim By </div>
                  <div className="snapshot-value">{(firstName ? firstName.concat(" ") : "") + lastName}</div>
                </div>
                <div className="col">
                  <div className="snapshot-header">Claim Date </div>
                  <div className="snapshot-value"> {this.props.data.claimDate} </div>
                </div>
              </div>
              <div className="row justify-content-center items-row mt-4">
                <div className="col">
                  <div className="row item-header-row py-2">
                    <div className="col-3 pl-4">
                      REPORTED SELLER
                    </div>
                    <div className="col-9">
                      ITEM URL
                    </div>
                  </div>
                  <div className="row item-data-container">
                    <div className="col">
                      {
                        this.props.data.items.map((item, i) => {
                          return (
                            <div key={i} className="row item-data-row align-items-center">
                              <div className="col-3 pl-4 text-capitalize">
                                {item.sellerName}
                              </div>
                              <div className="col-9">
                                <a className="text-primary cursor-pointer" href={item.itemUrl}> {item.itemUrl} </a>
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col">
                  <span className="font-size-14">Comments</span>
                  <p>{this.props.data.comments}</p>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col">
                  <span className="font-size-14">Status Detail</span>
                  <h6>{this.props.data.statusDetails}</h6>
                </div>
                {this.props.data.snNumber && <div className="col">
                  <span className="font-size-14">Reference Number</span>
                  <h6>{this.props.data.snNumber}</h6>
                </div>}
              </div>
              <div className="row mt-3">
                <div className="col text-right">
                  <div className="btn btn-sm cancel-btn text-primary" type="button" onClick={ () => this.props.toggleModal(TOGGLE_ACTIONS.HIDE)}>Okay</div>
                </div>
              </div>
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

