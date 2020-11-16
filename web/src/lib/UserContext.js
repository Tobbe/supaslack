import { createContext, useContext, useEffect, useState } from 'react'
import { navigate, routes } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState()
  const { logIn, signUp, logOut, client: supabase, userMetadata } = useAuth()

  const handleLogin = async (type, email, password) => {
    try {
      type === 'LOGIN'
        ? await logIn({ email, password })
        : await signUp({ email, password })
    } catch (error) {
      console.log('error', error)
      alert(error.error_description || error)
    }
  }

  useEffect(() => {
    if (!userMetadata?.email || !userMetadata?.id) {
      return
    }

    const { id, email } = userMetadata

    ;(async function () {
      try {
        const { body } = await supabase
          .from('users')
          .match({ username: email })
          .select('id, username')

        const existing = body[0]

        const { body: user } = existing?.id
          ? await supabase
              .from('users')
              .update({ status: 'ONLINE' })
              .match({ id })
              .single()
          : await supabase
              .from('users')
              .insert([{ id, username: email, status: 'ONLINE' }])
              .single()

        setUser(user.id)
        const redirectTo = new URLSearchParams(window.location.search).get(
          'redirectTo'
        )

        if (redirectTo) {
          navigate(redirectTo)
        } else {
          navigate(routes.channel({ id: 1 }))
        }
      } catch (error) {
        console.log('error', error)
      }
    })()
  }, [userMetadata])

  const signOut = async () => {
    await supabase
      .from('users')
      .update({ status: 'OFFLINE' })
      .match({ id: user })
      .single()
    setUser(null)
    logOut()
    navigate(routes.home())
  }

  return (
    <UserContext.Provider value={{ handleLogin, signOut, user }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  return useContext(UserContext)
}
