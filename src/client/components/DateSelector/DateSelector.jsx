import React from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

class DateSelector extends React.Component {
  constructor() {
    super();
    this.state = {
      //startDate: Date.now(),
      //endDate: Date.now()
      //startDate: moment().add(-7, 'days'),
      //endDate: moment()
      startDate: '',
      endDate: ''
    }
    this.handleStartDateChanged = this.handleStartDateChanged.bind(this);
    this.handleEndDateChanged = this.handleEndDateChanged.bind(this);
    this.getStats = this.getStats.bind(this);
    this.getStatsFromServer = this.getStatsFromServer.bind(this);
  }

  componentDidMount() {
    const self = this;
    self.getStatsFromServer();
  }

  getStatsFromServer() {
    console.log("This is get stats")

    const startDate = this.state.startDate;
    const endDate = this.state.endDate;
    console.log("Get Stats for dates" + startDate + " and " + endDate);

  }

  getStats(e) {
    e.preventDefault();
    this.getStatsFromServer();
  }

  handleStartDateChanged(date) {
    let startDate = date;
    let endDate = this.state.endDate;
    if (startDate >= endDate) {
      console.log('startDate more than end date');
      endDate = moment(date).add(1, 'days');
    }
    this.setState({
      startDate: startDate,
      endDate: endDate
    });
  }
  handleEndDateChanged(date) {
    let startDate = this.state.startDate;
    let endDate = date;
    if (startDate >= endDate) {
      console.log('startDate more than end date');
      startDate = moment(date).add(-1, 'days');
    }
    this.setState({
      startDate: startDate,
      endDate: endDate
    });
  }

  render() {


    const statsTableStyle =
    {
      "margin": "10px"
    }

    const numberColStyle =
    {
      "padding-left": "10px"
    }

    const resetTemplateStatus = () => {

    }

    const handleSubmit = () => {

    }

    return (
      <div className="c-DateSelector modal fade show" id="singletonModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header align-items-center">
              Custom Date Range
              <button type="button" className="close text-white" aria-label="Close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body text-center p-5">
              <div className="row  mt-4">
                <div className="col">
                  {/* <span>Start Date:</span> */}

                  <DatePicker
                    placeholderText="Select Start Date"
                    selected={this.state.startDate}
                    onChange={this.handleStartDateChanged}
                  />
                </div>
                <div className="col">
                  <DatePicker
                    placeholderText="Select End Date"
                    selected={this.state.endDate}
                    onChange={this.handleEndDateChanged}
                  />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" className="btn btn-sm cancel-btn text-primary" data-dismiss="modal" onClick={this.resetTemplateStatus}>Cancel</button>
              <button type="button" className="btn btn-sm btn-primary submit-btn px-3 ml-3" onClick={(e) => { this.getStats(e) }}>Apply</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DateSelector.propTypes = {

};

export default DateSelector;
