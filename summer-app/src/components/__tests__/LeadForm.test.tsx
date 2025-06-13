import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LeadForm from '../LeadForm'

describe('LeadForm (Client Component)', () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  // Test 1: Form rendering and interaction with getByLabelText and user-event
  it('should render form fields and handle user input', async () => {
    const user = userEvent.setup()
    
    render(<LeadForm onSubmit={mockOnSubmit} />)

    // Use getByLabelText to find form fields
    const firstNameInput = screen.getByLabelText(/first name/i)
    const lastNameInput = screen.getByLabelText(/last name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const statusSelect = screen.getByLabelText(/lead status/i)

    expect(firstNameInput).toBeInTheDocument()
    expect(lastNameInput).toBeInTheDocument()
    expect(emailInput).toBeInTheDocument()
    expect(statusSelect).toBeInTheDocument()

    // Use user-event to simulate realistic interactions
    await user.type(firstNameInput, 'John')
    await user.type(lastNameInput, 'Doe')
    await user.type(emailInput, 'john@example.com')
    await user.selectOptions(statusSelect, 'qualified')

    expect(firstNameInput).toHaveValue('John')
    expect(lastNameInput).toHaveValue('Doe')
    expect(emailInput).toHaveValue('john@example.com')
    expect(statusSelect).toHaveValue('qualified')
  })

  // Test 2: Form submission with getByTitle and user-event
  it('should submit form with correct data when valid', async () => {
    const user = userEvent.setup()
    mockOnSubmit.mockResolvedValueOnce(undefined)

    render(<LeadForm onSubmit={mockOnSubmit} />)

    // Use getByLabelText for form fields
    await user.type(screen.getByLabelText(/first name/i), 'Jane')
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com')

    // Use getByTitle to find submit button
    const submitButton = screen.getByTitle(/submit lead form/i)
    
    // Use user-event to click submit
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        first_name: 'Jane',
        last_name: '',
        email: 'jane@example.com',
        lead_status: 'new'
      })
    })

    // Check success message appears
    expect(screen.getByTestId('form-success')).toBeInTheDocument()
  })

  // Test 3: Form validation with queryByText and fireEvent (for immediate validation)
  it('should show validation error for empty required fields', () => {
    render(<LeadForm onSubmit={mockOnSubmit} />)

    // Use fireEvent for immediate form submission (no user delay)
    const form = screen.getByTestId('lead-form')
    fireEvent.submit(form)

    // Error should appear immediately
    expect(screen.getByTestId('form-error')).toBeInTheDocument()

    // Use queryByText to check error message
    expect(screen.queryByText(/first name and email are required/i)).toBeInTheDocument()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  // Test 4: Loading state during submission
  it('should show loading state during form submission', async () => {
    const user = userEvent.setup()
    
    // Create a promise that we can resolve manually
    let resolveSubmit: () => void
    const submitPromise = new Promise<void>((resolve) => {
      resolveSubmit = resolve
    })
    mockOnSubmit.mockReturnValueOnce(submitPromise)

    render(<LeadForm onSubmit={mockOnSubmit} />)

    // Fill form
    await user.type(screen.getByLabelText(/first name/i), 'Test')
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')

    // Submit form
    await user.click(screen.getByTestId('submit-button'))

    // Check loading state
    await waitFor(() => {
      expect(screen.getByText('Submitting...')).toBeInTheDocument()
    })

    // Button should be disabled
    expect(screen.getByTestId('submit-button')).toBeDisabled()

    // Resolve the promise
    resolveSubmit!()

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Submitting...')).not.toBeInTheDocument()
    })
  })

  // Test 5: Initial data population using getByDisplayValue and value checking
  it('should populate form with initial data when provided', () => {
    const initialData = {
      first_name: 'Initial',
      last_name: 'User',
      email: 'initial@example.com',
      lead_status: 'contacted'
    }

    render(<LeadForm initialData={initialData} />)

    // Use getByDisplayValue to check populated input values
    expect(screen.getByDisplayValue('Initial')).toBeInTheDocument()
    expect(screen.getByDisplayValue('User')).toBeInTheDocument()
    expect(screen.getByDisplayValue('initial@example.com')).toBeInTheDocument()
    
    // For select elements, check the value directly
    const selectElement = screen.getByLabelText(/lead status/i) as HTMLSelectElement
    expect(selectElement.value).toBe('contacted')
    
    // Alternative: check that the correct option is selected
    expect(screen.getByRole('option', { name: 'Contacted' })).toHaveProperty('selected', true)
  })

  // Test 6: Error clearing when user starts typing
  it('should clear error message when user starts typing after validation error', async () => {
    const user = userEvent.setup()
    
    render(<LeadForm onSubmit={mockOnSubmit} />)

    // Trigger validation error using fireEvent for immediate result
    const form = screen.getByTestId('lead-form')
    fireEvent.submit(form)
    
    expect(screen.getByTestId('form-error')).toBeInTheDocument()

    // Start typing in first name field
    await user.type(screen.getByLabelText(/first name/i), 'J')

    // Error should be cleared
    expect(screen.queryByTestId('form-error')).not.toBeInTheDocument()
  })
})