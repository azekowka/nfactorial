'use client';

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
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

// Expose functions for external use
export interface WorldMapRef {
  exportAsSVG: () => void;
  exportAsPNG: () => void;
}

const WorldMap = forwardRef<WorldMapRef, WorldMapProps>(({ width, height }, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [countryData, setCountryData] = useState<CountryData>({});
  const [selectedCountry, setSelectedCountry] = useState<{
    code: string;
    name: string;
    x: number;
    y: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [debug, setDebug] = useState<string[]>([]);

  // Expose functions via ref
  useImperativeHandle(ref, () => ({
    exportAsSVG: () => {
      exportAsSVG();
    },
    exportAsPNG: () => {
      exportAsPNG();
    }
  }));

  // Function to export the map as SVG
  const exportAsSVG = () => {
    if (!mapRef.current || !svgRef.current) return;
    
    try {
      // Get the SVG element
      const svgElement = svgRef.current;
      
      // Create a copy of the SVG element to work with
      const svgCopy = svgElement.cloneNode(true) as SVGSVGElement;
      
      // Set a white background
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('width', width.toString());
      rect.setAttribute('height', height.toString());
      rect.setAttribute('fill', 'white');
      svgCopy.insertBefore(rect, svgCopy.firstChild);
      
      // Convert SVG to a string
      const svgData = new XMLSerializer().serializeToString(svgCopy);
      
      // Create a Blob containing the SVG data
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      
      // Create a URL to the Blob
      const url = URL.createObjectURL(blob);
      
      // Create a download link and click it
      const link = document.createElement('a');
      link.download = 'world-map.svg';
      link.href = url;
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting SVG:', error);
    }
  };

  // Function to export the map as PNG
  const exportAsPNG = () => {
    if (!mapRef.current || !svgRef.current) return;
    
    try {
      // Get the SVG element
      const svgElement = svgRef.current;
      
      // Create a copy of the SVG element to work with
      const svgCopy = svgElement.cloneNode(true) as SVGSVGElement;
      
      // Set a white background
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('width', width.toString());
      rect.setAttribute('height', height.toString());
      rect.setAttribute('fill', 'white');
      svgCopy.insertBefore(rect, svgCopy.firstChild);
      
      // Convert SVG to a string
      const svgData = new XMLSerializer().serializeToString(svgCopy);
      
      // Create a URL for the SVG data
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);
      
      // Create an Image element
      const img = new Image();
      
      // Set up load handler
      img.onload = () => {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        // Draw the image on the canvas
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0);
          
          // Convert canvas to PNG
          canvas.toBlob((blob) => {
            if (blob) {
              // Create a URL for the PNG blob
              const pngUrl = URL.createObjectURL(blob);
              
              // Create a download link and click it
              const link = document.createElement('a');
              link.download = 'world-map.png';
              link.href = pngUrl;
              link.click();
              
              // Clean up
              URL.revokeObjectURL(pngUrl);
            }
          }, 'image/png');
        }
        
        // Clean up
        URL.revokeObjectURL(url);
      };
      
      // Load the SVG as an image
      img.src = url;
    } catch (error) {
      console.error('Error exporting PNG:', error);
    }
  };

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
      .attr('id', 'world-map-svg')
      .style('overflow', 'hidden');
    
    // Save reference to the SVG element
    svgRef.current = svg.node();

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

    // Add title for the map
    svg.append('title').text('My World Travel Map');

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
            
            // Normal color based on status
            const status = countryCode ? data[countryCode] : null;
            let color = '#D0D0D0'; // Default
            
            if (status === 'visited') {
              color = '#4CAF50'; // Green
            } else if (status === 'want-to-visit') {
              color = '#2196F3'; // Blue
            }
            
            d3.select(this).attr('fill', color);
          })
          .on('click', function(this: SVGPathElement, event: any, d: any) {
            event.stopPropagation();
            
            const countryName = d.properties.name;
            let countryCode = d.properties.iso_a3;
            
            if (!countryCode) {
              countryCode = countryName.substring(0, 3).toUpperCase();
            }
            
            // Calculate position for the popup
            const bounds = (this as SVGPathElement).getBoundingClientRect();
            const mapBounds = mapRef.current?.getBoundingClientRect();
            
            if (mapBounds) {
              const x = bounds.x + bounds.width / 2 - mapBounds.x;
              const y = bounds.y + bounds.height / 2 - mapBounds.y;
              
              setSelectedCountry({
                code: countryCode,
                name: countryName,
                x,
                y
              });
            }
          });
      });
  };

  // Effect to draw the map when component mounts or data changes
  useEffect(() => {
    if (Object.keys(countryData).length > 0 || !mapRef.current?.hasChildNodes()) {
      drawMap(countryData);
    }
  }, [countryData, width, height]);

  // Effect to add document click listener for closing popups
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (selectedCountry && mapRef.current && !mapRef.current.contains(e.target as Node)) {
        setSelectedCountry(null);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [selectedCountry]);

  // Render the world map
  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="w-full h-full bg-white rounded-lg overflow-hidden shadow-md"
      />
      
      {/* Country popup */}
      {selectedCountry && (
        <div 
          className="absolute bg-white rounded-lg shadow-lg p-4 z-10"
          style={{ 
            left: `${selectedCountry.x}px`, 
            top: `${selectedCountry.y}px`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <h3 className="font-bold mb-2">{selectedCountry.name}</h3>
          <div className="flex flex-col gap-2">
            <button
              disabled={loading}
              onClick={() => updateCountryStatus(selectedCountry.code, 'visited')}
              className={`px-2 py-1 rounded ${
                countryData[selectedCountry.code] === 'visited'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 hover:bg-green-500 hover:text-white'
              }`}
            >
              ✅ Visited
            </button>
            <button
              disabled={loading}
              onClick={() => updateCountryStatus(selectedCountry.code, 'want-to-visit')}
              className={`px-2 py-1 rounded ${
                countryData[selectedCountry.code] === 'want-to-visit'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-blue-500 hover:text-white'
              }`}
            >
              🗺️ Want to Visit
            </button>
            {countryData[selectedCountry.code] && (
              <button
                disabled={loading}
                onClick={() => updateCountryStatus(selectedCountry.code, null)}
                className="px-2 py-1 bg-gray-200 hover:bg-red-500 hover:text-white rounded"
              >
                ❌ Remove
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Debug panel - hidden in production */}
      {process.env.NODE_ENV === 'development' && debug.length > 0 && (
        <div className="fixed bottom-0 right-0 bg-gray-800 text-white p-4 max-w-xs max-h-60 overflow-auto z-50 text-xs">
          <h4 className="font-bold mb-2">Debug:</h4>
          <ul>
            {debug.slice(-10).map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

WorldMap.displayName = 'WorldMap';

export default WorldMap; 