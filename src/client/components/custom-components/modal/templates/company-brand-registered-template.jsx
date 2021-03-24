import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import BrandRegisteredIcon from "../../../../images/brandRegisteredIcon.png";

import "../../../../styles/custom-components/modal/templates/new-user-added-template.scss";
import mixpanel from "../../../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../../../constants/MixPanelConsants";

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
        <div className="modal-dialog modal-dialog-centered modal-lg company-brand-registered-template" role="document">
          <div className="modal-content">
            <div className="modal-body text-center p-4">
              <div className="row">
                <div className="col">
                  <img src={BrandRegisteredIcon} height={100}/>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col">
                  <span className="status-header font-weight-bold">
                    Thank you. Your company and brand details are being verified.
                  </span>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col">
                  <span className="status-description">
                    Once complete, we will send a confirmation to your registered email. <br/> Login using the shared link.
                  </span>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col">
                  <a className="btn btn-sm btn-primary px-5" href={logoutUrl} onClick={mixpanel.logout(MIXPANEL_CONSTANTS.LOGOUT.USER_LOGOUT)}>Logout</a>
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
