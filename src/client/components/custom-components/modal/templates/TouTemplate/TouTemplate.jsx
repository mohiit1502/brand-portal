import React, {useState} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../../actions/modal-actions";
import Http from "../../../../../utility/Http";
import CONSTANTS from "../../../../../constants/constants";
import * as staticContent from "./../../../../../images";
import "./TouTemplate.component.scss";
import {updateUserProfile} from "../../../../../actions/user/user-actions";

const TouTemplate = props => {

  const [loader, setLoader] = useState(false);

  const updateUserStatus = (outgoingStatus) => {
    setLoader(true);
    Http.put(`/api/users/${props.meta.userProfile ? props.meta.userProfile.email : null}/status/${outgoingStatus}`)
      .then(() => {
        setLoader(false);
        const profile = {...props.meta.userProfile};
        props.toggleModal(TOGGLE_ACTIONS.HIDE)
        // props.history.push(outgoingStatus === "TOU_AGREED" ? CONSTANTS.ROUTES.DASHBOARD : CONSTANTS.ROUTES.ONBOARD.COMPANY_REGISTER);
        profile.workflow.code = outgoingStatus === "TOU_AGREED" ? CONSTANTS.CODES.PORTAL_DASHBOARD.CODE : CONSTANTS.CODES.PORTAL_REGISTRATION.CODE;
        props.updateUserProfile(profile);
      })
      .catch(e => {
        console.log(e);
        setLoader(false);
        // TODO Remove below line post backend changes addition
        const profile = {...props.meta.userProfile};
        props.toggleModal(TOGGLE_ACTIONS.HIDE)
        profile.workflow.code = outgoingStatus === "TOU_AGREED" ? CONSTANTS.CODES.PORTAL_DASHBOARD.CODE : CONSTANTS.CODES.PORTAL_REGISTRATION.CODE;
        props.updateUserProfile(profile);
        // props.history.push(outgoingStatus === "TOU_AGREED" ? CONSTANTS.ROUTES.DASHBOARD : CONSTANTS.ROUTES.ONBOARD.COMPANY_REGISTER);
      })
  };

  return (
    <div className="c-TouTemplate modal show" id="singletonModal" tabIndex="-1" role="dialog">
      <div className={`modal-dialog modal-dialog-centered modal-lg${loader ? " loader" : ""}`} role="document">
        <div className="modal-content">
          <div className="modal-header font-weight-bold align-items-center">
            TERMS OF USE
            <button type="button" className="close text-white" aria-label="Close" onClick={() => props.toggleModal(TOGGLE_ACTIONS.HIDE)}>
              <span className="close-btn" aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div>
              <p className="font-italic">You have been invited to manage IP rights for the following brand/s</p>
              {/*<h4 className="text-center font-weight-bold font-italic">{props.meta.userProfile && props.meta.userProfile.brands && props.meta.userProfile.brands.join(", ")}</h4>*/}
              <h4 className="c-BrandList text-center font-weight-bold">Brand1, Brand2, Brand3</h4>
              <p className="font-italic">Before proceeding you need to acknowledge and accept the following terms of use, please click "AGREE" to proceed to the dashboard or "DECLINE" to reject.</p>
            </div>
            <hr />
            <object data={staticContent.TOU} type="application/pdf" width="100%" height="300">
              alt : <a href="TOU.pdf">Terms of Use.pdf</a>
            </object>
          </div>
          <div className="modal-footer">
            <a href="/js/Brand Portal - Terms of Use FINAL (Sept 15 2020).pdf" download>Download PDF</a>
            <div className="btn btn-outline-danger ml-auto" style={{border: "none", borderRadius: "20px", fontWeight: "bold"}} onClick={() => updateUserStatus("TOU_DECLINED")}>DECLINE</div>
            <div className="btn btn-primary" style={{paddingLeft: "1.3rem", paddingRight: "1.3rem"}} onClick={() => updateUserStatus("TOU_AGREED")}>AGREE</div>
          </div>
        </div>
      </div>
    </div>
  );
};

TouTemplate.propTypes = {
  meta: PropTypes.object,
  toggleModal: PropTypes.func,
  updateUserProfile: PropTypes.func
};

const mapDispatchToProps = {
  toggleModal,
  updateUserProfile
};

export default withRouter(connect(null, mapDispatchToProps)(TouTemplate));
