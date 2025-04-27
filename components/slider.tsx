import { InfiniteSlider } from '@/components/core/infinite-slider';

export function InfiniteSliderDemo() {
  return (
    <div className="relative z-20 py-0 lg:py-10 max-w-7xl mx-auto w-full">
      <div className="px-8">
        <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
            Built using
        </h4>
        <p className="text-sm lg:text-base  max-w-2xl  my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
            The best of the full stack TypeScript ecosystem
        </p>
        </div>

        <div className="relative mt-8">
            <InfiniteSlider gap={24} reverse>
            <img
                src='/images/nextdark.svg'
                alt='Next logo'
                className='h-[60px] w-auto'
            />
            <img
                src='images/tailwindcss-dark.svg'
                alt='TailwindCSS logo'
                className='h-[60px] w-auto'
            />
            <img
                src='/images/upstash.svg'
                alt='Upstash logo'
                className='h-[60px] w-auto'
            />
            <img
                src='/images/gemini.svg'
                alt='Gemini logo'
                className='h-[60px] w-auto'
            />
            <img
                src='/images/groq.svg'
                alt='Groq logo'
                className='h-[60px] w-auto'
            />
            <img
                src='/images/tavily-dark.svg'
                alt='Tavily logo'
                className='h-[60px] w-auto'
            />
            <img
                src='/images/svgl.svg'
                alt='Svgl logo'
                className='h-[60px] w-auto'
            />
            <img
                src='/images/vercel-dark.svg'
                alt='Vercel logo'
                className='h-[60px] w-auto'
            />
            <img
                src='/images/redis.svg'
                alt='Redis logo'
                className='h-[60px] w-auto'
            />
            <img
                src='images/clerk-dark.svg'
                alt='Clerk logo'
                className='h-[60px] w-auto'
            />
            <img
                src='/images/radix.svg'
                alt='Radix logo'
                className='h-[60px] w-auto'
            />
            <img
                src='/images/mapbox.svg'
                alt='Mapbox logo'
                className='h-[240px] w-auto'
            />
            <img
                src='/images/shadcn.svg'
                alt='Shadcn logo'
                className='h-[60px] w-auto'
            />
            </InfiniteSlider>
        </div>
    </div>
  );
}
