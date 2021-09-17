import React from "react";
import PropTypes from "prop-types";
import "../../../../styles/custom-components/tooltip/tooltip.scss";

const TopBrandsTooltip = function(props) {
  const {d, colors, currentFilter} = props.data;

  const dateFilterMap = {
    alltime: "All Time",
    last30days: "Last 30 Days",
    last7days: "Last 7 days",
    last60days: "Last 60 Days",
    last90days: "Last 90 Days"
  };

 const mapUtil = {
    trademark: "Trademark",
    copyright: "Copyright",
    patent: "Patent",
    counterfeit: "Counterfeit"
  };
  const getTable = function() {
    if ((currentFilter["widget-claims-by-brand"] === undefined) || (currentFilter["widget-claims-by-brand"].claimType === undefined) || currentFilter["widget-claims-by-brand"].claimType === "all") {
      return (
        <table className={`tooltip-table`}>
          {
            Object.keys(colors).map(key => {
              return key !== "brandName" && key !== "totalClaim" ?
                <tr>
                  <td className = {`tooltip-col1`}><span className="rounded" style={{background: colors[key]}} />{key}</td>
                  <td className = {`tooltip-col2`}>{d.data[key]}</td>
                </tr> : null;
            })
          }
        </table>
      );
    } else {
      const key = mapUtil[currentFilter["widget-claims-by-brand"].claimType];
      return (
        <table>
          <tr>
            <td className = {`tooltip-col1`}><span className="rounded" style={{background: colors[key]}} />{key}</td>
            <td className = {`tooltip-col2`}>{d.data[key]}</td>
          </tr>
        </table>
      );
    }
  };
  let tooltipDescriptor = "";
  if ((currentFilter["widget-claims-by-brand"] === undefined) || (currentFilter["widget-claims-by-brand"].dateRange === undefined)) {
    tooltipDescriptor = "All Time";
  } else if (currentFilter["widget-claims-by-brand"].dateRange && currentFilter["widget-claims-by-brand"].dateRange === "customDate") {
    tooltipDescriptor = currentFilter["widget-claims-by-brand"].viewValue;
  } else {
    tooltipDescriptor = dateFilterMap[currentFilter["widget-claims-by-brand"].dateRange];
  }
  return (
    <div className={`tooltip-container m-2 mr-4`}>
      <div className={`tooltip-reported-claims`}>
        <div className={`tooltip-header m-0 p-0`}>{d.data.brandName}<br/><span className={`tooltip-descriptor`}>({tooltipDescriptor})</span></div>
        <div className={`mt-2 tooltip-data`}>{getTable()}</div>
      </div>
    </div>
  );

};

TopBrandsTooltip.propTypes = {
  data: PropTypes.object
};

export default TopBrandsTooltip;
