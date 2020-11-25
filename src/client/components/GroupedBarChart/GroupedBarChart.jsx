import React, {memo, useEffect, useRef} from "react";
import PropTypes from "prop-types";
import {axisBottom, axisLeft, max, scaleBand, scaleLinear, select, stack, stackOrderAscending} from "d3";
import useResizeObserver from "../../hooks/useResizeObserver";
import "./GroupedBarChart.component.scss";

const GroupedBarChart = props => {
  const {chart, classes, data, keys, colors} = props;
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    const svg = select(svgRef.current);
    const {width, height} = dimensions || wrapperRef.current.getBoundingClientRect();
    const margin = {top: 0, right: 20, bottom: 30, left: 20};
    const barPadding = .2;
    const axisTicks = {qty: 5, outerSize: 0, dateFormat: '%m-%d'};
    const xScale0 = scaleBand().range([margin.left, width - margin.left - margin.right]).padding(barPadding);
    const xScale1 = scaleBand();
    const yScale = scaleLinear().range([height - margin.top - margin.bottom, 0]);

    const tooltip = select("body").append("div")
      .style("position", "absolute")
      .style("background", "#f4f4f4")
      .style("padding", "5 15px")
      .style("border", "1px #333 solid")
      .style("border-radius", "5px")
      .style("opacity", "0");

    const xAxis = axisBottom(xScale0).tickSizeOuter(axisTicks.outerSize);
    const yAxis = axisLeft(yScale).ticks(axisTicks.qty).tickSizeOuter(axisTicks.outerSize);

    xScale0.domain(data.map(d => d[chart.key]));
    xScale1.domain(chart && chart.group && chart.group.length > 0 && chart.group.map(groupItem => groupItem.name)).range([0, xScale0.bandwidth()]);
    yScale.domain([0, max(data,
      d => {
        let max = -1;
        Object.keys(d).forEach(key => typeof d[key] === "number" && d[key] > max && (max = d[key]));
        return max;
      })
    ]);

    const root = svg.selectAll(`.${chart.key}`)
      .data(data)
      .enter().append("g")
      .attr("class", chart.key)
      .attr("transform", d => `translate(${xScale0(d[chart.key])},0)`);

    chart && chart.group && chart.group.length > 0 && chart.group.forEach(groupItem => {
      const rootInner = root.selectAll(`.bar.${groupItem.name}`)
        .data(d => [d])
        .enter()
        .append("rect")
        .attr("class", `bar ${groupItem.name}`)
        .style("fill", colors[groupItem.colorMapper])
        .attr("x", d => xScale1(groupItem.name))
        .attr("y", height)
        .attr("width", xScale1.bandwidth())
        .attr("height", 0)
        .on("mouseover", function(event, d) {
          tooltip.transition()
            .style("opacity", 1)
          tooltip.html(d.claimsCount)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY) + "px")
          select(this).style("opacity", 0.5)
        })
        .on("mouseout", function(event, d) {
          tooltip.transition()
            .style("opacity", 0)
          select(this).style("opacity", 1);
        });
      rootInner.transition()
        .attr("height", d => height - margin.top - margin.bottom - yScale(d[groupItem.name]))
        .attr("y", d => yScale(d[groupItem.name]));
    })

// Add the X Axis
    svg
      .select(".x-axis")
      .attr("transform", `translate(0, ${height - margin.top - margin.bottom})`)
      .call(xAxis);

// Add the Y Axis
    svg.select(".y-axis")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(yAxis)
  }, [colors, data, dimensions, keys]);

  return (
    <div className={`c-GroupedBarChart${classes ? " " + classes : ""}`} ref={wrapperRef}>
      <svg ref={svgRef} style={{width: "100%", height: "100%"}}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
};

GroupedBarChart.propTypes = {
  chart: PropTypes.object,
  classes: PropTypes.string,
  colors: PropTypes.object,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  keys: PropTypes.array
};

export default memo(GroupedBarChart);
