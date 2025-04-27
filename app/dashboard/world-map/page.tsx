import Layout from '@/components/dashboard/layout';
import WorldMap from '@/components/WorldMap';

export default function WorldMapPage() {
  return (
    <div data-theme="dark">
      <Layout>
        <div className="flex flex-col min-h-screen p-4 md:p-8">
        <header className="mb-6">
            <h1 className="text-2xl font-bold">Visited Places</h1>
        </header>
        
        <main className="flex-grow">
            {/* Client-side component with a key to ensure it re-renders when the viewport changes */}
            <div className="h-[700px] w-full">
            <WorldMap width={1200} height={700} />
            </div>
        </main>
        </div>
      </Layout>
    </div>
  );
}
