import React, {useEffect} from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import "./StackedBarChart.component.scss";

const StackedBarChart = props => {

  useEffect(() => {
    const svg = d3.select(props.chartWrapper.current)
      .append("svg")
      .attr("width", 500)
      .attr("height", 500);

    d3.json(tallestMenURL).then(data => {
      const y = d3.scaleLinear()
        .domain([0, 272])
        .range([0, 500])

      const x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, 800])
        .padding(0.4)

      const rects = svg.selectAll("rect")
        .data(data);

      rects.enter().append("rect")
        .attr("x", (d, i) => i * 100)
        .attr("y", 0)
        .attr("width", 50)
        .attr("height", d => d.height)
        .attr("fill", "grey")
    })

  }, []);

  return (
    <div className="c-StackedBarChart">
      In Component StackedBarChart
    </div>
  );
};

StackedBarChart.propTypes = {
  chartWrapper: PropTypes.object
};

export default StackedBarChart;
