import React from 'react';
import PropTypes from "prop-types";
import '../../../../styles/custom-components/tooltip/tooltip.scss'

const ReportedClaimsTooltip = function (props){
  const {d,colors,currentFilter}= props.data
  const dateFilterMap = props.dateFilterMap

  const getTable = function(){
      return (
        <table className={`tooltip-table`}>
          <tr>
            <td className = {`tooltip-col1`} style={{}}><span className="rounded" style={{background: colors.Claims}} />Claims:</td>
            <td className = {`tooltip-col2`} style={{textAlign: "right"}}>{d.claimsCount}</td>
          </tr>
          <tr>
            <td className = {`tooltip-col1`} style={{textAlign: "left"}}><span className="rounded" style={{background: colors.Items}} />Items:</td>
            <td className = {`tooltip-col2`} style={{textAlign: "right"}}>{d.itemsCount}</td>
          </tr>
        </table>
      )
  }
  let tooltipDescriptor = "";
  if((currentFilter["widget-claims-by-type"] === undefined) || (currentFilter["widget-claims-by-type"].dateRange === undefined)){
    tooltipDescriptor = "All Time";
  } else if (currentFilter["widget-claims-by-type"].dateRange && currentFilter["widget-claims-by-type"].dateRange === "customDate") {
    tooltipDescriptor = currentFilter["widget-claims-by-type"].viewValue;
  } else {
    tooltipDescriptor = dateFilterMap[currentFilter["widget-claims-by-type"].dateRange]
  }

  return (
    <div className={`tooltip-reported-claims`}>
      <div className={`tooltip-header m-0 p-0`}>{d.claimType} Claims<br/><span className={`tooltip-descriptor`}>({tooltipDescriptor})</span></div>
      <div className={`mt-2 tooltip-data`}>{getTable()}</div>
    </div>
  );
}

export default ReportedClaimsTooltip;
