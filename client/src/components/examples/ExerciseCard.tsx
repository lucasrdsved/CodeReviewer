import ExerciseCard from '../ExerciseCard';
import legPressImage from '@assets/generated_images/Leg_press_exercise_demo_325437b4.png';

export default function ExerciseCardExample() {
  //todo: remove mock functionality 
  const mockExercise = {
    id: "leg-press-1",
    name: "Leg Press 45°",
    image: legPressImage,
    sets: 4,
    reps: "8-12",
    weight: "100kg",
    restTime: 90,
    instructions: "Posicione os pés na plataforma na largura dos ombros. Desça até formar um ângulo de 90° com os joelhos e empurre a plataforma de volta à posição inicial.",
    targetMuscles: ["Quadríceps", "Glúteos"]
  };

  const handleComplete = (exerciseId: string, data: any) => {
    console.log('Exercise completed:', { exerciseId, data });
  };

  const handleStart = (exerciseId: string) => {
    console.log('Exercise started:', exerciseId);
  };

  return (
    <div className="p-4 space-y-4">
      <ExerciseCard 
        exercise={mockExercise}
        currentSet={2}
        onComplete={handleComplete}
        onStart={handleStart}
        isActive={true}
      />
    </div>
  );
}