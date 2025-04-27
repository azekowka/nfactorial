'use client';

import { useRef } from 'react';
import Layout from '@/components/dashboard/layout';
import WorldMap, { WorldMapRef } from '@/components/WorldMap';

export default function WorldMapPage() {
  const mapRef = useRef<WorldMapRef>(null);

  const handleExportSVG = () => {
    if (mapRef.current) {
      mapRef.current.exportAsSVG();
    }
  };

  const handleExportPNG = () => {
    if (mapRef.current) {
      mapRef.current.exportAsPNG();
    }
  };

  return (
    <div data-theme="dark">
      <Layout>
        <div className="flex flex-col min-h-screen p-4 md:p-8">
          <header className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Visited Places</h1>
            <div className="flex gap-2">
              <button 
                onClick={handleExportSVG}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Export SVG
              </button>
              <button 
                onClick={handleExportPNG}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Export PNG
              </button>
            </div>
          </header>
        
          <main className="flex-grow">
            <div className="h-[700px] w-full">
              <WorldMap ref={mapRef} width={1200} height={700} />
            </div>
          </main>
        </div>
      </Layout>
    </div>
  );
}
