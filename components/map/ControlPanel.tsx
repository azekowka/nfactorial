"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Square, FileVideo } from "lucide-react";
import { Country } from "@/types/map-types";
import * as turf from '@turf/turf';
import VideoExporter from "./VideoExporter";

interface ControlPanelProps {
  selectedCountries: Country[];
  isAnimating: boolean;
  animationSpeed: number;
  onStartAnimation: () => void;
  onStopAnimation: () => void;
  onSpeedChange: (speed: number) => void;
  onExport: () => void;
  isExporting: boolean;
}

const ControlPanel = ({
  selectedCountries,
  isAnimating,
  animationSpeed,
  onStartAnimation,
  onStopAnimation,
  onSpeedChange,
  onExport,
  isExporting,
}: ControlPanelProps) => {
  const isDisabled = selectedCountries.length < 2;
  const [totalDistance, setTotalDistance] = useState<number>(0);

  // Calculate the total distance between selected countries
  useEffect(() => {
    if (selectedCountries.length < 2) {
      setTotalDistance(0);
      return;
    }

    try {
      // Create coordinates array for the route
      const coordinates = selectedCountries.map(country => [
        country.coordinates.lng,
        country.coordinates.lat
      ]);
      
      // Create a turf linestring for distance calculation
      const routeLine = turf.lineString(coordinates);
      const distance = turf.length(routeLine, { units: 'kilometers' });
      
      // Round to the nearest whole number
      setTotalDistance(Math.round(distance));
    } catch (error) {
      console.error("Error calculating distance:", error);
      setTotalDistance(0);
    }
  }, [selectedCountries]);

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseFloat(e.target.value);
    onSpeedChange(newSpeed);
  };

  // Format the distance with commas for thousands
  const formatDistance = (distance: number): string => {
    return distance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Animation Controls</h2>

        {isDisabled && (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-2 rounded-md mb-4 text-sm">
            Select at least two countries to create an animation
          </div>
        )}

        <div className="flex items-center justify-center gap-4 mb-4">
          <VideoExporter
            selectedCountries={selectedCountries}
            onExport={onExport}
            isExporting={isExporting}
          />
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="speed-control" className="text-sm font-medium">
              Animation Speed
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {animationSpeed.toFixed(1)}x
            </span>
          </div>
          <input
            id="speed-control"
            type="range"
            min="0.5"
            max="3"
            step="0.5"
            value={animationSpeed}
            onChange={handleSpeedChange}
            disabled={isDisabled}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-medium text-sm mb-1">Trip Stats</h3>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Countries:</span>
            <span className="text-sm font-medium">{selectedCountries.length}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Distance:</span>
            <span className="text-sm font-medium">
              {totalDistance > 0 
                ? `${formatDistance(totalDistance)} km` 
                : "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;