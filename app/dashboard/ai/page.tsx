import { getModels } from '@/lib/config/models'
import { generateId } from 'ai'
import { Chat } from '@/components/ai-guide/chat'
import { Header } from '@/components/ai-guide/header'
import { Toaster } from '@/components/ai-guide/ui/sonner'

export default async function Page() {
  const id = generateId()
  const models = await getModels()
  return (
    <>
      <Header />
      <Chat id={id} models={models} />
      <Toaster />
    </>
  )
}
