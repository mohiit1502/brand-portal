import React,{useState} from "react";
import { connect } from "react-redux";
import '../../../styles/custom-components/tooltip/tooltip.scss';
import PropTypes from "prop-types";
import ReactDOMServer from "react-dom/server";

// const TooltipContainer = function({data, Template}){
//   return <Template data={data} />
// }

const Tooltip = function (props){

  const Template = props.template

  const [dateFilterMap,setDateFilterMap] = useState({
    alltime:"All Time",
    yesterday:"Yesterday",
    lastweek:"Last Week",
    weektodate:"Week To Date",
    monthtodate:"Month To Date",
    lastmonth:"Last Month",
    quartertodate:"Quarter To Date",
    lastquarter:"Last Quarter",
    yeartodate:"Year To Date",
    lastyear:"Last Year",
    customDate: {
      toDate:'',
      fromDate:''
    }
  })

  return (

    <div className={`tooltip-container m-2 mr-4`}>
      <Template data={props.data} dateFilterMap={dateFilterMap}/>
    </div>
  );
}
//
Tooltip.propTypes = {
  template: PropTypes.func
};

export default Tooltip;
