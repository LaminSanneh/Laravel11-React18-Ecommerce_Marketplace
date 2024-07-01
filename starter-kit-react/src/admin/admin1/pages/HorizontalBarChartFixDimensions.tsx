import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const HorizontalBarChart = ({ data }) => {
  const svgRef = useRef<SVGElement>(null);

  useEffect(() => {
    // Set up dimensions and margins
    const margin = { top: 20, right: 30, bottom: 40, left: 100 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Sort data from highest to lowest units sold
    const sortedData = [...data].sort((a, b) => b.unitsSold - a.unitsSold);

    // Set up scales
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(sortedData, (d) => d.unitsSold)])
      .range([0, width]);

    const yScale = d3
      .scaleBand()
      .domain(sortedData.map((d) => d.product))
      .range([0, height])
      .padding(0.1);

    // Create the SVG element
    const svg = d3
      .select(svgRef.current)
      // .select('p')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add the x-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(5));

    // Add the y-axis
    svg.append("g").call(d3.axisLeft(yScale));

    // Add the bars
    svg
      .selectAll(".bar")
      .data(sortedData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", (d) => yScale(d.product))
      .attr("width", (d) => xScale(d.unitsSold))
      .attr("height", yScale.bandwidth())
      .attr("fill", "steelblue");
  }, []);

  return <svg ref={svgRef}></svg>;
  // return (<p></p>);
};

export default HorizontalBarChart;
