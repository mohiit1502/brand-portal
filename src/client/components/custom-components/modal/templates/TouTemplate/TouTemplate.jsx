/* eslint-disable no-unused-expressions, filenames/match-regex, complexity */
import React, {useState} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import moment from "moment";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../../actions/modal-actions";
import {showNotification} from "../../../../../actions/notification/notification-actions";
import {updateUserProfile} from "../../../../../actions/user/user-actions";
import Http from "../../../../../utility/Http";
import CONSTANTS from "../../../../../constants/constants";
import * as staticContent from "./../../../../../images";
import mixpanel from "../../../../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../../../../constants/mixpanelConstants";
import "./TouTemplate.component.scss";

const TouTemplate = props => {
  const [loader, setLoader] = useState(false);
  const pages = {
    TOU_ACCEPTANCE: "touAcceptance",
    TOU_REJECTION: "touRejection",
    INVITATION_ACCEPTANCE: "invitationAcceptance"
  };

  const [page, setPage] = useState(pages.INVITATION_ACCEPTANCE);

  const updateUserStatus = outgoingStatus => {
    setLoader(true);
    const profile = props.meta.userProfile;
    const payload = {...profile};
    const mixpanelPayload = {
      API: "/api/users/updateTouStatus/",
      WORK_FLOW: "TOU_VERIFICATION",
      TOU_ACCEPTED: outgoingStatus === "Active" ? true : false,
      CREATED_BY: profile.createdBy,
      ORG_NAME: profile.organization.name,
      USER_STATUS: profile.status
    };
    Http.put(`/api/users/updateTouStatus/${outgoingStatus}`, payload, null, null, props.showNotification, null, "Unable to complete Operation, please try again!")
      .then(() => {
        setLoader(false);
        const profileInner = {...props.meta.userProfile};
        props.toggleModal(TOGGLE_ACTIONS.HIDE);
        profileInner.workflow.code = outgoingStatus === CONSTANTS.USER.STATUS.ACTIVE ? CONSTANTS.CODES.PORTAL_DASHBOARD.CODE : CONSTANTS.CODES.PORTAL_REGISTRATION.CODE;
        props.updateUserProfile(profileInner);
        mixpanelPayload.API_SUCCESS = true;
      })
      .catch(e => {
        setLoader(false);
        mixpanelPayload.API_SUCCESS = false;
        mixpanelPayload.ERROR = e.message ? e.message : e;
      }) .finally(() => {
        mixpanel.trackEvent(MIXPANEL_CONSTANTS.TOU_TEMPLATE.TOU_VERIFICATION, mixpanelPayload);
        outgoingStatus === CONSTANTS.USER.STATUS.TOU_NOT_ACCEPTED && mixpanel.clearCookies();
        outgoingStatus === CONSTANTS.USER.STATUS.TOU_NOT_ACCEPTED && (window.location.pathname = "/logout");
      });
  };

  const profile = props.meta.userProfile;
  const invitedBy = `${profile.createdFirstName} ${profile.createdLastName}  (${profile.createdBy})`;
  const inviteDateParts = profile.createTs && profile.createTs.split("T");
  /* eslint-disable no-magic-numbers */
  const invitedOn = inviteDateParts && inviteDateParts.length === 2 &&
    `${moment(inviteDateParts[0]).format("MMM DD, YYYY")} ${inviteDateParts[1].substring(0, inviteDateParts[1].lastIndexOf("."))}`;
  const bpAccount = profile && profile.organization && profile.organization.name;

  return (
    <div className="c-TouTemplate modal show" id="singletonModal" tabIndex="-1" role="dialog">
      <div className={`modal-dialog modal-dialog-centered modal-lg overflow-hidden ${loader ? " loader" : ""}`} role="document">
        <div className="modal-content">
          <div className="modal-header font-weight-bold align-items-center">
            {page === pages.INVITATION_ACCEPTANCE ? "Welcome to Walmart Brand Portal" : "TERMS OF USE"}
          </div>
          <div className="modal-body position-relative" style={{overflowY: page === pages.TOU_ACCEPTANCE ? "scroll" : "unset"}}>
            <div className={`invitation-acceptance d-inline-block position-absolute w-100 font-size-20${page === pages.INVITATION_ACCEPTANCE ? " visible" : ""}`}>
              <div className="d-inline-block">
                <p className="ml-3 mr-5 pl-3 pr-5" style={{lineHeight: "2.5rem"}}>You've been invited to join the following Brand Portal account. Please indicate below whether you'd like to accept or decline this invitation.</p>
                <div className="row ml-3 mt-5 pt-4">
                  <div className="col-4 overflow-hidden">
                    <div className="header">Invited By</div>
                    <div className="content font-weight-bold">{invitedBy}</div>
                  </div>
                  <div className="col-4 overflow-hidden">
                    <div className="header">Brand Portal Account</div>
                    <div className="content font-weight-bold">{bpAccount}</div>
                  </div>
                  <div className="col-4 overflow-hidden">
                    <div className="header">Invitation Date</div>
                    <div className="content font-weight-bold">{invitedOn}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`tou-acceptance position-absolute mx-auto w-100 px-5${page === pages.TOU_ACCEPTANCE ? " visible" : ""}`}>
              <p>To continue, please read and agree to the Terms of Use.</p>
              <hr />
              <object data={staticContent.TOU} type="application/pdf" width="100%" height="470">
                alt : <a href="TOU.pdf">Terms of Use.pdf</a>
              </object>
            </div>
            <div className={`tou-rejection d-inline-block position-absolute w-100 font-size-20${page === pages.TOU_REJECTION ? " visible" : ""}`}>
              <p className="ml-3 pl-3">You are declining <b>{`${bpAccount}${profile.type === CONSTANTS.USER.USER_TYPE.THIRD_PARTY ? ` (${  profile.companyName  })` : ""}`}"s</b> invitation to join their Walmart Brand Portal account.</p>
              <p className="ml-3 pl-3">Please click the "Decline" button to confirm.</p>
            </div>
          </div>
          <div className="modal-footer position-relative">
            <div className={`btn-panel invitation-buttons-panel position-absolute${page === pages.INVITATION_ACCEPTANCE ? " visible" : ""}`}>
              {page === pages.INVITATION_ACCEPTANCE &&
              <><button type="button" className="btn btn-sm cancel-btn text-primary btn-secondary" onClick={() => setPage(pages.TOU_REJECTION)}>Decline</button>"             "<button type="button" className="btn btn-sm btn-primary submit-btn px-3 ml-3" onClick={() => setPage(pages.TOU_ACCEPTANCE)}>Accept</button></>}
            </div>
            <div className={`btn-panel tou-buttons-panel position-absolute${page === pages.TOU_ACCEPTANCE || page === pages.TOU_REJECTION ? " visible" : ""}`}>
              <button type="button" className="btn btn-sm cancel-btn text-primary btn-secondary" onClick={() => setPage(pages.INVITATION_ACCEPTANCE)}>Cancel</button>
              {page === pages.TOU_ACCEPTANCE ?
                <button type="button" className="btn btn-primary px-3 ml-3" onClick={() => updateUserStatus(CONSTANTS.USER.STATUS.ACTIVE)}>Agree</button>
                : <button type="button" className="btn btn-primary btn-outline-primary px-3 ml-3" onClick={() => updateUserStatus(CONSTANTS.USER.STATUS.TOU_NOT_ACCEPTED)}>Decline</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TouTemplate.propTypes = {
  meta: PropTypes.object,
  showNotification: PropTypes.func,
  toggleModal: PropTypes.func,
  updateUserProfile: PropTypes.func
};

const mapDispatchToProps = {
  showNotification,
  toggleModal,
  updateUserProfile
};

export default withRouter(connect(null, mapDispatchToProps)(TouTemplate));
