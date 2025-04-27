import { Button } from '@/components/ai-guide/ui/button'
import { ArrowRight } from 'lucide-react'

const exampleMessages = [
  {
    heading: 'Provide me a top 5 list of the most fascinating places to visit in the Shenzhen',
    message: 'Provide me a top 5 list of the most fascinating places to visit in the Shenzhen'
  },
  {
    heading: 'Plan a 3 day solo trip to Barcelona',
    message: 'Plan a 3 day solo trip to Barcelona'
  },
  {
    heading: 'Paris vs London: Which city to visit?',
    message: 'Paris vs London: Which city to visit?'
  },
  {
    heading: 'Summary: https://www.lonelyplanet.com/best-in-travel',
    message: 'Summary: https://www.lonelyplanet.com/best-in-travel'
  }
]
export function EmptyScreen({
  submitMessage,
  className
}: {
  submitMessage: (message: string) => void
  className?: string
}) {
  return (
    <div className={`mx-auto w-full transition-all ${className}`}>
      <div className="bg-background p-2">
        <div className="mt-2 flex flex-col items-start space-y-2 mb-4">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              name={message.message}
              onClick={async () => {
                submitMessage(message.message)
              }}
            >
              <ArrowRight size={16} className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
