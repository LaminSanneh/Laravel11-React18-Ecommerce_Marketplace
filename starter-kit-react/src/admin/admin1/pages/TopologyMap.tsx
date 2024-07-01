// src/TopologyMap.js
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import worldData from '../dataSources/countries-110m.json';
import { countryTrafficSourcesData2 as data } from '../dataSources/countryTrafficSourcesData';

const TopologyMap = () => {
  const svgRef = useRef<SVGAElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const handleResize = () => {
    if (svgRef.current) {
      const width = svgRef.current.parentElement.clientWidth;
      const height = 500; // Fixed height or adjust as needed
      setDimensions({ width, height });
    }
  };

  useEffect(() => {
    handleResize(); // Initial render
    window.addEventListener('resize', handleResize); // Add resize listener

    return () => window.removeEventListener('resize', handleResize); // Clean up listener on unmount
  }, []);

  useEffect(() => {
    if (dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear existing content

    // Set up dimensions
    // const width = 960;
    // const height = 600;
    const width = dimensions.width;
    const height = dimensions.height;

    // Create the SVG element
    // const svg = d3.select(svgRef.current)
    svg.attr('width', width)
      .attr('height', height);

    // Create the projection and path generator
    const projection = d3.geoMercator()
      .scale(150)
      .translate([width / 2, height / 1.5]);
    const path = d3.geoPath().projection(projection);

    // Convert TopoJSON to GeoJSON
    const countries = topojson.feature(worldData, worldData.objects.countries).features;

    // Create a color scale
    const color = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(data, d => d.visitors)]);

    // Create a dictionary for country codes and visitor counts
    const countryData = {};
    data.forEach(d => {
      const country = countries.find(c => c.properties.name === d.country);
      if (country) {
        countryData[country.id] = d.visitors;
      }
    });

    // Draw the map
    svg.selectAll('path')
      .data(countries)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', d => color(countryData[d.id] || 0))
      .attr('stroke', '#333')
      .attr('stroke-width', 0.5);

    // Add tooltips
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', '#fff')
      .style('border', '1px solid #ccc')
      .style('padding', '10px')
      .style('display', 'none');

    svg.selectAll('path')
      .on('mouseover', (event, d) => {
        const countryName = d.properties.name;
        const visitors = countryData[d.id] || 0;
        tooltip.style('display', 'block')
          .html(`Country: ${countryName}<br>Visitors: ${visitors}`);
      })
      .on('mousemove', (event) => {
        tooltip.style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`);
      })
      .on('mouseout', () => {
        tooltip.style('display', 'none');
      });

    // Your D3 topology map code goes here
    // Replace this with your actual topology map rendering logic using D3

  }, [dimensions]);

//   useEffect(() => {
//     // Set up dimensions
//     const width = 960;
//     const height = 600;

//     // Create the SVG element
//     const svg = d3.select(svgRef.current)
//       .attr('width', width)
//       .attr('height', height);

//     // Create the projection and path generator
//     const projection = d3.geoMercator()
//       .scale(150)
//       .translate([width / 2, height / 1.5]);
//     const path = d3.geoPath().projection(projection);

//     // Convert TopoJSON to GeoJSON
//     const countries = topojson.feature(worldData, worldData.objects.countries).features;

//     // Create a color scale
//     const color = d3.scaleSequential(d3.interpolateBlues)
//       .domain([0, d3.max(data, d => d.visitors)]);

//     // Create a dictionary for country codes and visitor counts
//     const countryData = {};
//     data.forEach(d => {
//       const country = countries.find(c => c.properties.name === d.country);
//       if (country) {
//         countryData[country.id] = d.visitors;
//       }
//     });

//     // Draw the map
//     svg.selectAll('path')
//       .data(countries)
//       .enter()
//       .append('path')
//       .attr('d', path)
//       .attr('fill', d => color(countryData[d.id] || 0))
//       .attr('stroke', '#333')
//       .attr('stroke-width', 0.5);

//     // Add tooltips
//     const tooltip = d3.select('body').append('div')
//       .attr('class', 'tooltip')
//       .style('position', 'absolute')
//       .style('background', '#fff')
//       .style('border', '1px solid #ccc')
//       .style('padding', '10px')
//       .style('display', 'none');

//     svg.selectAll('path')
//       .on('mouseover', (event, d) => {
//         const countryName = d.properties.name;
//         const visitors = countryData[d.id] || 0;
//         tooltip.style('display', 'block')
//           .html(`Country: ${countryName}<br>Visitors: ${visitors}`);
//       })
//       .on('mousemove', (event) => {
//         tooltip.style('left', `${event.pageX + 10}px`)
//           .style('top', `${event.pageY - 20}px`);
//       })
//       .on('mouseout', () => {
//         tooltip.style('display', 'none');
//       });

//   }, []);

  return <svg ref={svgRef}></svg>;
};

export default TopologyMap;
