import React from "react";
import { connect } from "react-redux";
import "../../../styles/custom-components/stepper/stepper.scss";
import PropTypes from "prop-types";

class Stepper extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="row stepper-row align-items-center">
        <div className="col text-center stepper-col">
          {
            this.props.steps && this.props.steps.map((step, i) => {
              return (
                <div className="step-box" key={step.order}>
                  <div className="step-title">Step {step.order}: {step.name}</div>
                  <div className={`stepper-circle ${step.complete ? step.active ? "bg-primary" : "bg-complete" : "bg-stepper-gray"}`} />
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

Stepper.propTypes = {
  steps: PropTypes.array
};

export default connect()(Stepper);
