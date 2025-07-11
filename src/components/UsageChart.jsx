import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const UsageChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0 || !chartRef.current) return;

    // Clear any existing chart
    d3.select(chartRef.current).selectAll('*').remove();

    // Set dimensions and margins
    const margin = { top: 20, right: 30, bottom: 30, left: 60 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = chartRef.current.clientHeight - margin.top - margin.bottom;

    // Create SVG element
    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Format dates for better display
    const parseDate = d3.timeParse('%Y-%m-%d');
    const formattedData = data.map(d => ({
      date: parseDate(d.date),
      count: d.count
    }));

    // Sort data by date
    formattedData.sort((a, b) => a.date - b.date);

    // X scale - time
    const x = d3
      .scaleTime()
      .domain(d3.extent(formattedData, d => d.date))
      .range([0, width]);

    // Y scale - linear
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(formattedData, d => d.count) * 1.1]) // Add 10% padding at top
      .range([height, 0]);

    // Add X axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat('%m/%d')))
      .selectAll('text')
      .style('font-size', '10px');

    // Add Y axis
    svg
      .append('g')
      .call(d3.axisLeft(y).ticks(5))
      .selectAll('text')
      .style('font-size', '10px');

    // Add Y axis label
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#4B5563')
      .text('Requests');

    // Create the line generator
    const line = d3
      .line()
      .x(d => x(d.date))
      .y(d => y(d.count))
      .curve(d3.curveMonotoneX);

    // Add the line path
    svg
      .append('path')
      .datum(formattedData)
      .attr('fill', 'none')
      .attr('stroke', '#3B82F6')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add area below the line
    const area = d3
      .area()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y(d.count))
      .curve(d3.curveMonotoneX);

    svg
      .append('path')
      .datum(formattedData)
      .attr('fill', 'url(#gradient)')
      .attr('d', area);

    // Create gradient
    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#3B82F6')
      .attr('stop-opacity', 0.3);

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#3B82F6')
      .attr('stop-opacity', 0.05);

    // Add dots for each data point
    svg
      .selectAll('circle')
      .data(formattedData)
      .enter()
      .append('circle')
      .attr('cx', d => x(d.date))
      .attr('cy', d => y(d.count))
      .attr('r', 4)
      .attr('fill', '#3B82F6')
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      .append('title') // Add tooltip on hover
      .text(d => `${d.date.toLocaleDateString()}: ${d.count} requests`);

    // Add responsive resize handler
    const resizeChart = () => {
      // Update the chart when window resizes
      const newWidth = chartRef.current.clientWidth - margin.left - margin.right;
      svg
        .attr('width', newWidth + margin.left + margin.right)
        .attr('transform', `translate(${margin.left},${margin.top})`);

      x.range([0, newWidth]);
      svg.select('.x-axis').call(d3.axisBottom(x));
      svg.select('path.line').attr('d', line);
      svg.select('path.area').attr('d', area);
      svg.selectAll('circle')
        .attr('cx', d => x(d.date))
        .attr('cy', d => y(d.count));
    };

    window.addEventListener('resize', resizeChart);

    // Clean up listener on component unmount
    return () => {
      window.removeEventListener('resize', resizeChart);
    };
  }, [data]);

  return (
    <div ref={chartRef} className="w-full h-full" />
  );
};

export default UsageChart;