"use client";

import React from "react";
import { FileVideo } from "lucide-react";
import { Country } from "@/types/map-types";

interface VideoExporterProps {
  selectedCountries: Country[];
  onExport: () => void;
  isExporting: boolean;
}

const VideoExporter = ({
  selectedCountries,
  onExport,
  isExporting,
}: VideoExporterProps) => {
  const isDisabled = selectedCountries.length < 2;

  const handleExport = () => {
    if (!isDisabled) {
      onExport();
    }
  };

  return (
    <div className="flex flex-col p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Export Video</h2>
      <div className="flex justify-center">
        <button
          onClick={handleExport}
          disabled={isDisabled}
          className={`flex items-center justify-center gap-2 py-3 px-8 rounded-md font-medium ${
            isDisabled
              ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          <FileVideo className="w-5 h-5" />
          <span>Generate Video</span>
        </button>
      </div>
    </div>
  );
};

export default VideoExporter;