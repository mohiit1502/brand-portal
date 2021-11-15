import React from "react";


class ApplicationReview extends React.Component{

    constructor(props){
        super(props);
        console.log(props);
        this.title = "Review Information";
        this.subtitle = "Please ensure the information below is accurate.";
        this.leftTitle = "Company Information";
        this.rightTitle = "Brand Details";
        this.attachmentsHeader = "Attachements";
        this.state = {...props};
    }

    render(){
        return (
            // <div className={`row justify-content-center ${this.state.form.loader && "loader"}`}>
              <div className="col pl-5 pr-0">
                <div className="row mt-4 pl-5 mx-3 brand-registration-title font-weight-bold font-size-28">
                    {this.title}
                </div>
                <div className="row mt-3 pl-5 mx-3 brand-registration-subtitle">
                    {this.subtitle}
                </div>
                {/* eslint-disable react/jsx-handler-names */}
                <div className="row mx-2 mt-4">
                    <div className="col mx-5 brand-registration-title">
                        <h5 className=" font-weight-bold ">{this.leftTitle}</h5>
                        <div>{this.state.org.name}</div>
                        <div>{this.state.org.address}</div>
                        <div>{this.state.org.city}, {this.state.org.state}</div>
                        <div>{this.state.org.zip}, {this.state.org.countryCode}</div>
                        <div className="row mt-3 pl-3 brand-registration-subtitle font-weight-bold font-size-14">
                            {this.attachmentsHeader}
                        </div>
                    </div>
                    <div className="col mx-2 brand-registration-title">
                        <h5 className=" font-weight-bold ">{this.rightTitle}</h5>
                        <div>{this.state.brand.trademarkNumber}</div>
                        <div>{this.state.brand.name}</div>
                        <div>Registration document is on the</div>
                        <div>attachment, please review</div>
                        <div className="row mt-3 pl-3 brand-registration-subtitle font-weight-bold font-size-14">
                            {this.attachmentsHeader}
                        </div>
                    </div>
                </div>
                
                <div className="c-ButtonsPanel form-row py-4 mt-5">
                    <div className="col company-onboarding-button-panel text-right">
                        <button type="button" className="btn btn-sm cancel-btn text-primary">Back</button>
                        <button type="submit" className="btn btn-sm btn-primary submit-btn px-4 ml-3">Confirm and submit</button>
                    </div>
                </div>
                
              </div>
            // </div>
          );

    }

}

export default ApplicationReview;
