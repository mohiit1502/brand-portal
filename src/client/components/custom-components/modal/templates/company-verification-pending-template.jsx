import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import CheckGreenIcon from "../../../../images/check-grn.svg";
import mixpanel from "../../../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../../../constants/MixPanelConsants";

class CompanyVerificationPendingTemplate extends React.Component {

  constructor (props) {
    super(props);
  }

  render() {
    // const baseUrl = CONSTANTS.URL.DOMAIN[process.env.NODE_ENV && process.env.NODE_ENV.toUpperCase()];
    const baseUrl = window.location.origin;
    const logoutUrl = this.props.logoutUrl && this.props.logoutUrl.replace("__domain__", baseUrl);

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
                    Account verification in process
                  </span>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col">
                  <span className="status-description">
                    Your company and brand details are currently being verified. <br/>Once complete, we will send a confirmation to your registered email. Please login using the shared link.
                  </span>
                </div>
              </div>
              <div className="row mt-5">
                <div className="col">
                  {/*<div className="btn btn-sm btn-outline-primary px-5" onClick={() => this.props.toggleModal(TOGGLE_ACTIONS.HIDE)}>Okay</div>*/}
                  <a className="btn btn-sm btn-outline-primary px-5" href={logoutUrl}
                    onClick={() => {mixpanel.logout(MIXPANEL_CONSTANTS.LOGOUT.LOGOUT);}}>Logout</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


CompanyVerificationPendingTemplate.propTypes = {
  // toggleModal: PropTypes.func,
  logoutUrl: PropTypes.string,
  modal: PropTypes.object
};

const mapStateToProps = state => {
  return {
    logoutUrl: state.user.logoutUrl
  };
};

const mapDispatchToProps = {
  // toggleModal
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyVerificationPendingTemplate);
