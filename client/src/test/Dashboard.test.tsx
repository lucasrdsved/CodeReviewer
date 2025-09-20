
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StudentDashboard from '../components/examples/StudentDashboard'
import TrainerDashboard from '../components/examples/TrainerDashboard'

describe('Dashboard Components', () => {
  const mockStudent = { name: 'Maria Silva', avatar: undefined }
  const mockTrainer = { name: 'Lucas Personal', avatar: undefined }
  const mockOnStartWorkout = vi.fn()

  beforeEach(() => {
    mockOnStartWorkout.mockClear()
  })

  describe('StudentDashboard', () => {
    it('renders student dashboard correctly', () => {
      render(
        <StudentDashboard
          student={mockStudent}
          onStartWorkout={mockOnStartWorkout}
        />
      )
      
      expect(screen.getByText('Próximo Treino')).toBeInTheDocument()
      expect(screen.getByText('Progresso Semanal')).toBeInTheDocument()
      expect(screen.getByText('Histórico de Treinos')).toBeInTheDocument()
    })

    it('shows workout cards', () => {
      render(
        <StudentDashboard
          student={mockStudent}
          onStartWorkout={mockOnStartWorkout}
        />
      )
      
      expect(screen.getByText('Treino A - Membros Superiores')).toBeInTheDocument()
      expect(screen.getByText('Treino B - Membros Inferiores')).toBeInTheDocument()
    })

    it('allows starting workout', async () => {
      const user = userEvent.setup()
      render(
        <StudentDashboard
          student={mockStudent}
          onStartWorkout={mockOnStartWorkout}
        />
      )
      
      const startButton = screen.getAllByText('Iniciar Treino')[0]
      await user.click(startButton)
      
      expect(mockOnStartWorkout).toHaveBeenCalled()
    })

    it('displays progress metrics', () => {
      render(
        <StudentDashboard
          student={mockStudent}
          onStartWorkout={mockOnStartWorkout}
        />
      )
      
      expect(screen.getByText('75%')).toBeInTheDocument() // Weekly progress
      expect(screen.getByText('12')).toBeInTheDocument() // Total workouts
    })
  })

  describe('TrainerDashboard', () => {
    it('renders trainer dashboard correctly', () => {
      render(<TrainerDashboard trainer={mockTrainer} />)
      
      expect(screen.getByText('Alunos ativos')).toBeInTheDocument()
      expect(screen.getByText('Treinos semanais')).toBeInTheDocument()
      expect(screen.getByText('Adesão média')).toBeInTheDocument()
    })

    it('shows student list', () => {
      render(<TrainerDashboard trainer={mockTrainer} />)
      
      expect(screen.getByText('Maria Silva')).toBeInTheDocument()
      expect(screen.getByText('João Santos')).toBeInTheDocument()
      expect(screen.getByText('Ana Costa')).toBeInTheDocument()
    })

    it('allows searching students', async () => {
      const user = userEvent.setup()
      render(<TrainerDashboard trainer={mockTrainer} />)
      
      const searchInput = screen.getByPlaceholderText('Buscar alunos...')
      await user.type(searchInput, 'Maria')
      
      expect(screen.getByText('Maria Silva')).toBeInTheDocument()
    })

    it('shows activity feed', () => {
      render(<TrainerDashboard trainer={mockTrainer} />)
      
      expect(screen.getByText('Completou Treino A')).toBeInTheDocument()
      expect(screen.getByText('Pergunta sobre execução')).toBeInTheDocument()
    })
  })
})
