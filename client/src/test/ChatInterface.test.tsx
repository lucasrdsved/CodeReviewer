
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChatInterface from '../components/examples/ChatInterface'

describe('ChatInterface Component', () => {
  const mockOtherUser = { name: 'Lucas', status: 'online' as const }

  it('renders chat interface', () => {
    render(
      <ChatInterface
        currentUser="student"
        otherUser={mockOtherUser}
      />
    )
    
    expect(screen.getByText('Lucas')).toBeInTheDocument()
    expect(screen.getByText('online')).toBeInTheDocument()
  })

  it('shows existing messages', () => {
    render(
      <ChatInterface
        currentUser="student"
        otherUser={mockOtherUser}
      />
    )
    
    expect(screen.getByText(/Como foi o treino/)).toBeInTheDocument()
    expect(screen.getByText(/Foi ótimo!/)).toBeInTheDocument()
  })

  it('allows sending new messages', async () => {
    const user = userEvent.setup()
    render(
      <ChatInterface
        currentUser="student"
        otherUser={mockOtherUser}
      />
    )
    
    const input = screen.getByPlaceholderText('Digite sua mensagem...')
    const sendButton = screen.getByTestId('send-message')
    
    await user.type(input, 'Nova mensagem de teste')
    await user.click(sendButton)
    
    expect(screen.getByText('Nova mensagem de teste')).toBeInTheDocument()
  })

  it('shows typing indicator', async () => {
    const user = userEvent.setup()
    render(
      <ChatInterface
        currentUser="student"
        otherUser={mockOtherUser}
      />
    )
    
    const input = screen.getByPlaceholderText('Digite sua mensagem...')
    await user.type(input, 'Testando...')
    
    expect(screen.getByText('Lucas está digitando...')).toBeInTheDocument()
  })

  it('handles quick responses', async () => {
    const user = userEvent.setup()
    render(
      <ChatInterface
        currentUser="student"
        otherUser={mockOtherUser}
      />
    )
    
    const quickResponse = screen.getByText('Tudo bem! 👍')
    await user.click(quickResponse)
    
    expect(screen.getByText('Tudo bem! 👍')).toBeInTheDocument()
  })
})
