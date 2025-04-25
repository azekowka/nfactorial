import { getModels } from '@/lib/config/models'
import { generateId } from 'ai'
import { Chat } from '@/components/ai-guide/chat'
import { Toaster } from '@/components/ai-guide/ui/sonner'
import Layout from '@/components/dashboard/layout'
import HistoryContainer from '@/components/ai-guide/history-container'

export default async function Page() {
  const id = generateId()
  const models = await getModels()
  return (
    <Layout>
      <div className="relative min-h-screen pt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">AI Assistant</h2>
          <HistoryContainer />
        </div>
        <Chat id={id} models={models} />
        <Toaster />
      </div>
    </Layout>
  )
}
