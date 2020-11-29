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

  const [inStartDate, setinStartDate] = useState(new Date());
  const [inEndDate, setinEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  function handleStartDate(date) {
    console.log(date);
    const a = date != null ? moment(date).format("yyyy-MM-DD") : subDays(new Date(), 15);
    setStartDate(a);

}
function handleEndDate(date) {
    console.log(date)
    const a = date != null ? moment(date).format("yyyy-MM-DD") : subDays(new Date(), 0);
    setEndDate(a);
}


  return (
    <div className="c-DateSelector modal fade show" id="singletonModal" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header align-items-center">
            Custom Date Range Trial
            <Form>
                <Form.Group widths='equal'>
                                        <Form.Field>
                                            {/* <label>Start Date</label> */}
                                            <DatePicker
                                                selected={inStartDate}
                                                // onChange={date => setStartDate(date)}
                                                onChange={(date) => { handleStartDate(date); setinStartDate(date) }}
                                                selectsStart
                                                // startDate={startDate}
                                                // endDate={endDate}
                                                dateFormat="yyyy/MM/dd"
                                                fixedHeight
                                                minDate={subDays(new Date(), 15)}
                                                maxDate={subDays(new Date(), 0)}
                                                showDisabledMonthNavigation
                                                // dateFormat="yyyy h:mm aa"
                                                // showTimeInput
                                                isClearable

                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            {/* <label>End Date</label> */}
                                            <DatePicker
                                                selected={inEndDate}
                                                onChange={date => { handleEndDate(date); setinEndDate(date) }}
                                                selectsEnd
                                                // startDate={startDate}
                                                // endDate={endDate}
                                                // minDate={startDate}
                                                dateFormat="yyyy/MM/dd"
                                                fixedHeight
                                                minDate={subDays(new Date(), 15)}
                                                maxDate={subDays(new Date(), 0)}
                                                // showTimeInput
                                                showDisabledMonthNavigation
                                                // disabled
                                                isClearable
                                            />
                                        </Form.Field>
                                    </Form.Group>
              </Form>
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
