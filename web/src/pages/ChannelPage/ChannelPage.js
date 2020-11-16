import { useRef, useEffect } from 'react'
import { useAuth } from '@redwoodjs/auth'
import MainLayout from 'src/layouts/MainLayout'
import Message from 'src/components/Message'
import MessageInput from 'src/components/MessageInput'

const addMessage = (text, channelId, user) => {
  console.log(`Send "${text}" from ${user} to ${channelId}`)
}

const ChannelPage = ({ id }) => {
  const {} = useAuth()
  const messagesEndRef = useRef(null)

  // Hardcode for now
  const messages = []
  const channels = [
    {
      id: 1,
      slug: 'public',
    },
  ]

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    })
  }, [messages])

  // Render the channels and messages
  return (
    <MainLayout channels={channels} activeChannelId={id}>
      <div className="relative h-screen">
        <div className="Messages h-full pb-16">
          <div className="p-2 overflow-y-auto">
            {messages.map((x) => (
              <Message key={x.id} message={x} />
            ))}
            <div ref={messagesEndRef} style={{ height: 0 }} />
          </div>
        </div>
        <div className="p-2 absolute bottom-0 left-0 w-full">
          <MessageInput
            onSubmit={async (text) => addMessage(text, channelId, user)}
          />
        </div>
      </div>
    </MainLayout>
  )
}

export default ChannelPage
