import { render } from '@redwoodjs/testing'

import ChannelsPage from './ChannelsPage'

describe('ChannelsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ChannelsPage id="42" />)
    }).not.toThrow()
  })
})
