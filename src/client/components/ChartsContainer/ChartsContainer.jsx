import React, {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import {GroupedBarChart, StackedBarChart, FilterController} from "../index";
import "./ChartsContainer.component.scss";
import Http from "../../utility/Http";

const ChartTypes = {
  GroupedBarChart: GroupedBarChart,
  StackedBarChart: StackedBarChart
}

const ChartsContainer = props => {
  const {
    API,
    data,
    DATAKEY,
    ID,
    SUBTYPE,
    userProfile,
    widgetActionDispatcher,
    widgetCommon: { widgetClasses: commonWidgetClasses = ""},
    widget: {DETAILS: {chart = {}, legend = {}, header = {}, filters = [], widgetClasses = ""}},
    widgetStackItem: {
      contentClasses,
      header: {
        layoutClasses: headerLayoutClasses = "",
      },
      body: {
        layoutClasses: bodyLayoutClasses = "",
        legend: legendStyles
      },
    }
  } = props;
  // const chartWrapper = useRef(null);
  const [loader, setLoader] = useState(false);
  const [dataLocal, setDataLocal] = useState([]);
  const D3Chart = ChartTypes[SUBTYPE];
  useEffect(() => setDataLocal(data),[data]);
  // window["StackedBarChart"] = [
  //   {
  //     brandName: "Nike",
  //     abc: 5,
  //     Trademark: 10,
  //     Counterfeit: 3,
  //     Copyright: 3,
  //     Patent: 16
  //   },
  //   {
  //     brandName: "H&M",
  //     abc: 5,
  //     Trademark: 4,
  //     Counterfeit: 2,
  //     Copyright: 1,
  //     Patent: 7
  //   },
  //   {
  //     brandName: "Levis",
  //     abc: 5,
  //     Trademark: 21,
  //     Counterfeit: 6,
  //     Copyright: 12,
  //     Patent: 39
  //   },
  //   {
  //     brandName: "Metro",
  //     abc: 5,
  //     Trademark: 6,
  //     Counterfeit: 1,
  //     Copyright: 1,
  //     Patent: 8
  //   },
  //   {
  //     brandName: "Woodland",
  //     abc: 5,
  //     Trademark: 17,
  //     Counterfeit: 9,
  //     Copyright: 6,
  //     Patent: 32
  //   },
  //   {
  //     brandName: "Kajaria",
  //     abc: 5,
  //     Trademark: 3,
  //     Counterfeit: 0,
  //     Copyright: 2,
  //     Patent: 5
  //   },
  //   {
  //     brandName: "Louis Philippe1",
  //     abc: 5,
  //     Trademark: 3,
  //     Counterfeit: 1,
  //     Copyright: 2,
  //     Patent: 5
  //   },{
  //     brandName: "Louis Philippe2",
  //     abc: 5,
  //     Trademark: 3,
  //     Counterfeit: 1,
  //     Copyright: 2,
  //     Patent: 5
  //   },{
  //     brandName: "Louis Philippe3",
  //     abc: 5,
  //     Trademark: 3,
  //     Counterfeit: 1,
  //     Copyright: 2,
  //     Patent: 5
  //   },
  // ]
  //
  // window["GroupedBarChart"] = [
  //   {
  //     "claimType": "Patent",
  //     "claimsCount": 1,
  //     "itemsCount": 1
  //   },
  //   {
  //     "claimType": "Trademark",
  //     "claimsCount": 26,
  //     "itemsCount": 2
  //   },
  //   {
  //     "claimType": "Copyright",
  //     "claimsCount": 1,
  //     "itemsCount": 1
  //   },
  //   {
  //     "claimType": "Counterfeit",
  //     "claimsCount": 13,
  //     "itemsCount": 1
  //   }
  // ]

  const keys = legend.legendItems && legend.legendItems.map(legendItem => legendItem.name);
  const colors = {}
  legend.legendItems && legend.legendItems.forEach(legendItem => colors[legendItem.name] = legendItem.color);

  const updateChart = (filterData) => {
    let interpolatedApi = API;
    setLoader(true);
    try {
      filterData && Object.keys(filterData).forEach(filter => {
        const filterMeta = filters.find(filterItem => filterItem.name === filter);
        const filterValue = filterMeta && filterMeta.backendMapper ? filterMeta.backendMapper[filterData[filter]] : filterData[filter];
        interpolatedApi = interpolatedApi.replace(`__${filter}__`, filterValue)
      })
      Http.get(interpolatedApi)
        .then(response => {
          setDataLocal(response.body.data && response.body.data[DATAKEY] ? response.body.data[DATAKEY] : dataLocal);
          setLoader(false);
        })
        .catch(err => {
          console.log(err)
          setLoader(false);
        });
    } catch (e) {
      setLoader(false)
    }
  }

  const Legend = () => (
    <div className={`c-ChartsContainer__content__footer pb-4 line-height-reset`}>
      <ul className={legendStyles.ulClasses}>
        {legend && legend.legendItems.map((legendItem, key) =>
          <li key={key} id={legendItem.name} className={legendStyles.liClasses}>
            <span className={legendStyles.indicatorClasses} style={{background: legendItem.color}} />
            {legendItem.name}
          </li>
        )}
      </ul>
    </div>);

  return (
    <div className={`c-ChartsContainer c-Widget__content${commonWidgetClasses ? " " + commonWidgetClasses : ""}${loader ? " loader" : ""}`}>
      <h5 className={headerLayoutClasses}>{header ? header.title : ""}</h5>
      <div className={bodyLayoutClasses}>
        <FilterController filters={filters} widgetId={ID} updateChart={updateChart}/>
        {SUBTYPE && <D3Chart classes="c-ChartsContainer__content__body" chart={chart} data={dataLocal} keys={keys} colors={colors} />}
        {/*{SUBTYPE && <D3Chart classes="c-ChartsContainer__content__body" chart={chart} data={window[SUBTYPE]} keys={keys} colors={colors} />}*/}
        {legend.legendItems && <Legend />}
      </div>
    </div>
  );
};

ChartsContainer.propTypes = {
  API: PropTypes.string,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  DATAKEY: PropTypes.string,
  ID: PropTypes.string,
  SUBTYPE: PropTypes.string,
  userProfile: PropTypes.object
};

export default ChartsContainer;
