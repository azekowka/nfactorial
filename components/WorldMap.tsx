'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { CITIES } from '@/data/cities';
import { COUNTRIES } from '@/data/countries';

interface WorldMapProps {
  width: number;
  height: number;
}

const WorldMap = ({ width, height }: WorldMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear any previous content
    mapRef.current.innerHTML = '';

    // Create SVG
    const svg = d3.select(mapRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('overflow', 'hidden');

    // Create groups for map and cities
    const gMap = svg.append('g');
    const gCities = svg.append('g');

    // Define map projection
    const projection = d3.geoMercator()
      .scale(width / 2 / Math.PI)
      .translate([width / 2, height / 2]);

    // Define path generator
    const path = d3.geoPath().projection(projection);

    // Setup zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([1, 10])
      .on('zoom', (event) => {
        const { transform } = event;
        gMap.attr('transform', transform);
        gCities.attr('transform', transform);
      });

    // Apply zoom to SVG
    svg.call(zoom as any);

    // Load world map data
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then((worldData: any) => {
        const countries = topojson.feature(worldData, worldData.objects.countries);

        // Draw countries
        gMap.selectAll('path')
          .data((countries as any).features)
          .enter()
          .append('path')
          .attr('d', path as any)
          .attr('fill', (d: any) => {
            const countryCode = d.properties.iso_a3;
            return COUNTRIES[countryCode] ? '#B0B0B0' : '#D0D0D0';
          })
          .attr('stroke', '#FFFFFF')
          .attr('stroke-width', 0.5)
          .on('mouseover', function(event, d: any) {
            d3.select(this)
              .attr('fill', '#A0C0A0');

            // Create tooltip
            const tooltip = d3.select('body').append('div')
              .attr('class', 'hoverinfo')
              .style('left', `${event.pageX + 10}px`)
              .style('top', `${event.pageY + 10}px`)
              .html(`<b>${d.properties.name}</b>`);

            // Move tooltip with mouse
            d3.select(this).on('mousemove', function(e) {
              tooltip
                .style('left', `${e.pageX + 10}px`)
                .style('top', `${e.pageY + 10}px`);
            });

            // Remove tooltip on mouseout
            d3.select(this).on('mouseout', function() {
              tooltip.remove();
              const countryCode = d.properties.iso_a3;
              d3.select(this).attr('fill', COUNTRIES[countryCode] ? '#B0B0B0' : '#D0D0D0');
            });
          });

        // Add cities
        gCities.selectAll('.city')
          .data(CITIES)
          .enter()
          .append('circle')
          .attr('class', 'city')
          .attr('r', d => d.radius)
          .attr('fill', '#FC8050')
          .attr('cx', d => {
            const coords = projection([d.longitude, d.latitude]);
            return coords ? coords[0] : 0;
          })
          .attr('cy', d => {
            const coords = projection([d.longitude, d.latitude]);
            return coords ? coords[1] : 0;
          })
          .on('mouseover', function(event, d) {
            // Highlight city
            d3.select(this)
              .attr('stroke', 'black')
              .attr('stroke-width', 2);

            // Create tooltip
            const tooltip = d3.select('body').append('div')
              .attr('class', 'hoverinfo')
              .style('left', `${event.pageX + 10}px`)
              .style('top', `${event.pageY + 10}px`)
              .html(`${d.name}: ${d.date}`);

            // Move tooltip with mouse
            d3.select(this).on('mousemove', function(e) {
              tooltip
                .style('left', `${e.pageX + 10}px`)
                .style('top', `${e.pageY + 10}px`);
            });

            // Remove tooltip and highlighting on mouseout
            d3.select(this).on('mouseout', function() {
              tooltip.remove();
              d3.select(this).attr('stroke', null);
            });
          });
      })
      .catch(error => console.error('Error loading world map data:', error));

    // Handle window resize
    const handleResize = () => {
      // We would update projection and redraw, but for simplicity we'll just
      // rely on the container's responsiveness in this example
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [width, height]);

  return (
    <div 
      ref={mapRef} 
      className="relative w-full h-full"
      style={{ minHeight: `${height}px` }}
    />
  );
};

export default WorldMap; 