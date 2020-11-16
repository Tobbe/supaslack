import { useRef, useEffect } from 'react'
import MainLayout from 'src/layouts/MainLayout'
import Message from 'src/components/Message'
import MessageInput from 'src/components/MessageInput'
import { useStore, addMessage } from 'src/lib/Store'
import { useUser } from 'src/lib/UserContext'

const ChannelPage = ({ id }) => {
  const { user } = useUser()
  const messagesEndRef = useRef(null)

  const { messages, channels } = useStore({ channelId: id })

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
            onSubmit={(text) => {
              console.log(`${user} wants to add ${text} to channel ${id}`)
              addMessage(text, id, user)
            }}
          />
        </div>
      </div>
    </MainLayout>
  )
}

export default ChannelPage
