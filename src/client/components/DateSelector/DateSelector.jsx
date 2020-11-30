import React from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
// import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

class DateSelector extends React.Component {
  constructor () {
    super();
    this.state = {
      startDate: Date.now(),
      endDate: Date.now()
      //  startDate: moment().add(-7, 'days'),
      //   endDate: moment()
    }
    this.handleStartDateChanged = this.handleStartDateChanged.bind(this);
    this.handleEndDateChanged = this.handleEndDateChanged.bind(this);
    this.getStats = this.getStats.bind(this);
    this.getStatsFromServer = this.getStatsFromServer.bind(this);
  }

  componentDidMount(){
    const self = this;
    self.getStatsFromServer();
  }

  getStatsFromServer()
  {
    console.log("This is get stats")

    const startDate = this.state.startDate;
    const endDate = this.state.endDate;
    console.log("Get Stats for dates" + startDate + " and " + endDate );

  }

  getStats(e){
    e.preventDefault();
    this.getStatsFromServer();
  }

  handleStartDateChanged(date) {
    let startDate = date;
    let endDate = this.state.endDate;
    if (startDate >= endDate)
    {
      console.log ('startDate more than end date');
      //  endDate = moment(date).add(1, 'days');
    }
    this.setState({
      startDate: startDate,
      endDate: endDate
    });
  }
  handleEndDateChanged(date) {
    let startDate = this.state.startDate;
    let endDate = date;
    if (startDate >= endDate)
    {
      console.log ('startDate more than end date');
      // startDate = moment(date).add(-1, 'days');
    }
    this.setState({
      startDate: startDate,
      endDate: endDate
    });
  }

  render () {


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
              <button type="button" className="close text-white" aria-label="Close" onClick={resetTemplateStatus}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body text-center p-5">
              <span>Start Date:</span>
              {/* <span>Start Date:</span> */}
              <span>End Date:</span>
              <button style={{"marginLeft": "20px"}} onClick={(e) => {this.getStats(e)}}>Apply</button>
              <form onSubmit={handleSubmit} className="h-100 px-2">
              </form>
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
