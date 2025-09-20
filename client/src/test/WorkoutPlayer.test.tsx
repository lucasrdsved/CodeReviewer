
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WorkoutPlayer from '../components/examples/WorkoutPlayer'

describe('WorkoutPlayer Component', () => {
  it('renders workout information', () => {
    render(<WorkoutPlayer />)
    
    expect(screen.getByText('Treino A - Membros Superiores')).toBeInTheDocument()
    expect(screen.getByText('45 min estimado')).toBeInTheDocument()
  })

  it('displays exercise list', () => {
    render(<WorkoutPlayer />)
    
    expect(screen.getByText('Supino Reto')).toBeInTheDocument()
    expect(screen.getByText('Leg Press 45°')).toBeInTheDocument()
    expect(screen.getByText('Agachamento Livre')).toBeInTheDocument()
  })

  it('shows exercise details', () => {
    render(<WorkoutPlayer />)
    
    expect(screen.getByText('4 séries')).toBeInTheDocument()
    expect(screen.getByText('8-10 reps')).toBeInTheDocument()
    expect(screen.getByText('80kg')).toBeInTheDocument()
  })

  it('allows starting exercise', async () => {
    const user = userEvent.setup()
    render(<WorkoutPlayer />)
    
    const startButton = screen.getAllByText('Iniciar')[0]
    await user.click(startButton)
    
    await waitFor(() => {
      expect(screen.getByText('Executando')).toBeInTheDocument()
    })
  })

  it('shows rest timer between sets', async () => {
    const user = userEvent.setup()
    render(<WorkoutPlayer />)
    
    // Start first exercise
    const startButton = screen.getAllByText('Iniciar')[0]
    await user.click(startButton)
    
    await waitFor(() => {
      expect(screen.getByText('Série 1 de 4')).toBeInTheDocument()
    })
    
    // Complete first set
    const completeButton = screen.getByText('Série Completa')
    await user.click(completeButton)
    
    await waitFor(() => {
      expect(screen.getByText('Descanso')).toBeInTheDocument()
    })
  })

  it('tracks workout progress', async () => {
    const user = userEvent.setup()
    render(<WorkoutPlayer />)
    
    // Start workout
    const startButton = screen.getAllByText('Iniciar')[0]
    await user.click(startButton)
    
    await waitFor(() => {
      expect(screen.getByText('Exercício 1 de 3')).toBeInTheDocument()
    })
  })
})
