import WorkoutTimer from '../WorkoutTimer';

export default function WorkoutTimerExample() {
  return (
    <div className="p-4 space-y-4">
      <WorkoutTimer 
        duration={90} 
        onComplete={() => console.log('Timer completed!')}
        title="Descanso entre séries"
      />
    </div>
  );
}