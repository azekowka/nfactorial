"use client";

import React, { useState, useEffect, useCallback } from "react";
import MapContainer from "./map/MapContainer";
import CountrySelector from "./map/CountrySelector";
import ControlPanel from "./map/ControlPanel";
import VideoExporter from "./map/VideoExporter";
import { Country, VehicleType } from "@/types/map-types";
import VehicleSelector from "./map/VehicleSelector";

const TravelMapStudio = () => {
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [vehicleType, setVehicleType] = useState<VehicleType>("airplane");

  // Make sure animation stops when no countries are selected
  useEffect(() => {
    if (selectedCountries.length < 2 && isAnimating) {
      setIsAnimating(false);
    }
  }, [selectedCountries, isAnimating]);

  // Stop normal animation when exporting
  useEffect(() => {
    if (isExporting && isAnimating) {
      setIsAnimating(false);
    }
  }, [isExporting, isAnimating]);

  const handleCountrySelect = (country: Country) => {
    // Add country if not already selected
    if (!selectedCountries.find(c => c.code === country.code)) {
      setSelectedCountries(prev => [...prev, country]);
    }
  };

  const handleCountryRemove = (countryCode: string) => {
    setSelectedCountries(prev => 
      prev.filter(country => country.code !== countryCode)
    );
  };

  const handleReorderCountries = (reorderedCountries: Country[]) => {
    setSelectedCountries(reorderedCountries);
  };

  const handleStartAnimation = useCallback(() => {
    // Only allow starting animation if not exporting and we have countries
    if (selectedCountries.length > 1 && !isExporting) {
      console.log("Starting animation from main component");
      setIsAnimating(true);
    } else {
      console.log("Cannot start animation: ", { 
        countries: selectedCountries.length, 
        isExporting 
      });
    }
  }, [selectedCountries.length, isExporting]);

  const handleStopAnimation = useCallback(() => {
    console.log("Stopping animation");
    setIsAnimating(false);
  }, []);

  const handleSpeedChange = (speed: number) => {
    setAnimationSpeed(speed);
  };

  const handleExport = () => {
    console.log("Starting export process");
    // Stop regular animation and start export animation
    if (isAnimating) {
      setIsAnimating(false);
    }
    setIsExporting(true);
  };

  const handleExportComplete = () => {
    console.log("Export process complete");
    setIsExporting(false);
  };

  const handleVehicleChange = (vehicle: VehicleType) => {
    setVehicleType(vehicle);
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-full gap-4 p-4">
      <div className="w-full md:w-3/4 h-[500px] md:h-[700px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
        <MapContainer 
          selectedCountries={selectedCountries} 
          isAnimating={isAnimating}
          animationSpeed={animationSpeed}
          isExporting={isExporting}
          onExportComplete={handleExportComplete}
          vehicleType={vehicleType}
        />
      </div>
      
      <div className="w-full md:w-1/4 flex flex-col gap-4">
        <CountrySelector 
          selectedCountries={selectedCountries}
          onSelectCountry={handleCountrySelect}
          onRemoveCountry={handleCountryRemove}
          onReorderCountries={handleReorderCountries}
        />
        
        <VehicleSelector
          vehicleType={vehicleType}
          onVehicleChange={handleVehicleChange}
        />
        
        <ControlPanel 
          selectedCountries={selectedCountries}
          isAnimating={isAnimating}
          animationSpeed={animationSpeed}
          onStartAnimation={handleStartAnimation}
          onStopAnimation={handleStopAnimation}
          onSpeedChange={handleSpeedChange}
        />
        
        <VideoExporter 
          selectedCountries={selectedCountries}
          onExport={handleExport}
          isExporting={isExporting}
        />
      </div>
    </div>
  );
};

export default TravelMapStudio; 