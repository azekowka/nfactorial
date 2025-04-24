import { Features } from '@/components/landing/features';
import { GlobeDemo } from '@/components/ui/globedemo';

export default function Home() {
    return (
      <div className="min-h-screen flex flex-col">
        <GlobeDemo />
        <Features />
      </div>
    );
  }