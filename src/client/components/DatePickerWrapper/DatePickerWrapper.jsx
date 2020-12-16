import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import "react-dates/initialize";
import {SingleDatePicker} from "react-dates";
import {isInclusivelyAfterDay, isInclusivelyBeforeDay} from "react-dates/esm";
import moment from "moment";
import {SingleDatePickerPhrases} from "react-dates/esm/defaultPhrases";
import {Event} from "./../../images";
import './DatePickerWrapper.component.scss';

const defaultProps = {
  // example props for the demo
  autoFocus: false,
  initialDate: null,

  // input related props
  id: 'date',
  // placeholder: 'Select Date',
  disabled: false,
  required: false,
  screenReaderInputMessage: '',
  showClearDate: false,
  showDefaultInputIcon: false,
  customInputIcon: <p></p>,
  inputIconPosition: "after",
  block: false,
  small: false,
  regular: false,
  verticalSpacing: undefined,
  keepFocusOnInput: false,

  // calendar presentation and interaction related props
  renderMonthText: null,
  orientation: "horizontal",
  anchorDirection: "left",
  horizontalMargin: 0,
  withPortal: false,
  withFullScreenPortal: false,
  initialVisibleMonth: null,
  numberOfMonths: 1,
  keepOpenOnDateSelect: false,
  reopenPickerOnClearDate: false,
  isRTL: false,

  // navigation related props
  navPrev: null,
  navNext: null,
  onPrevMonthClick() {},
  onNextMonthClick() {},
  onClose() {},

  // day presentation and interaction related props
  renderCalendarDay: undefined,
  renderDayContents: null,
  enableOutsideDays: false,
  isDayBlocked: () => false,
  // isOutsideRange: day => !isInclusivelyAfterDay(day, moment()),
  isOutsideRange: day => !isInclusivelyBeforeDay(day, moment()),
  isDayHighlighted: () => {},

  hideKeyboardShortcutsPanel: true,

  // internationalization props
  displayFormat: () => moment.localeData().longDateFormat('LL'),
  monthFormat: 'MMMM YYYY',
  phrases: SingleDatePickerPhrases,
  weekDayFormat: 'ddd'
};

const DatePickerWrapper = props => {
  const {date, setDate} = props;
  const [focused, setFocused] = useState(false);
  const label = focused || date ? props.focusedLabel : props.label;
  let isOutsideRange = props.isOutsideRange;
  if (props.startDate) {
    isOutsideRange = day => !isInclusivelyBeforeDay(day, moment()) || !isInclusivelyAfterDay(day, props.startDate);
  } else if (props.endDate) {
    isOutsideRange = day => !isInclusivelyBeforeDay(day, props.endDate);
  }

  return (
    <div className="c-DatePickerWrapper row mt-12">
      <div className="col">
        <SingleDatePicker
          {...props}
          placeholder=""
          date={date}
          focused={focused}
          isOutsideRange={isOutsideRange}
          onDateChange={(date) => setDate(date)}
          onFocusChange={({focused}) => setFocused(focused)}
        />
        <label className={`custom-input-label custom-input-label-placeholder${focused || date ? " shiftup-custom-input-label" : ""}${!focused && date ? " text-black" : ""}`} htmlFor={props.id}>
          <span className="label-text"> {label} </span>
        </label>
      </div>
    </div>
  );
};

DatePickerWrapper.propTypes = {
  date: PropTypes.object,
  setDate: PropTypes.func
};

DatePickerWrapper.defaultProps = defaultProps;

export default DatePickerWrapper;
