"use client";

import { Suspense } from "react";
import Layout from "@/components/dashboard/layout";
import TravelMapStudio from "@/components/TravelMapStudio";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function AnimatePage() {
  return (
    <div data-theme="dark">
      <Layout>
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Interactive Travel Map</h2>
          <div className="h-[700px] w-full">
            <Suspense fallback={<LoadingSpinner />}>
              <TravelMapStudio />
            </Suspense>
          </div>
        </div>
      </Layout>
    </div>
  );
}
