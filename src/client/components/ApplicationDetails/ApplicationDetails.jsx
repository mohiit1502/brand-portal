import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import Http from "../../utility/Http";
import "./ApplicationDetails.component.scss";


const ApplicationDetails = props => {
  const {user, handler, org, brand} = props;
  const leftTitle = "Company Information";
  const rightTitle = "Brand Details";
  const attachmentsHeader = "Attachements";
  const useStateResponse = useState(false);
  const [error, setError] = useStateResponse;
    
  useEffect(() => {
    let companyDetails;
    // if(user && user.organization) {
    if(true) {
          // Http.get(`/api/org/applicationDetails/${user.organization.id}`)
      Http.get(`/api/org/applicationDetails/747a6785-46f4-4d2f-8665-23e44cc427c8`)
      .then(res => {
        console.log(res.body);
        companyDetails = res.body;
        companyDetails.org = companyDetails.company || {};
        companyDetails.org.businessRegistrationDocNames = companyDetails.businessRegistrationDocNames;
        companyDetails.brand.additionalDocName = companyDetails.additionalDocName;
        handler(companyDetails);
      })
      .catch(e => {
        console.log(e);
        setError(true);
      })
    } 
  }, []);

  return (
    <div className="c-ApplicationDetails row mx-2 mt-4">
      {!error && org ? <><div className="col mx-5 brand-registration-title">
        <h5 className=" font-weight-bold ">{leftTitle}</h5>
        <div>{org.name}</div>
        <div>{org.address}</div>
        <div>{org.city}, {org.state}</div>
        <div>{org.zip}, {org.countryCode}</div>
        <div className="row mt-3 pl-3 brand-registration-subtitle font-weight-bold font-size-14">
          {attachmentsHeader}
        </div>
      </div> 
      <div className="col mx-2 brand-registration-title">
        <h5 className=" font-weight-bold ">{rightTitle}</h5>
        <div>{brand.trademarkNumber}</div> 
        <div>{brand.name}</div>
        <div>Registration document is on the</div>
        <div>attachment, please review</div>
        <div className="row mt-3 pl-3 brand-registration-subtitle font-weight-bold font-size-14">
          {attachmentsHeader}
        </div>
      </div> </> : <p>Unable to retrieve application details. Please <a href="/">refresh.</a></p>
      } 
    </div>
  );
};

ApplicationDetails.propTypes = {

};

export default ApplicationDetails;
