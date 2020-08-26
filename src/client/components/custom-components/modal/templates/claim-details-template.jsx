/* eslint-disable no-unused-expressions */
/* eslint-disable no-nested-ternary */
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
    this.state = {
      loader: false
    };
  }

  loader (enable) {
    this.setState(state => {
      const stateClone = {...state};
      stateClone.loader = enable;
      return stateClone;
    });
  }

  // eslint-disable-next-line complexity
  render() {
    let firstName = "";
    let lastName = "";
    let reformattedItems = [];
    const dataLoaded = this.props.data && Object.keys(this.props.data).length > 0;

    if (this.props.data) {
      this.state.loader && this.loader(false);
      firstName = this.props.data.firstName && helper.toCamelCaseIndividual(this.props.data.firstName);
      lastName = this.props.data.lastName && helper.toCamelCaseIndividual(this.props.data.lastName);
      reformattedItems = this.props.data.items && this.props.data.items;
      // this.props.data.items && this.props.data.items.map(item => {
      //   if (item.sellerName.includes(",")) {
      //     const sellers = item.sellerName.split(",");
      //     sellers.forEach(seller => reformattedItems.push({...item, sellerName: seller}));
      //   } else {
      //     reformattedItems.push({...item});
      //   }
      // });
    } else {
      !this.state.loader && this.loader(true);
    }
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
            <div className={`modal-body pl-4 pr-4 text-left px-5${this.state.loader && " loader"}`} style={{minHeight: "25rem"}}>
            {dataLoaded ?
              !this.props.data.error ?
              (
                <React.Fragment>
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
                        <div className="col-3">
                          REPORTED SELLER
                        </div>
                        <div className="col-9">
                          ITEM URL
                        </div>
                      </div>
                      <div className="row item-data-container">
                        <div className="col">
                          {
                            reformattedItems.map((item, i) => {
                              return (
                                <div key={i} className="row item-data-row align-items-center">
                                  <div className="col-3 text-capitalize">
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
                  </div>
                  <div className="row mt-3">
                    <div className="col text-right">
                      <div className="btn btn-sm cancel-btn text-primary" type="button" onClick={ () => this.props.toggleModal(TOGGLE_ACTIONS.HIDE)}>Okay</div>
                    </div>
                  </div>
                </React.Fragment>
              )
              :
              (
                <div className="row">
                  <div className="col">
                    <h5 style={{marginBottom: "1rem"}}>Unable to Display Claim Details for the Ticket ID: {this.props.data.ticketId}</h5>
                    <p>Please ensure provided Ticket ID is valid!</p>
                  </div>
                </div>
              ) : (<p style={{padding: "1rem"}}>Getting Claim Details....</p>)
            }
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

