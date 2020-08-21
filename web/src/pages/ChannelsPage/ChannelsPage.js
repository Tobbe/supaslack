import { useContext, useEffect, useRef } from 'react'
import { useLocation } from '@redwoodjs/router'
import SupaSlackLayout from 'src/layouts/SupaSlackLayout'
import Message from 'src/components/Message'
import MessageInput from 'src/components/MessageInput'
import { useStore, addMessage } from 'src/lib/Store'
import UserContext from 'src/lib/UserContext'

const ChannelsPage = ({ id: channelId }) => {
  const { pathname, search, hash } = useLocation()
  const { user, authLoaded, signOut } = useContext(UserContext)
  const messagesEndRef = useRef(null)

  // Redirect if not signed in.
  useEffect(() => {
    if (authLoaded && !user) signOut()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, pathname, search, hash])

  // Else load up the page
  const { messages, channels } = useStore({ channelId })

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    })
  }, [messages])

  // Render the channels and messages
  return (
    <SupaSlackLayout channels={channels} activeChannelId={channelId}>
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
          <MessageInput onSubmit={async (text) => addMessage(text, channelId, user)} />
        </div>
      </div>
    </SupaSlackLayout>
  )
}

export default ChannelsPage
