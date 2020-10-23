import React, {useRef} from "react";
import PropTypes from "prop-types";
import {GroupedBarChart, StackedBarChart, FilterController} from "../index";
import "./ChartsContainer.component.scss";

const ChartTypes = {
  GroupedBarChart: GroupedBarChart,
  StackedBarChart: StackedBarChart
}

const ChartsContainer = props => {
  const chartWrapper = useRef(null);
  const {data, SUBTYPE} = props;
  const D3Chart = ChartTypes[SUBTYPE];

  const {
    widgetActionDispatcher,
    widgetCommon: {contentLayout: commonContentLayout = "", widgetClasses: commonWidgetClasses = "", footer: commonFooter = {}, header: commonHeader = {},},
    widget: {DETAILS: {legend = {}, header = {}, widgetClasses = ""}},
    widgetStackItem
  } = props;

  const commonWidgetClassesInferred = `${commonWidgetClasses ? ` ${commonWidgetClasses}` : ""}`;
  const widgetClassesInferred = `${widgetClasses ? ` ${widgetClasses}` : ""}`;

  const commonContentLayoutInferred = `${commonContentLayout ? ` ${commonContentLayout}` : ""}`;

  const commonHeaderLayoutInferred = `${commonHeader.contentLayout ? ` ${commonHeader.contentLayout}` : ""}`;
  const headerLayoutInferred = `${header.contentLayout ? ` ${header.contentLayout}` : ""}`;
  const commonHeaderContentClassesInferred = `${commonHeader.contentClasses ? ` ${commonHeader.contentClasses}` : ""}`;
  const headerContentClassesInferred = `${header.contentClasses ? ` ${header.contentClasses}` : ""}`;

  const commonFooterLayoutInferred = `${commonFooter.contentLayout ? ` ${commonFooter.contentLayout}` : ""}`;
  const commonFooterContentClassesInferred = `${commonFooter.contentClasses ? ` ${commonFooter.contentClasses}` : ""}`;

  const Header = () => (
    <div className={`c-Widget__content__header${commonContentLayoutInferred}${commonHeaderLayoutInferred}${headerLayoutInferred}`}>
      <div className={`${commonHeaderContentClassesInferred}${headerContentClassesInferred}`}>
        {header.title}
      </div>
    </div>);

  const Legend = () => (
    <div className={`c-Widget__content__footer${commonFooterLayoutInferred}`}>
      <div className={`${commonFooterContentClassesInferred}`}>
        <ul className={legend.ulClasses}>
          {legend && legend.legendItems.map(legendItem =>
            <li id={legendItem.name} className={legend.liClasses}>
              <span className={legend.indicatorClasses} style={{background: legendItem.color}} />
              {legendItem.name}
            </li>
          )}
        </ul>
      </div>
    </div>);


  return (
    <div className={`c-ChartsContainer c-Widget__content${commonWidgetClassesInferred}${widgetClassesInferred}`} ref={chartWrapper}>
      <Header />
      <FilterController />
      {SUBTYPE && <D3Chart chartWrapper={chartWrapper} data={data} />}
      {legend.legendItems && <Legend />}
    </div>
  );
};

ChartsContainer.propTypes = {
  data: PropTypes.object,
  SUBTYPE: PropTypes.string
};

export default ChartsContainer;
