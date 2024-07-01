import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const DoughnutChartCountries = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Set up dimensions and margins
    const width = 500;
    const height = 500;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    // Create the SVG element
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Create the color scale
    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.country))
      .range(d3.schemeCategory10);

    // Create the pie and arc generators
    const pie = d3.pie()
      .value(d => d.visitors)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(radius * 0.5) // Inner radius for doughnut chart
      .outerRadius(radius * 0.8);

    const outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    // Add the slices
    svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.country))
      .attr('stroke', 'white')
      .style('stroke-width', '2px');

    // Add labels
    svg.selectAll('text')
      .data(pie(data))
      .enter()
      .append('text')
      .text(d => d.data.country)
      .attr('transform', d => `translate(${outerArc.centroid(d)})`)
      .style('text-anchor', 'middle')
      .style('font-size', '12px');

    // Tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', '#fff')
      .style('border', '1px solid #ccc')
      .style('padding', '10px')
      .style('display', 'none');

    svg.selectAll('path')
      .on('mouseover', (event, d) => {
        tooltip.style('display', 'block')
          .html(`Country: ${d.data.country}<br>Visitors: ${d.data.visitors}`);
      })
      .on('mousemove', (event) => {
        tooltip.style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`);
      })
      .on('mouseout', () => {
        tooltip.style('display', 'none');
      });

  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default DoughnutChartCountries;
