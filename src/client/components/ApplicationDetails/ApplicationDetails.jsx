import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import Http from "../../utility/Http";
import "./ApplicationDetails.component.scss";


const ApplicationDetails = props => {
  const {user, handler, org, brand, setApiError, apiError} = props;
  const leftTitle = "Company Information";
  const rightTitle = "Brand Details";
  const attachmentsHeader = "Attachments";
  
  useEffect(() => {
    let companyDetails;
    // if (user && user.organization && user.context !== "new") {
      if (true) {
//         Http.get(`/api/org/applicationDetails/${user.organization.id}`)
      Http.get(`/api/org/applicationDetails/14afba06-a560-40a1-93aa-f0ae6d44ebe6`)
        .then(res => {
          companyDetails = res.body;
          companyDetails.org = companyDetails.company || {};
          companyDetails.org.businessRegistrationDocList = companyDetails.businessRegistrationDocList;
          companyDetails.brand.additionalDocList = companyDetails.additionalDocList;
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
    <div className={`c-ApplicationDetails row text-left mt-4 ml-5 pl-5 pr-3${org || apiError ? "" : " loader"}`}>
      {!apiError ? org ? <><div className="col brand-registration-title">
        <h5 className=" font-weight-bold ">{leftTitle}</h5>
        <div>{org.name}</div>
        <div>{org.address}</div>
        <div>{org.city}, {org.state}</div>
        <div>{org.zip}, {org.countryCode}</div>
        <div className="row mt-3 w-100 pl-3 brand-registration-subtitle font-size-14">
          <span className="w-100 font-weight-bold">{attachmentsHeader}</span>
          {
            org.businessRegistrationDocList &&  org.businessRegistrationDocList.length > 0 
            ? org.businessRegistrationDocList
              .sort((doc1, doc2) => !doc1.createTS || new Date(doc1.createTS) > new Date(doc2.createTS))
              .map(doc => <span className="w-100 mt-2" key={doc}>{doc.documentName}</span>)
            : "No documents attached."
          }
        </div>
      </div>
      <div className="col brand-registration-title">
        <h5 className="font-weight-bold ">{rightTitle}</h5>
        <div>{brand.trademarkNumber}</div>
        <div>{brand.name}</div>
        <div className="commentsStyle">{brand.comments}</div>
        {/* <div>attachment, please review</div> */}
        <div className="row w-100 mt-3 pl-3 brand-registration-subtitle font-size-14">
          <span className="w-100 font-weight-bold">{attachmentsHeader}</span>
          {
            brand.additionalDocList &&  brand.additionalDocList.length > 0
            ? brand.additionalDocList
              .sort((doc1, doc2) => !doc1.createTS || new Date(doc1.createTS) > new Date(doc2.createTS))
              .map(doc => <span className="w-100 mt-2" key={doc}>{doc.documentName}</span>)
            : "No documents attached."
          }
        </div>
      </div></> : <p className="ml-3">Getting application details...</p> : <p>Unable to retrieve application details. Please <a href="/">refresh.</a></p>
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
