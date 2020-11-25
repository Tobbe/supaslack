import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

/**
 * @param {number} channelId the currently selected Channel
 */
export const useStore = ({ channelId }) => {
  const [channels, setChannels] = useState([])
  const [messages, setMessages] = useState([])
  const [users] = useState(new Map())
  const [newMessage, handleNewMessage] = useState(null)
  const [newChannel, handleNewChannel] = useState(null)
  const [newOrUpdatedUser, handleNewOrUpdatedUser] = useState(null)

  // Load initial data and set up listeners
  useEffect(() => {
    // Get Channels
    fetchChannels(setChannels)
    // Listen for new messages
    const messageListener = supabase
      .from('messages')
      .on('INSERT', (payload) => handleNewMessage(payload.new))
      .subscribe()
    // Listen for changes to our users
    const userListener = supabase
      .from('users')
      .on('*', (payload) => handleNewOrUpdatedUser(payload.new))
      .subscribe()
    // Listen for new channels
    const channelListener = supabase
      .from('channels')
      .on('INSERT', (payload) => handleNewChannel(payload.new))
      .subscribe()
    // Cleanup on unmount
    return () => {
      messageListener.unsubscribe()
      userListener.unsubscribe()
      channelListener.unsubscribe()
    }
  }, [])

  // Update when the route changes
  useEffect(() => {
    if (channelId && channelId > 0) {
      fetchMessages(channelId, (messages) => {
        messages.forEach((x) => users.set(x.user_id, x.author))
        setMessages(messages)
      })
    }
  }, [channelId])

  // New message recieved from Postgres
  useEffect(() => {
    if (newMessage && newMessage.channel_id === Number(channelId)) {
      const handleAsync = async () => {
        const authorId = newMessage.user_id

        if (!users.get(authorId)) {
          await fetchUser(authorId, (user) => handleNewOrUpdatedUser(user))
        }

        setMessages(messages.concat(newMessage))
      }

      handleAsync()
    }
  }, [newMessage])

  // New channel recieved from Postgres
  useEffect(() => {
    if (newChannel) {
      setChannels(channels.concat(newChannel))
    }
  }, [newChannel])

  // New or updated user recieved from Postgres
  useEffect(() => {
    if (newOrUpdatedUser) {
      users.set(newOrUpdatedUser.id, newOrUpdatedUser)
    }
  }, [newOrUpdatedUser])

  return {
    // We can export computed values here to map the authors to each message
    messages: messages.map((x) => ({ ...x, author: users.get(x.user_id) })),
    channels: channels.sort((a, b) => a.slug.localeCompare(b.slug)),
    users,
  }
}

/**
 * Fetch all channels
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchChannels = async (setState) => {
  try {
    const { body } = await supabase.from('channels').select('*')

    if (setState) {
      setState(body)
    }

    return body
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Fetch a single user
 * @param {number} userId
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchUser = async (userId, setState) => {
  try {
    const { body } = await supabase.from('users').eq('id', userId).select(`*`)
    const user = body[0]

    if (setState) {
      setState(user)
    }

    return user
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Fetch all messages and their authors
 * @param {number} channelId
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchMessages = async (channelId, setState) => {
  try {
    const { body } = await supabase
      .from('messages')
      .eq('channel_id', channelId)
      .select(`*, author:user_id(*)`)
      .order('inserted_at', true)

    if (setState) {
      setState(body)
    }

    return body
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Insert a new channel into the DB
 * @param {string} slug The channel name
 */
export const addChannel = async (slug) => {
  try {
    const { body } = await supabase.from('channels').insert([{ slug }])
    return body
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Insert a new message into the DB
 * @param {string} message The message text
 * @param {number} channel_id
 * @param {number} user_id The author
 */
export const addMessage = async (message, channel_id, user_id) => {
  try {
    const { body } = await supabase
      .from('messages')
      .insert([{ message, channel_id, user_id }])
    return body
  } catch (error) {
    console.log('error', error)
  }
}
