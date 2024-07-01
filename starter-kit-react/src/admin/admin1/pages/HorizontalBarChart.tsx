import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const HorizontalBarChart = ({ data }) => {
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const handleResize = () => {
    if (svgRef.current) {
      const width = svgRef.current.parentElement.clientWidth;
      const height = 400; // Fixed height or adjust as needed
      setDimensions({ width, height });
    }
  };

  useEffect(() => {
    handleResize(); // Initial render
    window.addEventListener("resize", handleResize); // Add resize listener

    return () => window.removeEventListener("resize", handleResize); // Clean up listener on unmount
  }, []);

  useEffect(() => {
    if (dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);

    const sortedData = [...data].sort((a, b) => b.unitsSold - a.unitsSold);

    svg.selectAll("*").remove(); // Clear existing content

    // override bottom to 50 here to show Units sold text
    const margin = { top: 20, right: 30, bottom: 45, left: 100 };
    // const margin = { top: 20, right: 30, bottom: 30, left: 100 };
    const innerWidth = dimensions.width - margin.left - margin.right;
    const innerHeight = dimensions.height - margin.top - margin.bottom;

    const x = d3
      .scaleLinear()
      .rangeRound([0, innerWidth])
      .domain([0, d3.max(sortedData, (d) => d.unitsSold)]);

    const y = d3
      .scaleBand()
      .rangeRound([0, innerHeight])
      .padding(0.1)
      .domain(sortedData.map((d) => d.product));

    const g = svg
      .append("g")
      // -10 is a temporary fix for now
      .attr("transform", `translate(${margin.left - 10},${margin.top})`);
    // .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append("g")
      .attr("class", "axis axis-x")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    g.append("g").attr("class", "axis axis-y").call(d3.axisLeft(y));

    g.selectAll(".bar")
      .data(sortedData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", (d) => y(d.product))
      .attr("width", (d) => x(d.unitsSold))
      // subtract 12 here to make horizontal bars thinner
      .attr("height", y.bandwidth() - 12)
      // .attr("height", y.bandwidth())
      .attr("fill", "steelblue");

      const width = dimensions.width - margin.right;
    const height = 400 - margin.top - margin.bottom;
      svg.append('text')
       .attr('class', 'xlabel')
       .attr('x', width / 2)
       .attr('y', height + margin.top + 40)
       .attr('text-anchor', 'middle')
       .text('Units sold');


    // Add labels
    g.selectAll(".label")
      .data(sortedData)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.unitsSold) + 5) // Add some padding from the bar
      .attr("y", (d) => y(d.product) + y.bandwidth() / 2)
      .attr("dy", "0.35em") // Vertically center the text
      .text((d) => d.unitsSold);
  }, [dimensions]);

  return (
    <svg ref={svgRef} width="100%" height={dimensions.height}>
      <g />
    </svg>
  );
};

export default HorizontalBarChart;
