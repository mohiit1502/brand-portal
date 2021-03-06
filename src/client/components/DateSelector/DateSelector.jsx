/* eslint-disable filenames/match-regex, react/jsx-handler-names, no-invalid-this, max-statements */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import moment from "moment";
import { TOGGLE_ACTIONS, toggleModal } from "../../actions/modal-actions";
import { dispatchCustomDate, dispatchFilter } from "../../actions/dashboard/dashboard-actions";
import {DatePickerWrapper} from "../index";
import Helper from "../../utility/helper";

import "react-dates/lib/css/_datepicker.css";
import "./DateSelector.component.scss";

const propTypes = {
  currentFilters: PropTypes.object,
  dispatchCustomDate: PropTypes.func,
  dispatchFilter: PropTypes.func,
  initialDate: PropTypes.object,
  meta: PropTypes.object,
  updateChart: PropTypes.func,
  toggleModal: PropTypes.func,
  modal: PropTypes.object
};

class DateSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: props.initialDate,
      endDate: "",
      endValueDate: "",
      startDate: "",
      startValueDate: ""
    };
    this.getStats = this.getStats.bind(this);
    this.getStatsFromServer = this.getStatsFromServer.bind(this);
  }


  componentDidMount() {
    const self = this;
    self.getStatsFromServer();
  }

  getStatsFromServer() {
    const state = { ...this.state };
    this.setState(state);
  }

  getStats(e) {
    e.preventDefault();
    const currentFilters = this.props.currentFilters;
    const updateChartMeta = {...this.props.meta.updateChartMeta};
    const widgetId = this.props.meta.widgetId;
    const startValueDate = moment(this.state.startDate).format("YYYY-MM-DD");
    const endValueDate = moment(this.state.endDate).add(1, "d").format("YYYY-MM-DD");
    const ldf = moment.localeData().longDateFormat("LL");
    const startDateView = moment.utc(this.state.startDate, [ldf]).format("MMM DD, YYYY");
    const endDateView = moment(this.state.endDate, [ldf]).format("MMM DD, YYYY");

    const dateConcatenatedToView = `${startDateView  } to ${  endDateView}`;
    const dateConcatenatedToSubmit = `${startValueDate  }-to-${  endValueDate}`;
    this.props.dispatchCustomDate({[widgetId]: dateConcatenatedToView});
    let currentWidgetFilters = currentFilters[widgetId];
    if (!currentWidgetFilters) {
      currentWidgetFilters = {};
      currentFilters[widgetId] = currentWidgetFilters;
    }
    currentWidgetFilters.value = dateConcatenatedToSubmit;
    currentWidgetFilters.viewValue = dateConcatenatedToView;
    currentWidgetFilters.dateRange = "customDate";
    currentWidgetFilters.orgId = currentFilters.orgId;
    currentWidgetFilters.emailId = currentFilters.emailId;
    currentWidgetFilters.role = currentFilters.role;
    this.props.dispatchFilter(currentFilters);
    Helper.updateChart(currentWidgetFilters, {...updateChartMeta, filters: updateChartMeta.filters});
    this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
    this.getStatsFromServer();
  }

  resetTemplateStatus = () => {
    this.setState({
      startDate: "",
      endDate: ""
    });
    this.props.toggleModal(TOGGLE_ACTIONS.HIDE);
  }

  render() {
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
            <div className="modal-body text-center p-4">
              <DatePickerWrapper id="start_date" date={this.state.startDate} endDate={this.state.endDate} label="Select Start Date" focusedLabel="Start Date" setDate={date => this.setState({startDate: date})}/>
              <DatePickerWrapper id="end_date" date={this.state.endDate} startDate={this.state.startDate} label="Select End Date" focusedLabel="End Date" setDate={date => this.setState({endDate: date})} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-sm cancel-btn text-primary font-weight-bold" data-dismiss="modal" onClick={this.resetTemplateStatus}>Cancel</button>
              <button type="button" className="btn btn-sm btn-primary submit-btn px-3 ml-3 font-size-15 font-weight-bold" onClick={this.getStats} disabled={!(this.state.startDate && this.state.endDate)}>Apply</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DateSelector.propTypes = propTypes;

const mapDispatchToProps = {
  dispatchCustomDate,
  dispatchFilter,
  toggleModal
};

const mapStateToProps = state => {
  return {
    currentFilters: state.dashboard.filter,
    modal: state.modal
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DateSelector);
