"use client";

import React from "react";
import { VehicleType } from "@/types/map-types";

interface VehicleSelectorProps {
  vehicleType: VehicleType;
  onVehicleChange: (vehicle: VehicleType) => void;
}

const VehicleSelector = ({ vehicleType, onVehicleChange }: VehicleSelectorProps) => {
  const vehicles = [
    { type: "airplane", emoji: "✈️", label: "Airplane" },
    { type: "person", emoji: "🚶", label: "Person" },
    { type: "car", emoji: "🚗", label: "Car" }
  ] as const;

  return (
    <div className="flex flex-col p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Transport Type</h2>
      
      <div className="grid grid-cols-3 gap-2">
        {vehicles.map((vehicle) => (
          <button
            key={vehicle.type}
            onClick={() => onVehicleChange(vehicle.type)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
              vehicleType === vehicle.type
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-2 border-blue-400 dark:border-blue-600"
                : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-2 border-transparent"
            }`}
          >
            <span className="text-3xl mb-1">{vehicle.emoji}</span>
            <span className="text-sm font-medium">{vehicle.label}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Choose a transport type for your journey animation
        </p>
      </div>
    </div>
  );
};

export default VehicleSelector; 