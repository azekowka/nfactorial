import { NavbarDemo } from '@/components/navbar'; 
import { GlobeDemo } from '@/components/globedemo'; 
import { Features } from '@/components/landing/features';
import { PageContainer } from '@/components/page-container';

export default function Home() {
  return (
    <PageContainer>
      <NavbarDemo />
      <GlobeDemo />
      <Features />
    </PageContainer>
  );
}