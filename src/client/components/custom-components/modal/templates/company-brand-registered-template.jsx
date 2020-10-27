import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import CheckGreenIcon from "../../../../images/check-grn.svg";

import "../../../../styles/custom-components/modal/templates/new-user-added-template.scss";

class CompanyBrandRegisteredTemplate extends React.Component {

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
                    Thank you. Your company and brand details are being verified.
                  </span>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col">
                  <span className="status-description">
                    Once complete, we will send a confirmation to your registered email. Please login using the shared link.
                  </span>
                </div>
              </div>
              <div className="row mt-5">
                <div className="col">
                  <a className="btn btn-sm btn-outline-primary px-5" href={logoutUrl}>Logout</a>
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
  // toggleModal: PropTypes.func,
  logoutUrl: PropTypes.string,
  modal: PropTypes.object
};

const mapStateToProps = state => {
  return {
    logoutUrl: state.user.logoutUrl
  };
};

export default connect(mapStateToProps)(CompanyBrandRegisteredTemplate);
