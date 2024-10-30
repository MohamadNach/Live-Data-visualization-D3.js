//@ts-nocheck
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useSelector } from 'react-redux';
import { fetchData } from '../Services/dataService'; // Adjust the import path as necessary

interface DataPoint {
  datasetId: number;
  startTime: string;
  endTime: string;
  value: number;
}

const Chart = () => {
  const { chartId, chartTitle } = useSelector(
    (state: RootState) => state.optionsR
  );
  const { from, to } = useSelector((state: RootState) => state.dateR);
  const [data, setData] = useState<DataPoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    if (new Date(from) > new Date(to)) {
      setError('Error: Start time must be before end time.');
      return;
    }
    setError(null);

    const fetchDataAsync = async () => {
      try {
        if (!chartId) {
          setError('Please choose a valid chart type.');
          return;
        }

        const data = await fetchData(from, to, chartId);
        if (data) {
          setData(data);
        } else {
          setError('No data available for the selected timeframe.');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch data.');
      }
    };

    fetchDataAsync();
  }, [from, to, chartId]);

  useEffect(() => {
    if (data.length > 0) {
      drawChart(data);
    }
  }, [data]);

  const drawChart = (data: DataPoint[]) => {
    const dimensions = {
      width: window.innerWidth * 0.8,
      height: 550,
      margin: { top: 20, right: 15, bottom: 20, left: 60 },
      boundedWidth: window.innerWidth * 0.8 - 60 - 15,
      boundedHeight: 550 - 15 - 50,
    };
    const { width, height, margin } = dimensions;
    // const boundedWidth = width - margin.left - margin.right;
    // const boundedHeight = height - margin.top - margin.bottom;
    const yAccessor = (d: DataPoint) => d.value; // Accessing value directly
    const dateParser = d3.timeParse('%Y-%m-%dT%H:%M:%S.%LZ'); // Adjusted to match your date format
    const xAccessor = (d: DataPoint) => dateParser(d.startTime) as Date;
    console.log(xAccessor(data[0]));
    console.log(xAccessor(data[1]));
    console.log(xAccessor(data[2]));
    d3.select('#chart-wrapper').selectAll('svg').remove();
    const translate = `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`;

    const svg = d3
      .select('#chart-wrapper')
      .append('svg')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .style('border', '1px solid black');

    const bounds = svg.append('g').style('transform', translate);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, yAccessor) as [number, number])
      .range([dimensions.boundedHeight - margin.bottom, 0])
      .nice();

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, xAccessor) as [Date, Date])
      .range([0, dimensions.boundedWidth]);

    const lineGenerator = d3
      .line<DataPoint>()
      .x((d) => xScale(xAccessor(d)))
      .y((d) => yScale(yAccessor(d)));

    const transition = (path: any) => {
      path
        .transition()
        .duration(7500)
        .attrTween('stroke-dasharray', function () {
          const length = this.getTotalLength();
          const interpolate = d3.interpolateString(
            '0,' + length,
            length + ',' + length
          );
          return (t) => interpolate(t);
        });
    };

    bounds
      .append('path')
      .datum(data)
      .attr('d', lineGenerator)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .call((path) => transition(path));

    const yAxisGenerator = d3.axisLeft(yScale);
    const xAxisGenerator = d3.axisBottom(xScale);

    bounds.append('g').call(yAxisGenerator);
    bounds
      .append('g')
      .call(xAxisGenerator)
      .style('transform', `translateY(${dimensions.boundedHeight}px)`);
    bounds
      .append('text')
      .attr('x', dimensions.boundedWidth / 2)
      .attr('y', dimensions.margin.bottom + 500)
      .attr('fill', 'black')
      .style('font-size', '16px')
      .text('Date');
    bounds
      .append('text')
      .attr('x', -dimensions.boundedHeight / 2)
      .attr('y', -dimensions.margin.left + 15)
      .attr('fill', 'black')
      .style('font-size', '16px')
      .style('transform', 'rotate(-90deg)')
      .text('Gigawatt');

    // Add title
    bounds
      .append('text')
      .attr('x', -dimensions.boundedHeight / 2)
      .attr('y', -dimensions.margin.left + 15)
      .attr('fill', 'middle')
      .style('font-size', '24px')
      .style('font-weight', 'bold')
      .text(chartTitle); // Use provided title or defaulta
  };

  return (
    <div id='chart-wrapper' className='m-10'>
      <p>{chartTitle}</p>
      {error && <p className='w-[260px] m-auto p-4'>{error}</p>}
      {!data.length && !error && (
        <p className='w-[260px] m-auto p-4'>Loading chart...</p>
      )}
    </div>
  );
};

export default Chart;
