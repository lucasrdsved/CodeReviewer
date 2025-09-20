
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BottomNavigation from '../components/examples/BottomNavigation'

describe('Navigation Components', () => {
  const mockOnTabChange = vi.fn()

  beforeEach(() => {
    mockOnTabChange.mockClear()
  })

  it('renders student navigation correctly', () => {
    render(
      <BottomNavigation
        userType="student"
        activeTab="home"
        onTabChange={mockOnTabChange}
        unreadMessages={3}
      />
    )
    
    expect(screen.getByTestId('tab-home')).toBeInTheDocument()
    expect(screen.getByTestId('tab-workout')).toBeInTheDocument()
    expect(screen.getByTestId('tab-chat')).toBeInTheDocument()
    expect(screen.getByTestId('tab-profile')).toBeInTheDocument()
  })

  it('renders trainer navigation correctly', () => {
    render(
      <BottomNavigation
        userType="trainer"
        activeTab="home"
        onTabChange={mockOnTabChange}
        unreadMessages={2}
      />
    )
    
    expect(screen.getByTestId('tab-home')).toBeInTheDocument()
    expect(screen.getByTestId('tab-students')).toBeInTheDocument()
    expect(screen.getByTestId('tab-chat')).toBeInTheDocument()
    expect(screen.getByTestId('tab-analytics')).toBeInTheDocument()
  })

  it('shows unread message badge', () => {
    render(
      <BottomNavigation
        userType="student"
        activeTab="home"
        onTabChange={mockOnTabChange}
        unreadMessages={5}
      />
    )
    
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('handles tab changes', async () => {
    const user = userEvent.setup()
    render(
      <BottomNavigation
        userType="student"
        activeTab="home"
        onTabChange={mockOnTabChange}
        unreadMessages={0}
      />
    )
    
    await user.click(screen.getByTestId('tab-chat'))
    expect(mockOnTabChange).toHaveBeenCalledWith('chat')
  })

  it('highlights active tab', () => {
    render(
      <BottomNavigation
        userType="student"
        activeTab="chat"
        onTabChange={mockOnTabChange}
        unreadMessages={0}
      />
    )
    
    const chatTab = screen.getByTestId('tab-chat')
    expect(chatTab).toHaveClass('text-primary')
  })
})
