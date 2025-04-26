"use client";

import React from "react";
import { Play, Pause, RotateCcw, FastForward } from "lucide-react";
import { Country } from "@/types/map-types";

interface ControlPanelProps {
  selectedCountries: Country[];
  isAnimating: boolean;
  animationSpeed: number;
  onStartAnimation: () => void;
  onStopAnimation: () => void;
  onSpeedChange: (speed: number) => void;
}

const ControlPanel = ({
  selectedCountries,
  isAnimating,
  animationSpeed,
  onStartAnimation,
  onStopAnimation,
  onSpeedChange,
}: ControlPanelProps) => {
  const isDisabled = selectedCountries.length < 2;

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseFloat(e.target.value);
    onSpeedChange(newSpeed);
  };

  const handlePlayPause = () => {
    if (isAnimating) {
      onStopAnimation();
    } else {
      onStartAnimation();
    }
  };

  return (
    <div className="flex flex-col p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Animation Controls</h2>

      {isDisabled && (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-2 rounded-md mb-4 text-sm">
          Select at least two countries to create an animation
        </div>
      )}

      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={handlePlayPause}
          disabled={isDisabled}
          className={`p-3 rounded-full ${
            isDisabled
              ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : isAnimating
              ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
              : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
          }`}
        >
          {isAnimating ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button
          onClick={() => onStopAnimation()}
          disabled={isDisabled || !isAnimating}
          className={`p-3 rounded-full ${
            isDisabled || !isAnimating
              ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50"
          }`}
        >
          <RotateCcw size={24} />
        </button>
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
            {selectedCountries.length > 1 ? "Calculating..." : "-"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Duration:</span>
          <span className="text-sm font-medium">
            {selectedCountries.length > 1 ? "10 seconds" : "-"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel; 