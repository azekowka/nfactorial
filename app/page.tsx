import { Features } from '@/components/landing/features';
import { GlobeDemo } from '@/components/globedemo';
import { NavbarDemo } from '@/components/navbar';  

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarDemo />
      <GlobeDemo />
      <Features />
    </div>
  );
}