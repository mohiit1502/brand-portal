import React from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import EventIcon from "@material-ui/icons/Event";
import { dispatchDiscardChanges, TOGGLE_ACTIONS, toggleModal } from "../../actions/modal-actions"
import { connect } from "react-redux";
import { dispatchFilter } from "../../actions/dashboard/dashboard-actions";
import ReactDOM from "react-dom";
import "./DateSelector.component.scss";

class DateSelector_bkup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: '',
      endDate: '',
      startValueDate: '',
      endValueDate: '',
      flag1: false,
      flag2: false
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
    console.log("getStatsFromServer start")

    const startValueDate = moment(this.state.startDate).format('DD-MM-YYYY');
    const endValueDate = moment(this.state.endDate).format('DD-MM-YYYY');

    console.log("startValueDate:" + startValueDate+"endValueDate:" + endValueDate);

    const state = { ...this.state };
    state.startValueDate = startValueDate;
    state.endValueDate = endValueDate;
    this.setState(state);

    //get orgId - If we want to call Chart from this Component
    const orgId = `${this.props.modal.orgId}`;
    console.log("orgId" + orgId);

    if (this.state.flag2 == true && this.state.flag1 == true) {
      this.state.flag2 = false;
      this.state.flag1 = false;

      //If we want to call Chart from this Component
      /*var currentWidgetFilters = {};
      currentWidgetFilters['startDate'] = startValueDate;
      currentWidgetFilters['endDate'] = endValueDate;
      currentWidgetFilters['orgId'] = orgId;
      this.UpdateCharfnc(currentWidgetFilters);*/
      this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
    }


  }


  UpdateCharfnc = (new Function(`return ${this.props.modal.clickMe}`)());

  getStats(e) {
    e.preventDefault();
    this.getStatsFromServer();
  }

  handleStartDateChanged(date) {
    console.log("handleStartDateChanged");
    let startDate = date;
    let endDate = this.state.endDate;

    if (startDate >= endDate && endDate != '' && endDate != null) {
      console.log('startDate more than end date');
      endDate = moment(date).add(1, 'days').toDate();
    }
    this.setState({
      startDate: startDate,
      endDate: endDate,
      flag1: true
    });
  }
  handleEndDateChanged(date) {
    console.log("handleEndDateChanged");
    let startDate = this.state.startDate;
    let endDate = date;

    if (startDate >= endDate && startDate != '' && startDate != null) {
      startDate = moment(date).add(-1, 'days').toDate();
    }
    this.setState({
      startDate: startDate,
      endDate: endDate,
      flag2: true
    });
  }


  resetTemplateStatus = () => {
    console.log("resetTemplateStatus");
    this.setState({
      startDate: '',
      endDate: ''
    });
    this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
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


    return (
      <div className="c-DateSelector modal fade show" id="singletonModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header align-items-center">
              Custom Date Range
              <button type="button" className="close text-white" aria-label="Close" onClick={this.resetTemplateStatus}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body text-center p-5">
              <div className="row  mt-4">
                <div className="col">
                  <label>
                    <DatePicker
                      className="customDatePickerWidth"
                      //customInput={<Input icon="calendar" iconPosition="right" />}
                      placeholderText="Select Start Date"
                      dateFormat='d MMMM yyyy'
                      selected={this.state.startDate}
                      onChange={this.handleStartDateChanged}
                    />
                    <EventIcon />
                  </label>
                </div>
              </div>
              <div className="row  mt-4">
                <div className="col">
                  <label>
                    <DatePicker
                      className="customDatePickerWidth"
                      placeholderText="Select End Date"
                      dateFormat='d MMMM yyyy'
                      selected={this.state.endDate}
                      onChange={this.handleEndDateChanged}
                    />
                    <EventIcon />
                  </label>
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



DateSelector_bkup.propTypes = {
  dispatchFilter: PropTypes.func,
  updateChart: PropTypes.func,
  toggleModal: PropTypes.func,
  modal: PropTypes.object,
};

const mapDispatchToProps = {
  dispatchFilter,
  toggleModal
};


const mapStateToProps = state => {
  return state;
};


export default connect(mapStateToProps, mapDispatchToProps)(DateSelector_bkup);


