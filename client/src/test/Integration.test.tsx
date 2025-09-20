
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('Integration Tests - Complete User Flows', () => {
  it('Complete student flow: login -> dashboard -> workout -> chat', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Step 1: Login as student
    await user.click(screen.getByTestId('button-demo-student'))
    
    await waitFor(() => {
      expect(screen.getByText('Próximo Treino')).toBeInTheDocument()
    })
    
    // Step 2: Start a workout
    const startWorkoutButton = screen.getAllByText('Iniciar Treino')[0]
    await user.click(startWorkoutButton)
    
    await waitFor(() => {
      expect(screen.getByText('Treino A - Membros Superiores')).toBeInTheDocument()
    })
    
    // Step 3: Navigate to chat
    await user.click(screen.getByTestId('tab-chat'))
    
    await waitFor(() => {
      expect(screen.getByText('Lucas')).toBeInTheDocument()
    })
    
    // Step 4: Send a message
    const messageInput = screen.getByPlaceholderText('Digite sua mensagem...')
    await user.type(messageInput, 'Oi, estou fazendo o treino!')
    await user.click(screen.getByTestId('send-message'))
    
    expect(screen.getByText('Oi, estou fazendo o treino!')).toBeInTheDocument()
  })

  it('Complete trainer flow: login -> dashboard -> student management', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Step 1: Login as trainer
    await user.click(screen.getByTestId('button-demo-trainer'))
    
    await waitFor(() => {
      expect(screen.getByText('Alunos ativos')).toBeInTheDocument()
    })
    
    // Step 2: Search for a student
    const searchInput = screen.getByPlaceholderText('Buscar alunos...')
    await user.type(searchInput, 'Maria')
    
    expect(screen.getByText('Maria Silva')).toBeInTheDocument()
    
    // Step 3: Navigate to analytics
    await user.click(screen.getByTestId('tab-analytics'))
    
    await waitFor(() => {
      expect(screen.getByText('Adesão média')).toBeInTheDocument()
    })
    
    // Step 4: Navigate to chat
    await user.click(screen.getByTestId('tab-chat'))
    
    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument()
    })
  })

  it('User can switch between student and trainer modes', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Login as student
    await user.click(screen.getByTestId('button-demo-student'))
    
    await waitFor(() => {
      expect(screen.getByText(/Maria Silva \(Demo\)/)).toBeInTheDocument()
    })
    
    // Logout
    await user.click(screen.getByTestId('button-debug-logout'))
    
    await waitFor(() => {
      expect(screen.getByText('Bem-vindo!')).toBeInTheDocument()
    })
    
    // Login as trainer
    await user.click(screen.getByTestId('button-demo-trainer'))
    
    await waitFor(() => {
      expect(screen.getByText(/Lucas Personal \(Demo\)/)).toBeInTheDocument()
    })
  })

  it('PWA install button is available for logged in users', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Login
    await user.click(screen.getByTestId('button-demo-student'))
    
    await waitFor(() => {
      expect(screen.getByTestId('button-install-pwa')).toBeInTheDocument()
    })
    
    // Click install button
    const consoleSpy = vi.spyOn(console, 'log')
    await user.click(screen.getByTestId('button-install-pwa'))
    
    expect(consoleSpy).toHaveBeenCalledWith('PWA install prompt would trigger here')
  })

  it('All navigation tabs work correctly for student', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Login as student
    await user.click(screen.getByTestId('button-demo-student'))
    
    await waitFor(() => {
      expect(screen.getByTestId('tab-home')).toBeInTheDocument()
    })
    
    // Test all tabs
    const tabs = ['home', 'workout', 'chat', 'profile']
    
    for (const tab of tabs) {
      await user.click(screen.getByTestId(`tab-${tab}`))
      await waitFor(() => {
        // Each tab should be clickable and change the view
        expect(screen.getByTestId(`tab-${tab}`)).toHaveClass('text-primary')
      })
    }
  })

  it('All navigation tabs work correctly for trainer', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Login as trainer
    await user.click(screen.getByTestId('button-demo-trainer'))
    
    await waitFor(() => {
      expect(screen.getByTestId('tab-home')).toBeInTheDocument()
    })
    
    // Test all tabs
    const tabs = ['home', 'students', 'chat', 'analytics']
    
    for (const tab of tabs) {
      await user.click(screen.getByTestId(`tab-${tab}`))
      await waitFor(() => {
        // Each tab should be clickable and change the view
        expect(screen.getByTestId(`tab-${tab}`)).toHaveClass('text-primary')
      })
    }
  })
})
