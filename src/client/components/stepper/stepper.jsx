import React from "react";
import { connect } from "react-redux";
import "../../styles/stepper/stepper.scss";

class Stepper extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      steps: [
        {
          order: 1,
          name: "Company Profile",
          complete: true
        },
        {
          order: 2,
          name: "Brand Details",
          complete: true
        }
      ]
    };
  }

  render() {
    return (
      <div className="row stepper-row align-items-center">
        <div className="col text-center stepper-col">
          {
            this.state.steps.map((step, i) => {
              return (
                <div className="step-box" key={step.order}>
                  <div className="step-title">Step {step.order}: {step.name}</div>
                  <div className={`stepper-circle ${step.complete ? "bg-primary" : "bg-stepper-gray"}`} />
                  {
                    i > 0 && <div className={`connect-bar ${step.complete ? "bg-primary" : "bg-stepper-gray"}`} />
                  }
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

export  default  connect()(Stepper);
