'use client'

import { cn } from '@/lib/utils'
import { getCookie, setCookie } from '@/lib/utils/cookies'
import { Globe } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ai-guide/ui/button'

export function SearchModeToggle() {
  const [isSearchMode, setIsSearchMode] = useState(true)

  useEffect(() => {
    const savedMode = getCookie('search-mode')
    if (savedMode !== null) {
      setIsSearchMode(savedMode === 'true')
    }
  }, [])

  const handleSearchModeChange = () => {
    const newState = !isSearchMode
    setIsSearchMode(newState)
    setCookie('search-mode', newState.toString())
  }

  return (
    <Button
      aria-label="Toggle search mode"
      onClick={handleSearchModeChange}
      variant={isSearchMode ? "default" : "outline"}
      size="sm"
      className={cn(
        'gap-2 rounded-full',
        isSearchMode 
          ? 'bg-blue-500 text-white border-blue-600 hover:bg-blue-600' 
          : 'bg-background hover:bg-accent hover:text-accent-foreground'
      )}
    >
      <Globe className="h-4 w-4" />
      <span>Search</span>
    </Button>
  )
}
