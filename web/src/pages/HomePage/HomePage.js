import { useState } from 'react'
import { useAuth } from '@redwoodjs/auth'
import { navigate, routes, useLocation } from '@redwoodjs/router'

const HomePage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { logIn, signUp } = useAuth()
  const { search } = useLocation()

  const handleLogin = async (type, email, password) => {
    try {
      console.log(`${type} as ${email}:${password}`)
      type === 'LOGIN'
        ? await logIn({ email, password })
        : await signUp({ email, password })
      console.log(`${email} is logged in`)

      const redirectTo = new URLSearchParams(search).get('redirectTo')

      if (redirectTo) {
        navigate(redirectTo)
      } else {
        navigate(routes.channel({ id: 1 }))
      }
    } catch (error) {
      console.log('error', error)
      alert(error.error_description || error)
    }
  }

  return (
    <div className="w-full h-full flex justify-center items-center p-4 bg-gray-300">
      <div className="w-full sm:w-1/2 xl:w-1/3">
        <div className="border-teal p-8 border-t-12 bg-white mb-6 rounded-lg shadow-lg bg-white">
          <div className="mb-4">
            <label className="font-bold text-grey-darker block mb-2">
              Email
            </label>
            <input
              type="text"
              className="block appearance-none w-full bg-white border border-grey-light hover:border-grey px-2 py-2 rounded shadow"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="font-bold text-grey-darker block mb-2">
              Password
            </label>
            <input
              type="password"
              className="block appearance-none w-full bg-white border border-grey-light hover:border-grey px-2 py-2 rounded shadow"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <a
              onClick={(e) => {
                e.preventDefault()
                handleLogin('SIGNUP', email, password)
              }}
              href={'/channels'}
              className="bg-indigo-700 hover:bg-teal text-white py-2 px-4 rounded text-center transition duration-150 hover:bg-indigo-600 hover:text-white"
            >
              Sign up
            </a>
            <a
              onClick={(e) => {
                e.preventDefault()
                handleLogin('LOGIN', email, password)
              }}
              href={'/channels'}
              className="border border-indigo-700 text-indigo-700 py-2 px-4 rounded w-full text-center transition duration-150 hover:bg-indigo-700 hover:text-white"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
