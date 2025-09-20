import StudentDashboard from '../StudentDashboard';

export default function StudentDashboardExample() {
  //todo: remove mock functionality 
  const mockStudent = {
    name: "Maria Silva",
    avatar: undefined
  };

  const handleStartWorkout = (workoutId: string) => {
    console.log('Starting workout:', workoutId);
  };

  return (
    <StudentDashboard 
      student={mockStudent}
      onStartWorkout={handleStartWorkout}
    />
  );
}