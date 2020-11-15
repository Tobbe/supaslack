import { Link, routes } from '@redwoodjs/router'

const ChannelPage = ({ id }) => {
  return (
    <>
      <h1>ChannelPage</h1>
      <p>
        Find me in <code>./web/src/pages/ChannelPage/ChannelPage.js</code>
      </p>
      <p>
        My default route is named <code>channel</code>, link to me with `
        <Link to={routes.channel({ id: '42' })}>Channel 42</Link>`
      </p>
      <p>The parameter passed to me is {id}</p>
    </>
  )
}

export default ChannelPage
