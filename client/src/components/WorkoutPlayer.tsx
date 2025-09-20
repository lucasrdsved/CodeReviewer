import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, SkipForward, Square, Mic, MicOff, Volume2 } from "lucide-react";
import ExerciseCard from "./ExerciseCard";
import WorkoutTimer from "./WorkoutTimer";

interface Exercise {
  id: string;
  name: string;
  image: string;
  sets: number;
  reps: string;
  weight?: string;
  restTime: number;
  instructions: string;
  targetMuscles: string[];
}

interface WorkoutPlayerProps {
  workout: {
    id: string;
    name: string;
    exercises: Exercise[];
    estimatedTime: number;
  };
  onWorkoutComplete?: () => void;
}

export default function WorkoutPlayer({ workout, onWorkoutComplete }: WorkoutPlayerProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [completedSets, setCompletedSets] = useState<Record<string, number>>({});
  const [isResting, setIsResting] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentExercise = workout.exercises[currentExerciseIndex];
  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const completedSetsCount = Object.values(completedSets).reduce((acc, count) => acc + count, 0);
  const progress = (completedSetsCount / totalSets) * 100;

  // Voice synthesis function
  const speak = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    
    console.log('Would speak:', text);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (isPlaying && currentExercise) {
      const setNumber = completedSets[currentExercise.id] + 1 || 1;
      speak(`${currentExercise.name}. Série ${setNumber} de ${currentExercise.sets}. ${currentExercise.reps} repetições.`);
    }
  }, [currentExerciseIndex, isPlaying, voiceEnabled]);

  const handleExerciseComplete = (exerciseId: string, data: { weight: number; rpe: number; notes: string }) => {
    console.log('Exercise set completed:', { exerciseId, data });
    
    const currentSetNumber = completedSets[exerciseId] + 1 || 1;
    const newCompletedSets = { ...completedSets, [exerciseId]: currentSetNumber };
    setCompletedSets(newCompletedSets);

    speak(`Série ${currentSetNumber} concluída. RPE ${data.rpe}.`);

    // Check if all sets for this exercise are completed
    if (currentSetNumber >= currentExercise.sets) {
      speak(`${currentExercise.name} concluído. Parabéns!`);
      moveToNextExercise();
    } else {
      // Start rest timer
      setIsResting(true);
      speak(`Descanso de ${currentExercise.restTime} segundos.`);
    }
  };

  const handleExerciseStart = (exerciseId: string) => {
    console.log('Exercise started:', exerciseId);
    setIsPlaying(true);
  };

  const moveToNextExercise = () => {
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSet(1);
      speak(`Próximo exercício: ${workout.exercises[currentExerciseIndex + 1].name}`);
    } else {
      // Workout completed
      speak("Treino concluído! Parabéns pelo excelente trabalho!");
      onWorkoutComplete?.();
    }
  };

  const handleSkipSet = () => {
    console.log('Set skipped');
    speak("Série pulada.");
    moveToNextExercise();
  };

  const handleStopWorkout = () => {
    console.log('Workout stopped');
    speak("Treino interrompido.");
    setIsPlaying(false);
  };

  const toggleVoice = () => {
    console.log('Voice toggle triggered');
    setVoiceEnabled(!voiceEnabled);
  };

  const handleRestComplete = () => {
    console.log('Rest period completed');
    setIsResting(false);
    speak("Descanso terminado. Prepare-se para a próxima série.");
  };

  if (isResting) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{workout.name}</span>
              <Badge variant="secondary">
                {completedSetsCount} / {totalSets} séries
              </Badge>
            </CardTitle>
            <Progress value={progress} className="w-full" />
          </CardHeader>
        </Card>
        
        <WorkoutTimer
          duration={currentExercise.restTime}
          onComplete={handleRestComplete}
          autoStart={true}
          title={`Descanso - ${currentExercise.name}`}
        />
        
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={handleRestComplete}
            data-testid="button-skip-rest"
          >
            Pular Descanso
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Workout Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{workout.name}</span>
            <Badge variant="secondary">
              {completedSetsCount} / {totalSets} séries
            </Badge>
          </CardTitle>
          <Progress value={progress} className="w-full" />
          <div className="text-sm text-muted-foreground">
            Exercício {currentExerciseIndex + 1} de {workout.exercises.length} • 
            Tempo estimado: {workout.estimatedTime}min
          </div>
        </CardHeader>
      </Card>

      {/* Player Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                data-testid="button-play-pause"
                className="h-12 w-12"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              
              <Button
                size="icon"
                variant="outline"
                onClick={handleSkipSet}
                data-testid="button-skip"
                className="h-12 w-12"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
              
              <Button
                size="icon"
                variant="destructive"
                onClick={handleStopWorkout}
                data-testid="button-stop"
                className="h-12 w-12"
              >
                <Square className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={toggleVoice}
                data-testid="button-voice-toggle"
                className="h-12 w-12"
              >
                {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Exercise */}
      {currentExercise && (
        <ExerciseCard
          exercise={currentExercise}
          currentSet={completedSets[currentExercise.id] + 1 || 1}
          onComplete={handleExerciseComplete}
          onStart={handleExerciseStart}
          isActive={isPlaying}
          isCompleted={completedSets[currentExercise.id] >= currentExercise.sets}
        />
      )}

      {/* Next Exercises Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Próximos Exercícios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {workout.exercises.slice(currentExerciseIndex + 1, currentExerciseIndex + 3).map((exercise, index) => (
              <div key={exercise.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <img 
                  src={exercise.image} 
                  alt={exercise.name}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="flex-1">
                  <div className="font-medium">{exercise.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {exercise.sets} séries • {exercise.reps} reps
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}