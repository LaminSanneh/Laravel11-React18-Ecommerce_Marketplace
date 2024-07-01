import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import ResizeObserver from 'resize-observer-polyfill'; // If needed for compatibility

const LineGraph = () => {
  const [granularity, setGranularity] = useState('days');
  const svgRef = useRef();
  const wrapperRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;

    // Overriding bottom to 55 as a temporary patchup
    const margin = { top: 20, right: 30, bottom: 55, left: 40 };
    // const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    // Clear previous svg contents
    svg.selectAll("*").remove();

    // Set the dimensions and margins of the graph
    svg.attr("width", width).attr("height", height);

    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-03-31');
    const data = generateData(startDate, endDate);

    // // Example data
    // const data = [
    //   { date: '2024-01-01', sales: 20 },
    //   { date: '2024-01-02', sales: 25 },
    //   { date: '2024-01-03', sales: 30 },
    //   { date: '2024-01-04', sales: 35 },
    //   { date: '2024-01-05', sales: 40 },
    //   { date: '2024-01-06', sales: 45 },
    //   { date: '2024-01-07', sales: 50 },
    //   { date: '2024-01-08', sales: 55 },
    //   // Add more data as needed
    // ];

    // Parse date and format date functions
    const parseDate = d3.timeParse('%Y-%m-%d');
    const formatDate = d3.timeFormat('%Y-%m-%d');

    // Aggregate data based on the selected granularity
    let aggregatedData;
    if (granularity === 'days') {
      aggregatedData = data.map(d => ({ date: parseDate(d.date), sales: d.sales }));
    } else if (granularity === 'weeks') {
      aggregatedData = d3.rollup(
        data.map(d => ({ date: parseDate(d.date), sales: d.sales })),
        v => d3.sum(v, d => d.sales),
        d => d3.timeWeek.floor(d.date)
      );
    } else if (granularity === 'months') {
      aggregatedData = d3.rollup(
        data.map(d => ({ date: parseDate(d.date), sales: d.sales })),
        v => d3.sum(v, d => d.sales),
        d => d3.timeMonth.floor(d.date)
      );
    }

    // Flatten the aggregated data
    let flattenedData;
    if (granularity === 'days') {
        flattenedData = Array.from(aggregatedData, ({date, sales}) => ({ date, sales }));
    } else {
        flattenedData = Array.from(aggregatedData, ([date, sales]) => ({ date, sales }));
    }

    // Set the scales
    const x = d3.scaleTime()
      .domain(d3.extent(flattenedData, d => d.date))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(flattenedData, d => d.sales)])
      .range([height - margin.bottom, margin.top]);

    // Add the x-axis
    const xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    // Add the y-axis
    const yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
        .attr("x", -margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("Sales ($)"));

    svg.append("g")
      .call(xAxis);

    svg.append("g")
      .call(yAxis);

    // Create the line
    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.sales))
      .curve(d3.curveCatmullRom); // Smooth the line

    svg.append("path")
      .datum(flattenedData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    // Tooltip
    const tooltip = d3.select("body").append("div")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("padding", "5px")
      .style("border", "1px solid #ccc")
      .style("border-radius", "5px")
      .style("display", "none");

    // Add the dots with tooltip
    svg.selectAll(".dot")
      .data(flattenedData)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => x(d.date))
      .attr("cy", d => y(d.sales))
      .attr("r", 5)
      .attr("fill", "steelblue")
      .on("mouseover", (event, d) => {
        tooltip.style("display", "inline-block");
        tooltip.html(`Date: ${formatDate(d.date)}<br>Sales: $${d.sales}`)
          .style("left", (event.pageX + 5) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => tooltip.style("display", "none"));
  }, [granularity, dimensions]);

  const generateData = (startDate, endDate) => {
    const data = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      data.push({
        date: currentDate.toISOString().slice(0, 10),
        sales: Math.floor(Math.random() * 50) + 20 // Example random sales data
      });
      currentDate.setDate(currentDate.getDate() + 1); // Increment date by 1 day
    }
    return data;
  };

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
      <select onChange={(e) => setGranularity(e.target.value)} value={granularity}>
        <option value="days">Days</option>
        <option value="weeks">Weeks</option>
        <option value="months">Months</option>
      </select>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default LineGraph;
