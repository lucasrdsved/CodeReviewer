import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Play, CheckCircle, Info, Camera } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ExerciseCardProps {
  exercise: {
    id: string;
    name: string;
    image: string;
    sets: number;
    reps: string;
    weight?: string;
    restTime: number;
    instructions: string;
    targetMuscles: string[];
  };
  currentSet?: number;
  onComplete?: (exerciseId: string, data: { weight: number; rpe: number; notes: string }) => void;
  onStart?: (exerciseId: string) => void;
  isActive?: boolean;
  isCompleted?: boolean;
}

export default function ExerciseCard({ 
  exercise, 
  currentSet = 1, 
  onComplete, 
  onStart,
  isActive = false,
  isCompleted = false 
}: ExerciseCardProps) {
  const [weight, setWeight] = useState(exercise.weight ? parseFloat(exercise.weight) : 0);
  const [rpe, setRpe] = useState([7]);
  const [notes, setNotes] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const handleStart = () => {
    console.log('Exercise started:', exercise.id);
    onStart?.(exercise.id);
  };

  const handleComplete = () => {
    console.log('Exercise completed:', { exerciseId: exercise.id, weight, rpe: rpe[0], notes });
    onComplete?.(exercise.id, { weight, rpe: rpe[0], notes });
  };

  const adjustWeight = (amount: number) => {
    const newWeight = Math.max(0, weight + amount);
    setWeight(newWeight);
    console.log('Weight adjusted to:', newWeight);
  };

  const getRpeColor = (value: number) => {
    if (value <= 4) return "text-green-600";
    if (value <= 6) return "text-yellow-600";
    if (value <= 8) return "text-orange-600";
    return "text-red-600";
  };

  const getRpeLabel = (value: number) => {
    const labels = {
      1: "Muito Fácil",
      2: "Fácil",
      3: "Moderado",
      4: "Um pouco difícil",
      5: "Difícil",
      6: "Difícil",
      7: "Muito difícil",
      8: "Muito difícil",
      9: "Extremamente difícil",
      10: "Máximo esforço"
    };
    return labels[value as keyof typeof labels] || "Desconhecido";
  };

  return (
    <Card className={`${isActive ? 'ring-2 ring-primary' : ''} ${isCompleted ? 'bg-muted/50' : ''} hover-elevate`}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Exercise Image */}
          <div className="flex-shrink-0">
            <img 
              src={exercise.image} 
              alt={exercise.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
          </div>

          {/* Exercise Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{exercise.name}</h3>
                <div className="flex gap-2 flex-wrap">
                  {exercise.targetMuscles.map((muscle) => (
                    <Badge key={muscle} variant="secondary" className="text-xs">
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Info className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{exercise.name}</DialogTitle>
                    <DialogDescription>
                      Instruções detalhadas do exercício
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <img 
                      src={exercise.image} 
                      alt={exercise.name}
                      className="w-full h-48 rounded-lg object-cover"
                    />
                    <p className="text-sm">{exercise.instructions}</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="text-sm text-muted-foreground">
              <div>Série {currentSet} de {exercise.sets} • {exercise.reps} repetições</div>
              <div>Descanso: {exercise.restTime}s {exercise.weight && `• Carga sugerida: ${exercise.weight}`}</div>
            </div>

            {/* Quick Actions */}
            {isActive && !isCompleted && (
              <div className="space-y-3 mt-4 p-3 bg-muted/50 rounded-lg">
                {/* Weight Input */}
                <div className="space-y-2">
                  <Label className="text-sm">Carga utilizada (kg)</Label>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => adjustWeight(-2.5)}>
                      -2.5
                    </Button>
                    <Input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                      className="w-20 text-center"
                      data-testid={`input-weight-${exercise.id}`}
                    />
                    <Button size="sm" variant="outline" onClick={() => adjustWeight(2.5)}>
                      +2.5
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => adjustWeight(5)}>
                      +5
                    </Button>
                  </div>
                </div>

                {/* RPE Slider */}
                <div className="space-y-2">
                  <Label className="text-sm">
                    RPE: <span className={`font-medium ${getRpeColor(rpe[0])}`}>
                      {rpe[0]} - {getRpeLabel(rpe[0])}
                    </span>
                  </Label>
                  <Slider
                    value={rpe}
                    onValueChange={setRpe}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                    data-testid={`slider-rpe-${exercise.id}`}
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label className="text-sm">Observações (opcional)</Label>
                  <Input
                    placeholder="Como se sentiu? Dificuldades?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    data-testid={`input-notes-${exercise.id}`}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={handleComplete}
                    className="flex-1"
                    data-testid={`button-complete-${exercise.id}`}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Série Concluída
                  </Button>
                  <Button 
                    size="icon"
                    variant="outline"
                    data-testid={`button-photo-${exercise.id}`}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {!isActive && !isCompleted && (
              <Button 
                onClick={handleStart}
                variant="outline"
                size="sm"
                data-testid={`button-start-${exercise.id}`}
              >
                <Play className="w-4 h-4 mr-2" />
                Iniciar Exercício
              </Button>
            )}

            {isCompleted && (
              <div className="flex items-center text-green-600 text-sm font-medium">
                <CheckCircle className="w-4 h-4 mr-2" />
                Concluído
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}