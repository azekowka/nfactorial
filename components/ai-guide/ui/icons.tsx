'use client'

import { cn } from '@/lib/utils'

function IconLogo({ className, ...props }: React.ComponentProps<'img'>) {
  return (
    <img
      src="https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/1f5fa-fe0f.svg"
      alt="Map icon"
      className={cn('h-4 w-4', className)}
      {...props}
    />
  )
}

export { IconLogo }
