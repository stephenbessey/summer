import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LeadForm from '../LeadForm'

describe('LeadForm (Client Component)', () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('should render form fields and handle user input', async () => {
    const user = userEvent.setup()
    
    render(<LeadForm onSubmit={mockOnSubmit} />)

    const firstNameInput = screen.getByLabelText(/first name/i)
    const lastNameInput = screen.getByLabelText(/last name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const statusSelect = screen.getByLabelText(/lead status/i)

    expect(firstNameInput).toBeInTheDocument()
    expect(lastNameInput).toBeInTheDocument()
    expect(emailInput).toBeInTheDocument()
    expect(statusSelect).toBeInTheDocument()

    await user.type(firstNameInput, 'John')
    await user.type(lastNameInput, 'Doe')
    await user.type(emailInput, 'john@example.com')
    await user.selectOptions(statusSelect, 'qualified')

    expect(firstNameInput).toHaveValue('John')
    expect(lastNameInput).toHaveValue('Doe')
    expect(emailInput).toHaveValue('john@example.com')
    expect(statusSelect).toHaveValue('qualified')
  })

  it('should submit form with correct data when valid', async () => {
    const user = userEvent.setup()
    mockOnSubmit.mockResolvedValueOnce(undefined)

    render(<LeadForm onSubmit={mockOnSubmit} />)

    await user.type(screen.getByLabelText(/first name/i), 'Jane')
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com')

    const submitButton = screen.getByTitle(/submit lead form/i)

    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        first_name: 'Jane',
        last_name: '',
        email: 'jane@example.com',
        lead_status: 'new'
      })
    })

    expect(screen.getByTestId('form-success')).toBeInTheDocument()
  })

  it('should show validation error for empty required fields', () => {
    render(<LeadForm onSubmit={mockOnSubmit} />)

    const form = screen.getByTestId('lead-form')
    fireEvent.submit(form)

    expect(screen.getByTestId('form-error')).toBeInTheDocument()

    expect(screen.queryByText(/first name and email are required/i)).toBeInTheDocument()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('should show loading state during form submission', async () => {
    const user = userEvent.setup()

    let resolveSubmit: () => void
    const submitPromise = new Promise<void>((resolve) => {
      resolveSubmit = resolve
    })
    mockOnSubmit.mockReturnValueOnce(submitPromise)

    render(<LeadForm onSubmit={mockOnSubmit} />)

    await user.type(screen.getByLabelText(/first name/i), 'Test')
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')

    await user.click(screen.getByTestId('submit-button'))

    await waitFor(() => {
      expect(screen.getByText('Submitting...')).toBeInTheDocument()
    })

    expect(screen.getByTestId('submit-button')).toBeDisabled()

    resolveSubmit!()

    await waitFor(() => {
      expect(screen.queryByText('Submitting...')).not.toBeInTheDocument()
    })
  })

  it('should populate form with initial data when provided', () => {
    const initialData = {
      first_name: 'Initial',
      last_name: 'User',
      email: 'initial@example.com',
      lead_status: 'contacted'
    }

    render(<LeadForm initialData={initialData} />)

    expect(screen.getByDisplayValue('Initial')).toBeInTheDocument()
    expect(screen.getByDisplayValue('User')).toBeInTheDocument()
    expect(screen.getByDisplayValue('initial@example.com')).toBeInTheDocument()
    
    const selectElement = screen.getByLabelText(/lead status/i) as HTMLSelectElement
    expect(selectElement.value).toBe('contacted')
    expect(screen.getByRole('option', { name: 'Contacted' })).toHaveProperty('selected', true)
  })

  it('should clear error message when user starts typing after validation error', async () => {
    const user = userEvent.setup()
    
    render(<LeadForm onSubmit={mockOnSubmit} />)

    const form = screen.getByTestId('lead-form')
    fireEvent.submit(form)
    
    expect(screen.getByTestId('form-error')).toBeInTheDocument()

    await user.type(screen.getByLabelText(/first name/i), 'J')

    expect(screen.queryByTestId('form-error')).not.toBeInTheDocument()
  })
})