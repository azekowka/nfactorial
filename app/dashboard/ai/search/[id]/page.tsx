import { Chat } from '@/components/ai-guide/chat'
import { getChat } from '@/lib/actions/chat'
import { getModels } from '@/lib/config/models'
import { convertToUIMessages } from '@/lib/utils'
import { notFound, redirect } from 'next/navigation'
import Layout from '@/components/dashboard/layout'
import HistoryContainer from '@/components/ai-guide/history-container'

export const maxDuration = 60

export async function generateMetadata(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const chat = await getChat(id, 'anonymous')
  return {
    title: chat?.title.toString().slice(0, 50) || 'Search'
  }
}

export default async function SearchPage(props: {
  params: Promise<{ id: string }>
}) {
  const userId = 'anonymous'
  const { id } = await props.params

  const chat = await getChat(id, userId)
  // convertToUIMessages for useChat hook
  const messages = convertToUIMessages(chat?.messages || [])

  if (!chat) {
    redirect('/')
  }

  if (chat?.userId !== userId) {
    notFound()
  }

  const models = await getModels()
  return (
    <Layout>
      <div className="relative min-h-screen pt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {chat?.title?.toString().slice(0, 50) || 'Search Results'}
          </h2>
          <HistoryContainer />
        </div>
        <Chat id={id} savedMessages={messages} models={models} />
      </div>
    </Layout>
  )
}
