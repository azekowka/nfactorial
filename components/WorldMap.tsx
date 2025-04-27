'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

interface WorldMapProps {
  width: number;
  height: number;
}

// Country status types
type CountryStatus = 'visited' | 'want-to-visit' | null;

// Interface for country data
interface CountryData {
  [countryCode: string]: CountryStatus;
}

const WorldMap = ({ width, height }: WorldMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [countryData, setCountryData] = useState<CountryData>({});
  const [selectedCountry, setSelectedCountry] = useState<{
    code: string;
    name: string;
    x: number;
    y: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [debug, setDebug] = useState<string[]>([]);

  // Add debug info
  const addDebug = (message: string) => {
    console.log(message);
    setDebug(prev => [...prev, message]);
  };

  // Load country data on component mount
  useEffect(() => {
    const loadCountryData = async () => {
      try {
        const response = await fetch('/api/countries');
        if (response.ok) {
          const data = await response.json();
          setCountryData(data);
          addDebug(`Loaded country data: ${Object.keys(data).length} countries`);
        }
      } catch (error) {
        console.error('Error loading country data:', error);
      }
    };
    
    loadCountryData();
  }, []);

  // Function to update country status
  const updateCountryStatus = async (countryCode: string, status: CountryStatus) => {
    if (!countryCode) return;
    
    addDebug(`Updating country ${countryCode} to status: ${status}`);
    setLoading(true);
    
    try {
      const method = countryData[countryCode] ? 'PUT' : 'POST';
      const endpoint = countryData[countryCode] && status === null 
        ? `/api/countries/${countryCode}?_method=DELETE`
        : `/api/countries/${countryCode}`;
      
      addDebug(`Sending ${method} request to ${endpoint}`);
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const responseData = await response.json();
        addDebug(`API response: ${JSON.stringify(responseData)}`);
        
        // Update local state
        const newData = { ...countryData };
        if (status === null) {
          delete newData[countryCode];
        } else {
          newData[countryCode] = status;
        }
        
        // Update state with new data
        setCountryData(newData);
        
        // Force immediate visual update without full redraw
        updateCountryColor(countryCode, status);
      }
    } catch (error) {
      console.error('Error updating country status:', error);
      addDebug(`Error: ${error}`);
    } finally {
      setLoading(false);
      setSelectedCountry(null); // Close the menu
    }
  };

  // Function to immediately update a country's color without redrawing the map
  const updateCountryColor = (countryCode: string, status: CountryStatus) => {
    if (!mapRef.current) return;
    
    const selector = `#country-${countryCode}`;
    addDebug(`Updating color for ${selector} to ${status || 'default'}`);
    
    let color = '#D0D0D0'; // Default
    if (status === 'visited') {
      color = '#4CAF50'; // Green
    } else if (status === 'want-to-visit') {
      color = '#2196F3'; // Blue
    }
    
    const countryPath = d3.select(mapRef.current).select(selector);
    if (countryPath.size() > 0) {
      countryPath.attr('fill', color);
      addDebug(`Changed color for ${countryCode} to ${color}`);
    } else {
      addDebug(`No element found for ${selector}`);
    }
  };

  // Draw the map with current country data
  const drawMap = (data: CountryData) => {
    if (!mapRef.current) return;
    
    // Clear any previous content
    mapRef.current.innerHTML = '';
    addDebug('Redrawing map');
    
    // Create SVG
    const svg = d3.select(mapRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('overflow', 'hidden');
    
    // Create map group
    const gMap = svg.append('g');
    
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
      });
    
    // Apply zoom to SVG
    svg.call(zoom as any);
    
    // Close popup when clicking on the map background
    svg.on('click', () => {
      setSelectedCountry(null);
    });
    
    // Load world map data
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then((worldData: any) => {
        const countries = topojson.feature(worldData as any, (worldData as any).objects.countries);
        
        // Draw countries
        gMap.selectAll('path')
          .data((countries as any).features)
          .enter()
          .append('path')
          .attr('d', path as any)
          .attr('id', (d: any) => {
            // Use iso_a3 if available, otherwise use a fallback ID
            const countryName = d.properties.name;
            let countryCode = d.properties.iso_a3;
            
            if (!countryCode) {
              // For Russia and other countries without ISO code
              countryCode = countryName.substring(0, 3).toUpperCase();
            }
            
            // Return the ID without trying to set data-attribute in the same function
            return `country-${countryCode}`;
          })
          .attr('data-code', (d: any) => {
            const countryName = d.properties.name;
            let countryCode = d.properties.iso_a3;
            
            if (!countryCode) {
              countryCode = countryName.substring(0, 3).toUpperCase();
            }
            
            return countryCode;
          })
          .attr('fill', (d: any) => {
            // Use iso_a3 if available, otherwise use a fallback
            const countryName = d.properties.name;
            let countryCode = d.properties.iso_a3;
            
            if (!countryCode) {
              countryCode = countryName.substring(0, 3).toUpperCase();
            }
            
            const status = countryCode ? data[countryCode] : null;
            
            if (status === 'visited') {
              return '#4CAF50'; // Green for visited
            } else if (status === 'want-to-visit') {
              return '#2196F3'; // Blue for want to visit
            }
            return '#D0D0D0'; // Default gray
          })
          .attr('stroke', '#FFFFFF')
          .attr('stroke-width', 0.5)
          .on('mouseover', function(this: SVGPathElement, event: any, d: any) {
            d3.select(this).attr('fill', function(this: SVGPathElement) {
              const countryName = d.properties.name;
              let countryCode = d.properties.iso_a3;
              
              if (!countryCode) {
                countryCode = countryName.substring(0, 3).toUpperCase();
              }
              
              const status = countryCode ? data[countryCode] : null;
              
              if (status === 'visited') {
                return '#3D8C40'; // Darker green
              } else if (status === 'want-to-visit') {
                return '#1976D2'; // Darker blue
              }
              return '#A0C0A0'; // Hover color
            });
          })
          .on('mouseout', function(this: SVGPathElement, event: any, d: any) {
            const countryName = d.properties.name;
            let countryCode = d.properties.iso_a3;
            
            if (!countryCode) {
              countryCode = countryName.substring(0, 3).toUpperCase();
            }
            
            // Don't change color if this is the selected country
            if (!selectedCountry || selectedCountry.code !== countryCode) {
              const status = countryCode ? data[countryCode] : null;
              
              if (status === 'visited') {
                d3.select(this).attr('fill', '#4CAF50');
              } else if (status === 'want-to-visit') {
                d3.select(this).attr('fill', '#2196F3');
              } else {
                d3.select(this).attr('fill', '#D0D0D0');
              }
            }
          })
          .on('click', function(this: SVGPathElement, event: any, d: any) {
            event.stopPropagation(); // Prevent triggering click on the map
            
            // Get country info, use a fallback for the code if iso_a3 is undefined
            const countryName = d.properties.name;
            let countryCode = d.properties.iso_a3;
            
            // For countries where iso_a3 is undefined, use a fallback code based on the country name
            if (!countryCode) {
              countryCode = countryName.substring(0, 3).toUpperCase();
              addDebug(`Using fallback code ${countryCode} for ${countryName}`);
            }
            
            addDebug(`Clicked on ${countryName} (${countryCode})`);
            
            // Show the popup menu
            setSelectedCountry({
              code: countryCode,
              name: countryName,
              x: event.pageX,
              y: event.pageY
            });
          });
          
        // Apply colors to countries based on current data
        Object.entries(data).forEach(([code, status]) => {
          const selector = `#country-${code}`;
          const countryPath = d3.select(mapRef.current).select(selector);
          
          if (countryPath.size() > 0) {
            let color = '#D0D0D0'; // Default
            if (status === 'visited') {
              color = '#4CAF50'; // Green
            } else if (status === 'want-to-visit') {
              color = '#2196F3'; // Blue
            }
            
            countryPath.attr('fill', color);
            addDebug(`Set initial color for ${code} to ${status}`);
          }
        });
          
        addDebug(`Rendered ${(countries as any).features.length} countries`);
      })
      .catch(error => {
        console.error('Error loading world map data:', error);
        addDebug(`Map data error: ${error}`);
      });
  };

  // Draw the initial map
  useEffect(() => {
    drawMap(countryData);
    
    // Handle clicks outside the map to close the popup
    const handleDocumentClick = (e: MouseEvent) => {
      if (mapRef.current && !mapRef.current.contains(e.target as Node)) {
        setSelectedCountry(null);
      }
    };
    
    document.addEventListener('click', handleDocumentClick);
    
    // Cleanup
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [width, height, countryData]);
  
  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="relative w-full h-full"
        style={{ minHeight: `${height}px` }}
      />
      
      {/* Country selection popup */}
      {selectedCountry && (
        <div 
          className="absolute z-10 bg-white shadow-lg rounded-md p-2 flex flex-col gap-2"
          style={{
            position: 'fixed',
            left: `${selectedCountry.x}px`,
            top: `${selectedCountry.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="font-medium text-center pb-1">{selectedCountry.name}</div>
          <button 
            disabled={loading}
            onClick={() => {
              addDebug(`Visiting ${selectedCountry.name} (${selectedCountry.code})`);
              updateCountryStatus(selectedCountry.code, 'visited');
            }}
            className={`px-3 py-1 rounded-md ${countryData[selectedCountry.code] === 'visited' 
              ? 'bg-green-600 text-white' 
              : 'bg-green-100 hover:bg-green-200 text-green-800'}`}
          >
            {countryData[selectedCountry.code] === 'visited' ? '✓ Visited' : 'Mark as Visited'}
          </button>
          <button 
            disabled={loading}
            onClick={() => {
              addDebug(`Want to visit ${selectedCountry.name} (${selectedCountry.code})`);
              updateCountryStatus(selectedCountry.code, 'want-to-visit');
            }}
            className={`px-3 py-1 rounded-md ${countryData[selectedCountry.code] === 'want-to-visit' 
              ? 'bg-blue-600 text-white' 
              : 'bg-blue-100 hover:bg-blue-200 text-blue-800'}`}
          >
            {countryData[selectedCountry.code] === 'want-to-visit' ? '✓ Want to Visit' : 'Want to Visit'}
          </button>
          {countryData[selectedCountry.code] && (
            <button 
              disabled={loading}
              onClick={() => {
                addDebug(`Removing ${selectedCountry.name} (${selectedCountry.code})`);
                updateCountryStatus(selectedCountry.code, null);
              }}
              className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800"
            >
              Remove Marker
            </button>
          )}
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="loading-spinner"></div>
        </div>
      )}
      
      {/* Debug info (hidden in production) */}
      {debug.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white p-2 rounded shadow-lg max-w-md max-h-60 overflow-auto opacity-80 text-xs">
          <h3 className="font-bold mb-1">Debug Info:</h3>
          <ul>
            {debug.slice(-10).map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WorldMap; 