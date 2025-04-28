import { NavbarDemo } from '@/components/navbar'; 
import { GlobeDemo } from '@/components/globedemo'; 
import { Features } from '@/components/landing/features';
import { AnimatedModalDemo } from '@/components/modal';
import { PageContainer } from '@/components/page-container';
import { InfiniteSliderDemo } from '@/components/slider';
import { LinkPreview } from '@/components/ui/link-preview';
import { Heart } from 'lucide-react';

export default function Home() {
  return (
    <PageContainer>
      <NavbarDemo />
      <GlobeDemo />
      <div className="w-full -mt-4 mb-10">
        <AnimatedModalDemo />
      </div>
      <Features />
      <InfiniteSliderDemo />
      <footer className="w-full py-8 flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Brought to you with</span>
          <Heart className="h-4 w-4 text-red-500 animate-pulse" />
          <span>by</span>
          <LinkPreview 
            url="https://github.com/azekowka" 
            width={300}
            height={200}
            className="text-foreground hover:text-primary transition-colors"
          >
            Azekowka
          </LinkPreview>
        </div>
      </footer>
    </PageContainer>
  );
}