import { Chat } from '@/components/ai-guide/chat'
import { getSharedChat } from '@/lib/actions/chat'
import { getModels } from '@/lib/config/models'
import { convertToUIMessages } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Layout from '@/components/dashboard/layout'
import HistoryContainer from '@/components/ai-guide/history-container'

export async function generateMetadata(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const chat = await getSharedChat(id)

  if (!chat || !chat.sharePath) {
    return notFound()
  }

  return {
    title: chat?.title.toString().slice(0, 50) || 'Search'
  }
}

export default async function SharePage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const chat = await getSharedChat(id)

  if (!chat || !chat.sharePath) {
    return notFound()
  }

  const models = await getModels()
  return (
    <Layout>
      <div className="relative min-h-screen pt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {chat?.title?.toString().slice(0, 50) || 'Shared Chat'}
          </h2>
          <HistoryContainer />
        </div>
        <Chat
          id={chat.id}
          savedMessages={convertToUIMessages(chat.messages)}
          models={models}
        />
      </div>
    </Layout>
  )
}
