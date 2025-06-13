import { render, screen } from '@testing-library/react'
import { LeadsDisplay } from '../ServerLeadsList'

const mockFetch = jest.fn()
global.fetch = mockFetch

describe('ServerLeadsList (Async Server Component)', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('should display leads when data is successfully fetched', () => {
    const mockLeads = [
      {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        lead_status: 'new'
      },
      {
        id: 2,
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com',
        lead_status: 'contacted'
      }
    ]

    render(<LeadsDisplay leads={mockLeads} />)

    expect(screen.getByTestId('leads-list')).toBeInTheDocument()

    const leadsList = screen.getByRole('list')
    expect(leadsList).toBeInTheDocument()

    const listItems = screen.getAllByRole('listitem')
    expect(listItems).toHaveLength(2)

    expect(screen.getByTestId('lead-1')).toBeInTheDocument()
    expect(screen.getByTestId('lead-2')).toBeInTheDocument()

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('should display error message when error prop is provided', () => {
    const errorMessage = 'Network error'
    
    render(<LeadsDisplay error={errorMessage} />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByTestId('leads-error')).toBeInTheDocument()
    expect(screen.getByText(/error loading leads: network error/i)).toBeInTheDocument()
  })

  it('should display no leads message when empty array is provided', () => {
    render(<LeadsDisplay leads={[]} />)

    expect(screen.getByTestId('no-leads')).toBeInTheDocument()
    expect(screen.getByText('No leads found')).toBeInTheDocument()

    expect(screen.queryByText(/server-side leads/i)).not.toBeInTheDocument()
  })

  it('should handle successful API response in fetch simulation', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        success: true,
        data: [
          { id: 1, first_name: 'Test', last_name: 'User', email: 'test@example.com', lead_status: 'new' }
        ]
      })
    } as Response

    mockFetch.mockResolvedValueOnce(mockResponse)

    const response = await fetch('test-url')
    const data = await response.json()
    const result = data.success ? data.data : []
    
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      id: 1,
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      lead_status: 'new'
    })
  })

  it('should handle API call failure in fetch simulation', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    try {
      await fetch('test-url')
      expect(false).toBe(true)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect((error as Error).message).toBe('Network error')
    }
  })
})