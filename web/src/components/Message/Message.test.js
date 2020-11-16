import { render } from '@redwoodjs/testing'

import Message from './Message'

describe('Message', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Message />)
    }).not.toThrow()
  })
})
