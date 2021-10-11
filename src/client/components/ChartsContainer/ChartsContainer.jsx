/* eslint-disable filenames/match-regex, no-unused-expressions */
import React, {memo, useEffect, useState} from "react";
import PropTypes from "prop-types";
import {GroupedBarChart, StackedBarChart, FilterController} from "../index";
import "./ChartsContainer.component.scss";
import {dispatchFilter} from "../../actions/dashboard/dashboard-actions";

const ChartTypes = {
  GroupedBarChart,
  StackedBarChart
};

const ChartsContainer = props => {
  const {
    API,
    currentFilters,
    data,
    DATAKEY,
    fetchComplete,
    ID,
    SUBTYPE,
    widgetCommon: { widgetClasses: commonWidgetClasses = ""},
    widget: {DETAILS: {chart = {}, legend = {}, header = {}, filters = []}},
    widgetStackItem: {
      header: {
        layoutClasses: headerLayoutClasses = ""
      },
      body: {
        layoutClasses: bodyLayoutClasses = "",
        legend: legendStyles
      }
    }
  } = props;

  const [loader, setLoader] = useState(false);
  const [dataLocal, setDataLocal] = useState([]);
  const updateChartMeta = {API, dataLocal, DATAKEY, setLoader, setDataLocal};
  const D3Chart = ChartTypes[SUBTYPE];
  useEffect(() => {
    setDataLocal(data);
    setLoader(!fetchComplete);
    return () => {
      dispatchFilter(currentFilters[ID] = "");
    };
  }, [data, fetchComplete]);

  const keys = legend.legendItems && legend.legendItems.map(legendItem => legendItem.name);
  const colors = {};
  legend.legendItems && legend.legendItems.forEach(legendItem => {colors[legendItem.name] = legendItem.color;});

  const Legend = () => (
    <div className={`c-ChartsContainer__content__footer pb-4 line-height-reset`}>
      <ul className={legendStyles.ulClasses}>
        {legend && legend.legendItems.map((legendItem, key) =>
          (<li key={key} id={legendItem.name} className={legendStyles.liClasses}>
            <span className={legendStyles.indicatorClasses} style={{background: legendItem.color}} />
            {legendItem.label}
          </li>)
        )}
      </ul>
    </div>);

  return (
    <div className={`c-ChartsContainer c-Widget__content${commonWidgetClasses ? ` ${  commonWidgetClasses}` : ""}${loader ? " loader" : ""}`}>
      <h5 className={headerLayoutClasses}>{header ? header.title : ""}</h5>
      <div className={bodyLayoutClasses}>
        <FilterController filters={filters} widgetId={ID} updateChartMeta={updateChartMeta} currentFilters={currentFilters}/>
        {SUBTYPE && !loader && <D3Chart classes="c-ChartsContainer__content__body" chart={chart} data={dataLocal} keys={keys} colors={colors}
          currentFilter={currentFilters} containerId={ID} sortingArray={["Counterfeit", "Trademark", "Copyright", "Patent"]}/>}
        {/*{SUBTYPE && <D3Chart classes="c-ChartsContainer__content__body" chart={chart} data={window[SUBTYPE]} keys={keys} colors={colors} />}*/}
        {legend.legendItems && <Legend />}
      </div>
    </div>
  );
};

ChartsContainer.propTypes = {
  API: PropTypes.string,
  currentFilters: PropTypes.object,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  DATAKEY: PropTypes.string,
  fetchComplete: PropTypes.bool,
  ID: PropTypes.string,
  SUBTYPE: PropTypes.string,
  userProfile: PropTypes.object,
  widget: PropTypes.object,
  widgetCommon: PropTypes.object,
  widgetStackItem: PropTypes.object

};

export default memo(ChartsContainer);
