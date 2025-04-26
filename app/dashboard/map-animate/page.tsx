"use client";

import { Suspense } from "react";
import TravelMapStudio from "@/components/TravelMapStudio";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function AnimatePage() {
  return (
    <div className="flex flex-col w-full h-full min-h-[calc(100vh-4rem)]">
      <Suspense fallback={<LoadingSpinner />}>
        <TravelMapStudio />
      </Suspense>
    </div>
  );
}
