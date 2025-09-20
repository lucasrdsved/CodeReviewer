import WorkoutPlayer from '../WorkoutPlayer';
import legPressImage from '@assets/generated_images/Leg_press_exercise_demo_325437b4.png';
import benchPressImage from '@assets/generated_images/Bench_press_exercise_demo_810d3d48.png';
import squatImage from '@assets/generated_images/Squat_exercise_demo_509563fa.png';

export default function WorkoutPlayerExample() {
  //todo: remove mock functionality 
  const mockWorkout = {
    id: "upper-body-1",
    name: "Treino A - Membros Superiores",
    estimatedTime: 45,
    exercises: [
      {
        id: "bench-press-1",
        name: "Supino Reto",
        image: benchPressImage,
        sets: 4,
        reps: "8-10",
        weight: "80kg",
        restTime: 120,
        instructions: "Deite no banco, posicione a barra na altura do peito e empurre para cima.",
        targetMuscles: ["Peitoral", "Tríceps"]
      },
      {
        id: "leg-press-1", 
        name: "Leg Press 45°",
        image: legPressImage,
        sets: 3,
        reps: "12-15",
        weight: "100kg",
        restTime: 90,
        instructions: "Posicione os pés na plataforma e empurre controladamente.",
        targetMuscles: ["Quadríceps", "Glúteos"]
      },
      {
        id: "squat-1",
        name: "Agachamento Livre",
        image: squatImage,
        sets: 3,
        reps: "10-12",
        restTime: 90,
        instructions: "Desça até formar 90° com os joelhos, mantendo as costas retas.",
        targetMuscles: ["Quadríceps", "Glúteos", "Core"]
      }
    ]
  };

  const handleWorkoutComplete = () => {
    console.log('Workout completed!');
  };

  return (
    <div className="p-4">
      <WorkoutPlayer 
        workout={mockWorkout}
        onWorkoutComplete={handleWorkoutComplete}
      />
    </div>
  );
}