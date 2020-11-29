import React, { Component,useState } from "react";
import PropTypes from "prop-types";
import "./DateSelector.component.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import subDays from "date-fns/subDays";

const DateSelector = props => {

  const resetTemplateStatus = () => {

  }

  const handleSubmit = () => {

  }

  const Example = () => {
    const [startDate, setStartDate] = useState(new Date());
    return (
      <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
    );
  };


  return (
    <div className="c-DateSelector modal fade show" id="singletonModal" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header align-items-center">
            Custom Date Range Trial
            <DatePicker selected={startdate} onChange={date => setStartDate(date)} />
            <button type="button" className="close text-white" aria-label="Close" onClick={resetTemplateStatus}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body text-left">
            <form onSubmit={handleSubmit} className="h-100 px-2">

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

DateSelector.propTypes = {

};

export default DateSelector;
