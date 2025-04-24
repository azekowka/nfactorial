'use client';

import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("min-h-screen flex flex-col dark:bg-black bg-white", className)}>
      {children}
    </div>
  );
} 