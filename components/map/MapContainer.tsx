"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// @ts-ignore: Missing declaration file
import * as turf from "@turf/turf";
import { Country, VehicleType } from "@/types/map-types";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

// Define GeoJSON type for the route
interface RouteGeoJSON {
  type: "Feature";
  properties: Record<string, any>;
  geometry: {
    type: "LineString";
    coordinates: number[][];
  };
}

interface MapContainerProps {
  selectedCountries: Country[];
  isAnimating: boolean;
  animationSpeed: number;
  isExporting: boolean;
  onExportComplete: () => void;
  vehicleType: VehicleType;
}

const MapContainer = ({
  selectedCountries,
  isAnimating,
  animationSpeed,
  isExporting,
  onExportComplete,
  vehicleType,
}: MapContainerProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const animationRef = useRef<number | null>(null);
  const [route, setRoute] = useState<RouteGeoJSON | null>(null);
  const [hasStartedAnimation, setHasStartedAnimation] = useState(false);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const routeRef = useRef<RouteGeoJSON | null>(null);

  console.log("State check:", { isAnimating, hasStartedAnimation, selectedCountries: selectedCountries.length, route: !!route });
  
  // Get vehicle emoji based on type
  const getVehicleEmoji = (type: VehicleType): string => {
    switch (type) {
      case "airplane":
        return "✈️";
      case "person":
        return "🚶";
      case "car":
        return "🚗";
      default:
        return "✈️";
    }
  };

  // Initialize map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [0, 20],
        zoom: 1.5,
      });

      // Add navigation control
      mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Add fullscreen control
      mapRef.current.addControl(new mapboxgl.FullscreenControl());

      mapRef.current.on("load", () => {
        if (!mapRef.current) return;

        // Add the route line source
        mapRef.current.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [],
            },
          },
        });

        // Add the route line layer
        mapRef.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3887be",
            "line-width": 5,
            "line-opacity": 0.75,
          },
        });
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, []);

  // Function to update marker with current position and vehicle type
  const updateMarker = useCallback((
    coordinates: [number, number],
    bearingValue = 0
  ) => {
    if (!mapRef.current) return null;
    
    // Remove existing marker if it exists
    if (markerRef.current) {
      markerRef.current.remove();
    }

    // Create marker element
    const markerElement = document.createElement('div');
    markerElement.className = 'vehicle-marker';
    markerElement.textContent = getVehicleEmoji(vehicleType);

    // Create and add the new marker
    const newMarker = new mapboxgl.Marker({
      element: markerElement,
      anchor: 'center',
    })
      .setLngLat(coordinates)
      .addTo(mapRef.current);

    // Apply rotation if needed
    if (bearingValue !== 0) {
      markerElement.style.transform = `rotate(${bearingValue}deg)`;
    }

    return newMarker;
  }, [vehicleType]);

  // Update marker when vehicle type changes
  useEffect(() => {
    if (mapRef.current && mapRef.current.isStyleLoaded() && selectedCountries.length > 0) {
      const firstCountry = selectedCountries[0];
      const coords: [number, number] = [firstCountry.coordinates.lng, firstCountry.coordinates.lat];
      markerRef.current = updateMarker(coords);
    }
  }, [vehicleType, selectedCountries, updateMarker]);

  // Create route line between countries
  const createRouteLine = useCallback((countries: Country[]): RouteGeoJSON | null => {
    if (countries.length < 2) return null;
    
    const coordinates = countries.map(country => [
      country.coordinates.lng,
      country.coordinates.lat
    ]);
    
    return {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates
      }
    };
  }, []);

  // Update route when countries change
  useEffect(() => {
    if (!mapRef.current || !mapRef.current.isStyleLoaded() || selectedCountries.length < 2) return;

    // Create route line
    const routeData = createRouteLine(selectedCountries);
    if (!routeData) return;
    
    // Save route for animation
    setRoute(routeData);
    routeRef.current = routeData;
    
    // Update map route
    if (mapRef.current.getSource('route')) {
      (mapRef.current.getSource('route') as mapboxgl.GeoJSONSource).setData(routeData as GeoJSON.Feature);
    }

    // Position marker at first country
    const firstCountry = selectedCountries[0];
    const startCoords: [number, number] = [
      firstCountry.coordinates.lng,
      firstCountry.coordinates.lat
    ];
    
    markerRef.current = updateMarker(startCoords);

    // Fit map to show the entire route
    const bounds = new mapboxgl.LngLatBounds();
    selectedCountries.forEach((country) => {
      bounds.extend([country.coordinates.lng, country.coordinates.lat]);
    });

    mapRef.current.fitBounds(bounds, { padding: 100 });
  }, [selectedCountries, updateMarker, createRouteLine]);

  // Main animation function
  const startAnimation = useCallback(() => {
    console.log("Starting animation...");
    if (!mapRef.current || selectedCountries.length < 2) {
      console.log("Can't start animation: missing map or countries");
      return;
    }
    
    // Ensure we have a valid route to animate along
    const routeData = routeRef.current || route;
    if (!routeData) {
      console.log("No route data available");
      return;
    }

    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // Get coordinates for route
    const coordinates: [number, number][] = selectedCountries.map(country => [
      country.coordinates.lng, 
      country.coordinates.lat
    ]);
    
    // Create a turf linestring for calculations
    const routeLine = turf.lineString(coordinates);
    const routeLength = turf.length(routeLine, { units: 'kilometers' });
    
    // Place marker at the start position
    const startPosition = coordinates[0];
    markerRef.current = updateMarker(startPosition);
    
    // Animation variables
    let startTime: number | null = null;
    const animationDuration = 10000 / animationSpeed;
    
    // Animation frame function
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      
      // Calculate progress (0-1)
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      try {
        // Calculate current position along the route
        const alongPoint = turf.along(routeLine, routeLength * progress, { units: 'kilometers' });
        const currentCoord = alongPoint.geometry.coordinates as [number, number];
        
        // Calculate bearing for rotation
        let bearing = 0;
        if (vehicleType === 'airplane' && progress < 0.99) {
          const nextPoint = turf.along(routeLine, routeLength * Math.min(progress + 0.01, 1), { units: 'kilometers' });
          bearing = turf.bearing(
            turf.point(currentCoord),
            turf.point(nextPoint.geometry.coordinates)
          );
        }
        
        // Update marker position and rotation
        markerRef.current = updateMarker(currentCoord, bearing);
        
        // Move camera to follow marker
        if (mapRef.current) {
          mapRef.current.panTo(currentCoord, { duration: 0 });
        }
        
        // Continue or restart animation
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else if (isAnimating) {
          // Loop the animation
          startTime = null;
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Animation complete
          console.log("Animation complete");
        }
      } catch (error) {
        console.error("Animation error:", error);
        // Try to continue
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
  }, [animationSpeed, isAnimating, route, selectedCountries, updateMarker, vehicleType]);

  // Reset animation state and position
  const resetAnimation = useCallback(() => {
    console.log("Resetting animation");
    
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // Reset marker to first country
    if (selectedCountries.length > 0) {
      const firstCountry = selectedCountries[0];
      const startCoords: [number, number] = [
        firstCountry.coordinates.lng,
        firstCountry.coordinates.lat
      ];
      markerRef.current = updateMarker(startCoords);
      
      // Center map on first country
      if (mapRef.current) {
        mapRef.current.flyTo({
          center: startCoords,
          zoom: 4,
          duration: 1000
        });
      }
    }
    
    // Fit bounds to show all countries if more than one
    if (mapRef.current && selectedCountries.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      selectedCountries.forEach((country) => {
        bounds.extend([country.coordinates.lng, country.coordinates.lat]);
      });
      
      mapRef.current.fitBounds(bounds, { 
        padding: 100,
        duration: 1000
      });
    }
  }, [selectedCountries, updateMarker]);

  // Handle animation state changes
  useEffect(() => {
    console.log("Animation state changed:", isAnimating, hasStartedAnimation);
    
    if (isAnimating && !hasStartedAnimation && selectedCountries.length >= 2) {
      // Start animation when play button is pressed
      console.log("Starting animation from play button");
      setHasStartedAnimation(true);
      startAnimation();
    } else if (!isAnimating && hasStartedAnimation) {
      // Stop animation when pause button is pressed
      console.log("Stopping animation");
      setHasStartedAnimation(false);
      
      // Cancel animation frame
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isAnimating, hasStartedAnimation, selectedCountries, startAnimation]);

  // Add listener for explicit reset requests
  useEffect(() => {
    if (!isAnimating && !hasStartedAnimation && selectedCountries.length >= 2) {
      // This is likely a reset request (animation was stopped and not playing)
      resetAnimation();
    }
  }, [isAnimating, hasStartedAnimation, selectedCountries, resetAnimation]);

  // Handle export request
  useEffect(() => {
    if (isExporting && selectedCountries.length > 1) {
      console.log("Starting export animation");
      
      // Reset any existing animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      
      // Wait for the map to be ready
      setTimeout(() => {
        // Reset marker to first country
        if (selectedCountries.length > 0) {
          const firstCountry = selectedCountries[0];
          const startCoords: [number, number] = [
            firstCountry.coordinates.lng,
            firstCountry.coordinates.lat
          ];
          markerRef.current = updateMarker(startCoords);
        }
        
        startAnimation();
        
        // Give the animation enough time to complete one cycle
        setTimeout(() => {
          onExportComplete();
        }, 5000); // Adjust based on expected animation duration
      }, 100);
    }
  }, [isExporting, selectedCountries, onExportComplete, startAnimation, updateMarker]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};

export default MapContainer; 