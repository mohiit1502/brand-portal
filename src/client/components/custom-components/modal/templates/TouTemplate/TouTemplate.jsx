import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import moment from "moment";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../../actions/modal-actions";
import {showNotification} from "../../../../../actions/notification/notification-actions";
import {updateUserProfile} from "../../../../../actions/user/user-actions";
import CustomInput from "../../../custom-input/custom-input";
import Http from "../../../../../utility/Http";
import CONSTANTS from "../../../../../constants/constants";
import * as staticContent from "./../../../../../images";
import "./TouTemplate.component.scss";

const TouTemplate = props => {
  const [loader, setLoader] = useState(false);
  const [brands, setBrands] = useState([]);
  const pages = {
    TOU_ACCEPTANCE: "touAcceptance",
    INVITATION_ACCEPTANCE: "invitationAcceptance"
  }

  const [page, setPage] = useState(pages.INVITATION_ACCEPTANCE)
  useEffect(() => {
    Http.get("/api/brands")
     .then(res => {
       res && res.body && res.body.content && res.body.content.forEach(brand => brands.push(brand.brandName));
       setBrands(brands)
      }).catch(e => console.log(e))
  }, [brands]);

  const updateUserStatus = (outgoingStatus) => {
    setLoader(true);
    const profile = props.meta.userProfile;
    const payload = {...profile}
    Http.put(`/api/users/updateTouStatus/${outgoingStatus}`, payload, null, null, props.showNotification, null, "Unable to complete Operation, please try again!")
      .then((res) => {
        setLoader(false);
        const profile = {...props.meta.userProfile};
        props.toggleModal(TOGGLE_ACTIONS.HIDE);
        profile.workflow.code = outgoingStatus === "Active" ? CONSTANTS.CODES.PORTAL_DASHBOARD.CODE : CONSTANTS.CODES.PORTAL_REGISTRATION.CODE;
        props.updateUserProfile(profile);
      })
      .catch(e => {
        console.log(e);
        setLoader(false);
      })
  };

  const profile = props.meta.userProfile;
  const invitedBy = `${profile.firstName} ${profile.lastName}  (${profile.createdBy})`;
  const inviteDateParts = profile.createTs && profile.createTs.split("T");
  const invitedOn = inviteDateParts && inviteDateParts.length === 2 &&
    `${moment(inviteDateParts[0]).format("MMM DD, YYYY")} ${inviteDateParts[1].substring(0, inviteDateParts[1].lastIndexOf("."))}`;

  return (
    <div className="c-TouTemplate modal show" id="singletonModal" tabIndex="-1" role="dialog">
      <div className={`modal-dialog modal-dialog-centered modal-lg overflow-hidden ${loader ? " loader" : ""}`} role="document">
        <div className="modal-content">
          <div className="modal-header font-weight-bold align-items-center">
            {page === pages.INVITATION_ACCEPTANCE ? "Welcome to Walmart Brand Portal" : "TERMS OF USE"}
            {/*<button type="button" className="close text-white" aria-label="Close" onClick={() => props.toggleModal(TOGGLE_ACTIONS.HIDE)}>*/}
            {/*  <span className="close-btn" aria-hidden="true">&times;</span>*/}
            {/*</button>*/}
          </div>
          <div className="modal-body position-relative" style={{overflowY: page === pages.TOU_ACCEPTANCE ? "scroll" : "unset"}}>
            {/*<button className="button-navigator position-absolute" onClick={() => setPage(page === pages.INVITATION_ACCEPTANCE ? pages.TOU_ACCEPTANCE : pages.INVITATION_ACCEPTANCE)}*/}
            {/*  style={{right: page === pages.INVITATION_ACCEPTANCE ? "1rem" : "unset", left: page === pages.INVITATION_ACCEPTANCE ? "unset" : "1rem", }}>*/}
            {/*  {page === pages.INVITATION_ACCEPTANCE ? ">" : "<"}</button>*/}
            <div className={`invitation-acceptance d-inline-block position-absolute w-100 font-size-20${page === pages.INVITATION_ACCEPTANCE ? " visible": ""}`}>
              <div className="d-inline-block">
                <p className="ml-3 mr-5 pl-3 pr-5">You've been invited to join the following Brand Portal account. Please indicate below whether you'd like to accept or decline this invitation.</p>
                {/*<p className="mt-4">To continue, please confirm that you have read and agree to the <a href="#" onClick={() => setPage(pages.TOU_ACCEPTANCE)}>Terms of Use</a></p>*/}
                {/*<CustomInput id="tou_cb" inputId="tou_cb" key="tou_cb" type="_checkBox" required={true} containerClasses="mt-5 pt-3 text-left"*/}
                {/*  label="I have read and agree to the Terms of Use" selected={touAccepted} onChange={() => setTouAccepted(!touAccepted)}/>*/}
                <div className="row ml-3 mt-5 pt-4">
                  <div className="col-4 overflow-hidden">
                    <div className="header">Invited By</div>
                    <div className="content font-weight-bold">{invitedBy}</div>
                  </div>
                  <div className="col-4 overflow-hidden">
                    <div className="header">Brand Portal Account</div>
                    <div className="content font-weight-bold">Nike LLC.</div>
                  </div>
                  <div className="col-4 overflow-hidden">
                    <div className="header">Invitation Date</div>
                    <div className="content font-weight-bold">{invitedOn}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`tou-acceptance position-absolute mx-auto w-100 px-5${page === pages.TOU_ACCEPTANCE ? " visible": ""}`}>
              {/*<p className="font-italic">You have been invited to manage IP rights for the following brand/s</p>*/}
              {/*<h4 className={`c-BrandList text-center font-weight-bold pt-4 pb-4${brands.length === 0 ? " field-loader" : ""}`}>{brands.join(", ")}</h4>*/}
              <p>To continue, please read and agree to the Terms of Use.</p>
              <hr />
              <object data={staticContent.TOU} type="application/pdf" width="100%" height="470">
                alt : <a href="TOU.pdf">Terms of Use.pdf</a>
              </object>
            </div>
          </div>
          <div className="modal-footer position-relative">
            <div className={`btn-panel invitation-buttons-panel position-absolute${page === pages.INVITATION_ACCEPTANCE ? " visible": ""}`}>
              <button type="button" className="btn btn-sm cancel-btn text-primary btn-secondary" onClick={() => {}}>Decline</button>
              {page === pages.INVITATION_ACCEPTANCE && <button type="button" className="btn btn-sm btn-primary submit-btn px-3 ml-3" onClick={() => setPage(pages.TOU_ACCEPTANCE)}>Accept</button>}
            </div>
            <div className={`btn-panel tou-buttons-panel position-absolute${page === pages.TOU_ACCEPTANCE ? " visible" : ""}`}>
              {/*<a className="ml-0" href="/js/Brand Portal - Terms of Use FINAL (Sept 15 2020).pdf" download>Download PDF</a>*/}
              <button type="button" className="btn btn-sm cancel-btn text-primary btn-secondary" onClick={() => setPage(pages.INVITATION_ACCEPTANCE)}>Cancel</button>
              <button type="button" className="btn btn-primary px-3 ml-3" onClick={() => updateUserStatus("Active")}>Agree</button>
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
