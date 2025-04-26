"use client";

import React, { useState } from "react";
import { Download, Film, FileVideo } from "lucide-react";
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
  const [videoFormat, setVideoFormat] = useState<"mp4" | "gif" | "webm">("mp4");
  const [videoQuality, setVideoQuality] = useState<"low" | "medium" | "high">("high");
  
  const isDisabled = selectedCountries.length < 2 || isExporting;

  const handleExport = () => {
    if (!isDisabled) {
      onExport();
    }
  };

  const downloadVideo = () => {
    // In a real implementation, this would download the actual video
    // For this demo, we'll simulate a download
    const dummyLink = document.createElement("a");
    dummyLink.download = `travel-animation.${videoFormat}`;
    dummyLink.href = "#";
    dummyLink.click();
  };

  return (
    <div className="flex flex-col p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Export Video</h2>

      {isDisabled && !isExporting && (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-2 rounded-md mb-4 text-sm">
          Select at least two countries to create a video
        </div>
      )}

      {isExporting && (
        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 p-2 rounded-md mb-4 text-sm flex items-center">
          <div className="w-4 h-4 mr-2 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
          Exporting your video...
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Format</label>
        <div className="flex gap-2">
          {(["mp4", "gif", "webm"] as const).map((format) => (
            <button
              key={format}
              onClick={() => setVideoFormat(format)}
              disabled={isExporting}
              className={`flex-1 p-2 rounded-md text-sm ${
                videoFormat === format
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
              } ${isExporting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {format.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Quality</label>
        <div className="flex gap-2">
          {(["low", "medium", "high"] as const).map((quality) => (
            <button
              key={quality}
              onClick={() => setVideoQuality(quality)}
              disabled={isExporting}
              className={`flex-1 p-2 rounded-md text-sm ${
                videoQuality === quality
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
              } ${isExporting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {quality.charAt(0).toUpperCase() + quality.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleExport}
          disabled={isDisabled}
          className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-md ${
            isDisabled
              ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          <Film size={18} />
          <span>Generate Video</span>
        </button>

        <button
          onClick={downloadVideo}
          disabled={!isExporting}
          className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-md ${
            !isExporting
              ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          <Download size={18} />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};

export default VideoExporter; 