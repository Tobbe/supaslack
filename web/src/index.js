import ReactDOM from 'react-dom'
import { RedwoodProvider, FatalErrorBoundary } from '@redwoodjs/web'
import { navigate, routes } from '@redwoodjs/router'
import FatalErrorPage from 'src/pages/FatalErrorPage'
import UserContext from './lib/UserContext'
import { supabase } from './lib/Store'

import Routes from 'src/Routes'

import './index.css'

class SupabaseSlackClone extends React.Component {
  state = {
    authLoaded: false,
    user: null,
  }

  componentDidMount = () => {
    console.log('didMount')
    const user = localStorage.getItem('supabase-slack-clone')
    if (user) {
      console.log('authLoaded')
      this.setState({ user, authLoaded: true })
    } else {
      console.log('go home')
      // TODO: Is this needed?
      // navigate(routes.home())
    }
  }

  signIn = async (id, username) => {
    try {
      let { body } = await supabase
        .from('users')
        .match({ username })
        .select('id, username')

      const existing = body[0]

      const { body: user } = existing?.id
        ? await supabase
            .from('users')
            .update({ id, username })
            .match({ id })
            .single()
        : await supabase.from('users').insert([{ id, username }]).single()

      localStorage.setItem('supabase-slack-clone', user.id)

      this.setState({ user: user.id }, () => {
        navigate(routes.channels({ id: 1 }))
      })
    } catch (error) {
      console.log('error', error)
    }
  }

  signOut = () => {
    supabase.auth.logout()
    localStorage.removeItem('supabase-slack-clone')
    this.setState({ user: null })
    navigate(routes.home())
  }

  render() {
    console.log('render wrapper class')
    return (
      <UserContext.Provider
        value={{
          authLoaded: this.state.authLoaded,
          user: this.state.user,
          signIn: this.signIn,
          signOut: this.signOut,
        }}
      >
        {this.props.children}
      </UserContext.Provider>
    )
  }
}

ReactDOM.render(
  <FatalErrorBoundary page={FatalErrorPage}>
    <RedwoodProvider>
      <SupabaseSlackClone>
        <Routes />
      </SupabaseSlackClone>
    </RedwoodProvider>
  </FatalErrorBoundary>,
  document.getElementById('redwood-app')
)
