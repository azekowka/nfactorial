import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  IconSeparator
} from '@/components/ui/icons'
import { ThemeToggle } from '@/./components/theme-toggle'


export function Header() {
    return (
      <header
        className="sticky top-0 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl"
        style={{ zIndex: 100 }} 
      >
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </header>
    )
  }
  