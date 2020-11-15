import { render } from '@redwoodjs/testing'

import ChannelPage from './ChannelPage'

describe('ChannelPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ChannelPage id="42" />)
    }).not.toThrow()
  })
})
