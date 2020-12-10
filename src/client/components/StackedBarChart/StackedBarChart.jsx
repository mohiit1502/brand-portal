import React, {memo, useEffect, useRef} from "react";
import { renderToString } from 'react-dom/server'
import PropTypes from "prop-types";
import {
  select,
  scaleBand,
  axisBottom,
  stack,
  max,
  scaleLinear,
  axisLeft,
  stackOrderAscending
} from "d3";
import d3Tip from "d3-tip"
import useResizeObserver from "./../../hooks/useResizeObserver";
import "./StackedBarChart.component.scss";
import Helper from "../../utility/helper";
import Tooltip from "../custom-components/tooltip/tooltip";
import TopBrandsTooltip from "../custom-components/tooltip/templates/top-brand-tooltip";
import TopReporterTooltip from "../custom-components/tooltip/templates/top-reporters";


const StackedBarChart = props => {
  const {chart, classes, data, keys, colors, currentFilter,subType} = props;
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    const svg = select(svgRef.current);
    let {width, height} = dimensions || wrapperRef.current.getBoundingClientRect();
    const margin = {top: 0, right: 10, bottom: 20, left: 40};
    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    const tooltip = d3Tip().attr('class','d3-tip')
      .offset([-10, 0])
      .style("filter","opacity(0.95)")
      .style("position", "absolute")
      .style("background", "#485465")
      .style("color","white")
      .style("font-size","11")
      .style("padding", "5 15px")
      .style("border", "1px #333 solid")
      .style("border-radius", "5px")
      .html(function (event,d) {
        let Template = (props.chart.layerKey === "brandName") ? TopBrandsTooltip : TopReporterTooltip;
        return renderToString(<Tooltip data={{d,colors,currentFilter}} template={Template} />);
      });

    const stackGenerator = stack()
      .keys(keys)
      .order(stackOrderAscending);
    const layers = stackGenerator(data);
    const extent = [0, max(layers, layer => max(layer, sequence => sequence[1]))];

    const y = scaleBand()
      .domain(data.map(d => chart.layerKey.includes(",") ? chart.layerKey.split(",").reduce((a, b) => d[a] + " " + d[b]) : d[chart.layerKey]))
      .rangeRound([height, 0])
      .padding(0.25);

    const x = scaleLinear()
      .domain(extent)
      .range([0, width - margin.left - margin.right]);

    svg.call(tooltip)

    const sbChart = svg
      .selectAll(".layer")
      .data(layers)
      .join("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("class", "layer")
      .attr("fill", layer => colors[layer.key])
      .selectAll("rect")
      .data(layer => layer)
      .join("rect")
      .attr("y", d => y(chart.layerKey.includes(",") ? chart.layerKey.split(",").reduce((a, b) => d.data[a] + " " + d.data[b]) : d.data[chart.layerKey]))
      .attr("x", 0)
      .attr("width", 0)
      .attr("height", y.bandwidth())
      .on("mouseover", function(event, d) {
        select(this).style("opacity",0.5);
        tooltip.show(event, d, this)
      })
      .on("mouseout", function() {
        select(this).style("opacity",1);
        tooltip.hide(this)
      });

    sbChart.transition()
      .attr("width", d => x(d[1]) - x(d[0]))
      .attr("x", d => x(d[0]))

    const xAxis = axisBottom(x);
    svg
      .select(".x-axis")
      .attr("transform", `translate(${margin.left}, ${height + margin.top})`)
      .call(xAxis);

    const yAxis = axisLeft(y);
    svg.select(".y-axis")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(yAxis)
      .selectAll(".tick text")
      .call(Helper.wrap, margin.left);
  }, [colors, data, dimensions, keys]);

  return (
    <div className={`c-StackedBarChart${classes ? " " + classes : ""}`} ref={wrapperRef}>
      <svg ref={svgRef} style={{width: "100%", height: "100%"}}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
};

StackedBarChart.propTypes = {
  chart: PropTypes.object,
  classes: PropTypes.string,
  colors: PropTypes.object,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  keys: PropTypes.array
};

export default memo(StackedBarChart);
