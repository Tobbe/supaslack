import { render } from '@redwoodjs/testing'

import MessageInput from './MessageInput'

describe('MessageInput', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<MessageInput />)
    }).not.toThrow()
  })
})
