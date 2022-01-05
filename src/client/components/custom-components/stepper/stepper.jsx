import React from "react";
import { connect } from "react-redux";
import "../../../styles/custom-components/stepper/stepper.scss";
import PropTypes from "prop-types";

class Stepper extends React.Component {

  constructor(props) {
    super(props);
  }

  /* eslint-disable no-nested-ternary */
  render() {
    return (
      <div className="row stepper-row align-items-center">
        <div className="col text-center stepper-col">
          {
            this.props.steps && this.props.steps.map((step, i) => {
              return (
                <div className="step-box" key={step.order}>
                  <div className="step-title">{step.name}</div>
                  <div className={`stepper-circle ${step.complete ? `bg-complete${step.active ? " step-active" : ""}` : "bg-stepper-gray"}`} />
                  {
                    i > 0 && <div className={`connect-bar${step.complete ? " bg-complete" : " bg-stepper-gray"}`} />
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

const mapStateToProps = state => {
  return {
    steps: state && state.company && state.company.steps
  }
}

export default connect(mapStateToProps)(Stepper);
