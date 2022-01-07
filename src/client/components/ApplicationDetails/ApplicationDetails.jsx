import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Http from "../../utility/Http";
import "./ApplicationDetails.component.scss";


const ApplicationDetails = props => {
  const { user, handler, org, brand, setApiError, apiError } = props;
  const leftTitle = "Company Information";
  const rightTitle = "Brand Information";
  const attachmentsHeader = "Attachments";

  useEffect(() => {
    let companyDetails;
    if (user && user.organization) {
      Http.get(`/api/org/applicationDetails/${user.organization.id}`)
        .then(res => {
          companyDetails = res.body;
          companyDetails.org = companyDetails.company || {};
          companyDetails.org.businessRegistrationDocList = companyDetails.businessRegistrationDocList;
          companyDetails.brand.additionalDocList = companyDetails.additionalDocList;
          if (companyDetails.orgStatus === "ON_HOLD" && companyDetails.reasonCode !== "hold_ro_application_edit") {
            companyDetails.orgStatus = "NEW";
          }
          delete companyDetails.company;
          delete companyDetails.businessRegistrationDocList;
          delete companyDetails.additionalDocList;

          handler(companyDetails);
        })
        .catch(() => setApiError && setApiError(true));
    }
  }, []);

  /*eslint-disable no-nested-ternary*/
  return (
    <div className={`c-ApplicationDetails text-left row ml-5 pl-5${org || apiError ? "" : " loader"}`}>
      {!apiError ? org ? <>
        <div className="col-12 brand-registration-title">
          <div className="row">
            <div className="col">
              <h5 className=" font-weight-bold ">{leftTitle}</h5>
              <div>{org.name}</div>
              <div>{org.address}</div>
              <div>{org.city}, {org.state}</div>
              <div>{org.zip}, {org.countryCode}</div>
            </div>
            <div className="col">
              <h5 className="font-weight-bold ">{rightTitle}</h5>
              <div>{brand.trademarkNumber}</div>
              <div>{brand.name}</div>
              <div className="commentsStyle">{brand.comments}</div>
            </div>
          </div>
          <div className="row">
            <div className="col-6 overflow-x-auto mt-3 brand-registration-subtitle">
              <span className="w-100 mt-3 font-weight-bold font-size-14">{attachmentsHeader}</span>
              {
                org.businessRegistrationDocList && org.businessRegistrationDocList.length > 0
                  ? org.businessRegistrationDocList
                    .sort((doc1, doc2) => !doc1.createTS || new Date(doc1.createTS) > new Date(doc2.createTS))
                    .map(doc => <span className="w-100 d-block mt-2" key={doc}>{doc.documentName}</span>)
                  : <span className="d-block mt-2">No documents attached.</span>
              }
            </div>
            <div className="col-6 overflow-x-auto mt-3 brand-registration-subtitle">
              <span className="w-100 mt-3 font-weight-bold font-size-14">{attachmentsHeader}</span>
              {
                brand.additionalDocList && brand.additionalDocList.length > 0
                  ? brand.additionalDocList
                    .sort((doc1, doc2) => !doc1.createTS || new Date(doc1.createTS) > new Date(doc2.createTS))
                    .map(doc => <span className="d-block w-100 mt-2" key={doc}>{doc.documentName}</span>)
                  : <span className="d-block mt-2">No documents attached.</span>
              }
            </div>
          </div>
        </div>
      </> : <p className="ml-3">Getting application details...</p> : <p>Unable to retrieve application details. Please <a href="/">refresh.</a></p>
      }
    </div>
  );
};

ApplicationDetails.propTypes = {
  org: PropTypes.object,
  brand: PropTypes.object,
  apiError: PropTypes.bool,
  setApiError: PropTypes.func,
  user: PropTypes.object
};

export default ApplicationDetails;
