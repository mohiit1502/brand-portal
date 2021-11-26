import React from "react";
import ApplicationDetails from "../../../components/ApplicationDetails";



class ApplicationReview extends React.Component{

    constructor(props){
        super(props);
        console.log(props);
        this.title = "Review Information";
        this.subtitle = "Please ensure the information below is accurate.";
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
                <ApplicationDetails {...this.props}/>
                <div className="c-ButtonsPanel form-row py-4 mt-5">
                    <div className="col company-onboarding-button-panel text-right">
                        <button type="button" className="btn btn-sm cancel-btn text-primary">Back</button>
                        <button type="submit" className="btn btn-sm btn-primary submit-btn px-4 ml-3">Confirm and submit</button>
                    </div>
                </div>
                
              </div>
          );

    }

}

export default ApplicationReview;
