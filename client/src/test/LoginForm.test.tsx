
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '../components/examples/LoginForm'

describe('LoginForm Component', () => {
  const mockOnLogin = vi.fn()

  beforeEach(() => {
    mockOnLogin.mockClear()
  })

  it('renders student login form by default', () => {
    render(<LoginForm onLogin={mockOnLogin} />)
    
    expect(screen.getByText('Inicie seu aprendizado')).toBeInTheDocument()
    expect(screen.getByTestId('input-email')).toBeInTheDocument()
    expect(screen.getByTestId('button-login')).toBeInTheDocument()
  })

  it('toggles to trainer login form', async () => {
    const user = userEvent.setup()
    render(<LoginForm onLogin={mockOnLogin} />)
    
    await user.click(screen.getByTestId('toggle-login-mode'))
    
    expect(screen.getByText('Acesse o painel do treinador')).toBeInTheDocument()
    expect(screen.getByTestId('input-trainer-email')).toBeInTheDocument()
    expect(screen.getByTestId('button-trainer-login')).toBeInTheDocument()
  })

  it('calls onLogin with student credentials', async () => {
    const user = userEvent.setup()
    mockOnLogin.mockResolvedValue({ data: { user: {} }, error: null })
    
    render(<LoginForm onLogin={mockOnLogin} />)
    
    await user.type(screen.getByTestId('input-email'), 'test@example.com')
    await user.type(screen.getByTestId('input-password'), 'password123')
    await user.click(screen.getByTestId('button-login'))
    
    expect(mockOnLogin).toHaveBeenCalledWith('student', 'test@example.com', 'password123')
  })

  it('calls onLogin with trainer credentials', async () => {
    const user = userEvent.setup()
    mockOnLogin.mockResolvedValue({ data: { user: {} }, error: null })
    
    render(<LoginForm onLogin={mockOnLogin} />)
    
    // Switch to trainer mode
    await user.click(screen.getByTestId('toggle-login-mode'))
    
    await user.type(screen.getByTestId('input-trainer-email'), 'trainer@example.com')
    await user.type(screen.getByTestId('input-trainer-password'), 'password123')
    await user.click(screen.getByTestId('button-trainer-login'))
    
    expect(mockOnLogin).toHaveBeenCalledWith('trainer', 'trainer@example.com', 'password123')
  })

  it('handles demo student login', async () => {
    const user = userEvent.setup()
    mockOnLogin.mockResolvedValue({ data: { user: {} }, error: null })
    
    render(<LoginForm onLogin={mockOnLogin} />)
    
    await user.click(screen.getByTestId('button-demo-student'))
    
    expect(mockOnLogin).toHaveBeenCalledWith('student', 'demo-student@athletica.com', 'demo123')
  })

  it('handles demo trainer login', async () => {
    const user = userEvent.setup()
    mockOnLogin.mockResolvedValue({ data: { user: {} }, error: null })
    
    render(<LoginForm onLogin={mockOnLogin} />)
    
    await user.click(screen.getByTestId('button-demo-trainer'))
    
    expect(mockOnLogin).toHaveBeenCalledWith('trainer', 'demo-trainer@athletica.com', 'demo123')
  })
})
