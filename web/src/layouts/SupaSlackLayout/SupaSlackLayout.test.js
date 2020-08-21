import { render } from '@redwoodjs/testing'

import SupaSlackLayout from './SupaSlackLayout'

describe('SupaSlackLayout', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SupaSlackLayout />)
    }).not.toThrow()
  })
})
