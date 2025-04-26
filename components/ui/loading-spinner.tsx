import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[400px]">
      <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner; 