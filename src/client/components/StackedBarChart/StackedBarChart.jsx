/* eslint-disable filenames/match-regex, no-magic-numbers, no-invalid-this */
import React, {memo, useEffect, useRef} from "react";
import { renderToString } from "react-dom/server";
import PropTypes from "prop-types";
import {
  axisBottom,
  axisLeft,
  format,
  max,
  scaleBand,
  scaleLinear,
  select,
  stack
} from "d3";
import d3Tip from "d3-tip";
import useResizeObserver from "./../../hooks/useResizeObserver";
import TopBrandsTooltip from "../custom-components/tooltip/templates/top-brand-tooltip";
import TopReporterTooltip from "../custom-components/tooltip/templates/top-reporters";
import Helper from "../../utility/helper";
import "./StackedBarChart.component.scss";

const StackedBarChart = props => {
  const {chart, classes, data, keys, colors, currentFilter} = props;
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  /* eslint-disable max-statements */
  useEffect(() => {
    const svg = select(svgRef.current);
    let {width, height} = dimensions || (wrapperRef.current ? wrapperRef.current.getBoundingClientRect() : {});
    const margin = {top: 0, right: 10, bottom: 30, left: 40};
    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;
    data.sort((a, b) => { return a[props.chart.sortKey] - b[props.chart.sortKey]; });

    const tooltip = d3Tip().attr("class", "d3-tip")
      .offset([-10, 0])
      .style("filter", "opacity(0.9)")
      .style("position", "absolute")
      .style("background", "#485465")
      .style("color", "white")
      .style("font-size", "11")
      .style("padding", "5 15px")
      .style("border", "1px #333 solid")
      .style("border-radius", "5px")
      .html((event, d) => {
        const Template = (props.chart.layerKey === "brandName") ? TopBrandsTooltip : TopReporterTooltip;
        return renderToString(<Template data={{d, colors, currentFilter}}/>);
      });

    const stackGenerator = stack()
      .keys(keys);
    const layers = stackGenerator(data);
    const extent = [0, max(layers, layer => max(layer, sequence => sequence[1]))];

    const y = scaleBand()
      .domain(data.map(d => chart.layerKey.includes(",") ? chart.layerKey.split(",").reduce((a, b) => `${d[a]  } ${  d[b]}`) : d[chart.layerKey]))
      .rangeRound([height, 0])
      .padding(0.25);

    const x = scaleLinear()
      .domain(extent)
      .range([0, width - margin.left - margin.right]);

    if (!data || (data.length !== undefined && !data.length)) {
      svg.append("text")
        .attr("y", height / 2)//magic number here
        .attr("x", width / 2)
        .attr("text-anchor", "middle")
        // .attr("class", "myLabel")
        .text("No data to show");
      return;
    }

    svg.append("text")
      .attr("transform", `translate(${  0  }, ${  height + margin.top + 17  })`)
      .style("font-size", "12")
      .style("font-weight", "bold")
      .text("Claims");

    const xTicks = x.ticks().filter(tick => Number.isInteger(tick));

    svg.append("circle").attr("id", `${props.containerId}-tipfollowscursor`);
    svg.call(tooltip);

    const sbChart = svg
      .selectAll(".layer")
      .data(layers)
      .join("g")
      .attr("transform", `translate(${  margin.left  },${  margin.top  })`)
      .attr("class", "layer")
      .attr("fill", layer => colors[layer.key])
      .selectAll("rect")
      .data(layer => layer)
      .join("rect")
      .attr("y", d => y(chart.layerKey.includes(",") ? chart.layerKey.split(",").reduce((a, b) => `${d.data[a]  } ${  d.data[b]}`) : d.data[chart.layerKey]))
      .attr("x", 0)
      .attr("width", 0)
      .attr("height", y.bandwidth())
      .on("mousemove", function(event, d) {
        select(this).style("opacity", 0.8);
        const target = select(`#${props.containerId}-tipfollowscursor`)
          .attr("cx", event.offsetX)
          .attr("cy", event.offsetY - 5) // 5 pixels above the cursor
          .node();
        tooltip.show(event, d, target);
      })
      .on("mouseout", function() {
        select(this).style("opacity", 1);
        tooltip.hide(this);
      });

    sbChart.transition()
      .attr("width", d => x(d[1]) - x(d[0]))
      .attr("x", d => x(d[0]));

    const xAxis = axisBottom(x)
      .tickValues(xTicks)
      .tickSize(-height)
      .tickPadding(10)
      .tickFormat(format("d"));

    svg
      .select(".x-axis")
      .attr("transform", `translate(${margin.left}, ${height + margin.top})`)
      .call(xAxis);

    const yAxis = axisLeft(y).tickSize(0);
    svg.select(".y-axis")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(yAxis)
      .selectAll(".tick text")
      .call(Helper.wrap, margin.left);
  }, [colors, data, dimensions, keys]);

  return (
    <div className={`c-StackedBarChart${classes ? ` ${  classes}` : ""}`} ref={wrapperRef}>
      <svg ref={svgRef} style={{width: "100%", height: "100%"}}>
        {
          data && data.length > 0 &&
            <React.Fragment>
              <g className="x-axis" />
              <g className="y-axis" />
            </React.Fragment>
        }
      </svg>
    </div>
  );
};

StackedBarChart.propTypes = {
  chart: PropTypes.object,
  classes: PropTypes.string,
  colors: PropTypes.object,
  containerId: PropTypes.string,
  currentFilter: PropTypes.object,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  keys: PropTypes.array
};

export default memo(StackedBarChart);
