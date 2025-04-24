import { Features } from '@/components/landing/features';
import { Header } from '@/components/landing/header';
import { GlobeDemo } from '@/components/ui/globedemo';

export default function Home() {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <GlobeDemo />
        <Features />
      </div>
    );
  }