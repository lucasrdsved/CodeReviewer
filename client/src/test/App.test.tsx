
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('Athletica Pro App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form initially', () => {
    render(<App />)
    expect(screen.getByText('Bem-vindo!')).toBeInTheDocument()
    expect(screen.getByTestId('button-demo-student')).toBeInTheDocument()
    expect(screen.getByTestId('button-demo-trainer')).toBeInTheDocument()
  })

  it('allows demo student login', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const demoButton = screen.getByTestId('button-demo-student')
    await user.click(demoButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Maria Silva \(Demo\)/)).toBeInTheDocument()
    })
  })

  it('allows demo trainer login', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const demoButton = screen.getByTestId('button-demo-trainer')
    await user.click(demoButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Lucas Personal \(Demo\)/)).toBeInTheDocument()
    })
  })

  it('shows student dashboard after student login', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    await user.click(screen.getByTestId('button-demo-student'))
    
    await waitFor(() => {
      expect(screen.getByText('Próximo Treino')).toBeInTheDocument()
      expect(screen.getByText('Progresso Semanal')).toBeInTheDocument()
    })
  })

  it('shows trainer dashboard after trainer login', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    await user.click(screen.getByTestId('button-demo-trainer'))
    
    await waitFor(() => {
      expect(screen.getByText('Alunos ativos')).toBeInTheDocument()
      expect(screen.getByText('Treinos semanais')).toBeInTheDocument()
    })
  })

  it('allows navigation between tabs', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Login as student
    await user.click(screen.getByTestId('button-demo-student'))
    
    await waitFor(() => {
      // Wait for dashboard to load
      expect(screen.getByText('Próximo Treino')).toBeInTheDocument()
    })
    
    // Navigate to chat
    const chatTab = screen.getByTestId('tab-chat')
    await user.click(chatTab)
    
    await waitFor(() => {
      expect(screen.getByText('Lucas')).toBeInTheDocument()
    })
  })

  it('allows logout via debug panel', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Login first
    await user.click(screen.getByTestId('button-demo-student'))
    
    await waitFor(() => {
      expect(screen.getByTestId('button-debug-logout')).toBeInTheDocument()
    })
    
    // Logout
    await user.click(screen.getByTestId('button-debug-logout'))
    
    await waitFor(() => {
      expect(screen.getByText('Bem-vindo!')).toBeInTheDocument()
    })
  })
})
