import { NavbarDemo } from '@/components/navbar'; 
import { GlobeDemo } from '@/components/globedemo'; 
import { Features } from '@/components/landing/features';
import { AnimatedModalDemo } from '@/components/modal';
import { PageContainer } from '@/components/page-container';

export default function Home() {
  return (
    <PageContainer>
      <NavbarDemo />
      <GlobeDemo />
      <div className="w-full -mt-4 mb-4">
        <AnimatedModalDemo />
      </div>
      <Features />
    </PageContainer>
  );
}