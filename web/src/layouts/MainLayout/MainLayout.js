import { Link, routes } from '@redwoodjs/router'

const MainLayout = ({ channels, activeChannelId, children }) => {
  const logOut = () => {
    console.log('logOut')
  }

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text
  }

  const newChannel = async () => {
    const slug = prompt('Please enter your name')
    if (slug) {
      console.log('newChannel', slugify(slug))
    }
  }

  return (
    <main className="main flex h-screen w-screen absolute overflow-hidden">
      {/* Sidebar */}
      <nav
        className="w-64 bg-gray-900 text-gray-100 h-screen"
        style={{ maxWidth: '20%', minWidth: 150 }}
      >
        <div className="p-2">
          <h4 className="font-bold">Channels</h4>
          <ul className="channel-list">
            {channels.map((channel) => (
              <li key={channel.id}>
                <Link
                  className={channel.id === activeChannelId ? 'font-bold' : ''}
                  to={routes.channel({ id: channel.id })}
                >
                  {channel.slug}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <hr className="m-2" />
        <div className="p-2">
          <button
            className="bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded w-full transition duration-150"
            onClick={() => newChannel()}
          >
            New Channel
          </button>
        </div>
        <hr className="m-2" />
        <div className="p-2">
          <button
            className="bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded w-full transition duration-150"
            onClick={() => logOut()}
          >
            Log out
          </button>
        </div>
      </nav>

      {/* Messages */}
      <div className="flex-1 bg-gray-800 h-screen">{children}</div>
    </main>
  )
}

export default MainLayout
