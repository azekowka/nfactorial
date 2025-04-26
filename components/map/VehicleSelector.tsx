"use client";

import React from "react";
import { VehicleType } from "@/types/map-types";
import { Plane, User, Car } from "lucide-react";

interface VehicleSelectorProps {
  vehicleType: VehicleType;
  onVehicleChange: (vehicle: VehicleType) => void;
}

const VehicleSelector = ({
  vehicleType,
  onVehicleChange,
}: VehicleSelectorProps) => {
  // Vehicle options with their icons
  const vehicleOptions: Array<{
    type: VehicleType;
    label: string;
    icon: React.ReactNode;
  }> = [
    {
      type: "airplane",
      label: "Airplane",
      icon: <Plane className="h-6 w-6" strokeWidth={1.5} />,
    },
    {
      type: "person",
      label: "Person",
      icon: <User className="h-6 w-6" strokeWidth={1.5} />,
    },
    {
      type: "car",
      label: "Car",
      icon: <Car className="h-6 w-6" strokeWidth={1.5} />,
    },
  ];

  return (
    <div className="flex flex-col p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Transport Type</h2>
      
      <div className="grid grid-cols-3 gap-2">
        {vehicleOptions.map((vehicle) => (
          <button
            key={vehicle.type}
            onClick={() => onVehicleChange(vehicle.type)}
            className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
              vehicleType === vehicle.type
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            aria-label={`Select ${vehicle.label}`}
          >
            <div className="mb-2 text-center">
              {vehicle.icon}
            </div>
            <span className="text-sm">{vehicle.label}</span>
          </button>
        ))}
      </div>
      
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">
        Choose a transport type for your journey animation
      </p>
    </div>
  );
};

export default VehicleSelector; 