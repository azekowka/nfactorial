'use client'

import { Button } from '@/components/ai-guide/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ai-guide/ui/sheet'
import { History as HistoryIcon, Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Suspense, useTransition } from 'react'
import { HistorySkeleton } from './history-skeleton'
import { useState } from 'react'

type HistoryProps = {
  children?: React.ReactNode
}

export function History({ children }: HistoryProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)

  const onOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      startTransition(() => {
        router.refresh()
      })
    }
  }

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => setIsOpen(true)}
      >
        <Menu />
      </Button>
      
      {isOpen && (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
          <SheetContent className="w-64 rounded-tl-xl rounded-bl-xl">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-1 text-sm font-normal mb-2">
                <HistoryIcon size={14} />
                History
              </SheetTitle>
            </SheetHeader>
            <div className="my-2 h-full pb-12 md:pb-10">
              <Suspense fallback={<HistorySkeleton />}>{children}</Suspense>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
