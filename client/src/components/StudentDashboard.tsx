import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Play, Calendar, TrendingUp, MessageCircle, Target, Flame, Award } from "lucide-react";
import ProgressRing from "./ProgressRing";
import WorkoutPlayer from "./WorkoutPlayer";
import legPressImage from '@assets/generated_images/Leg_press_exercise_demo_325437b4.png';
import benchPressImage from '@assets/generated_images/Bench_press_exercise_demo_810d3d48.png';
import squatImage from '@assets/generated_images/Squat_exercise_demo_509563fa.png';
import trainerAvatar from '@assets/generated_images/Personal_trainer_Lucas_avatar_5987325d.png';

interface StudentDashboardProps {
  student: {
    name: string;
    avatar?: string;
  };
  onStartWorkout?: (workoutId: string) => void;
}

export default function StudentDashboard({ student, onStartWorkout }: StudentDashboardProps) {
  const [activeView, setActiveView] = useState<'dashboard' | 'workout'>('dashboard');
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);

  //todo: remove mock functionality 
  const mockStats = {
    currentStreak: 5,
    weeklyProgress: 75,
    totalWorkouts: 24,
    monthlyGoal: 20
  };

  const mockTodayWorkout = {
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
      }
    ]
  };

  const mockUpcomingWorkouts = [
    { id: "2", name: "Treino B - Membros Inferiores", date: "Amanhã", time: "14:00" },
    { id: "3", name: "Treino C - Funcional", date: "Quinta", time: "16:00" }
  ];

  const mockMessages = [
    { from: "Lucas", message: "Parabéns pelo treino de ontem! Continue assim 💪", time: "2h ago", unread: true },
    { from: "Sistema", message: "Nova meta desbloqueada: 30 dias consecutivos", time: "1d ago", unread: false }
  ];

  const handleStartWorkout = (workoutId: string) => {
    console.log('Starting workout:', workoutId);
    setSelectedWorkout(mockTodayWorkout);
    setActiveView('workout');
    onStartWorkout?.(workoutId);
  };

  const handleWorkoutComplete = () => {
    console.log('Workout completed, returning to dashboard');
    setActiveView('dashboard');
    setSelectedWorkout(null);
  };

  if (activeView === 'workout' && selectedWorkout) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-4 border-b">
          <Button 
            variant="ghost" 
            onClick={() => setActiveView('dashboard')}
            data-testid="button-back-to-dashboard"
          >
            ← Voltar
          </Button>
          <h1 className="text-xl font-bold">Player de Treino</h1>
        </div>
        <div className="p-4">
          <WorkoutPlayer 
            workout={selectedWorkout}
            onWorkoutComplete={handleWorkoutComplete}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={student.avatar} alt={student.name} />
              <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold">Olá, {student.name}!</h1>
              <p className="text-muted-foreground">Pronto para treinar hoje?</p>
            </div>
          </div>
          <Button size="icon" variant="outline" data-testid="button-emergency">
            <MessageCircle className="h-5 w-5 text-red-500" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Today's Workout - Main CTA */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-primary" />
              Treino de Hoje
            </CardTitle>
            <CardDescription>
              {mockTodayWorkout.name} • {mockTodayWorkout.estimatedTime} min • {mockTodayWorkout.exercises.length} exercícios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <ProgressRing progress={0} size={80}>
                <div className="text-center">
                  <div className="text-lg font-bold">0%</div>
                </div>
              </ProgressRing>
              <div className="flex-1">
                <Button 
                  onClick={() => handleStartWorkout(mockTodayWorkout.id)}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover-elevate"
                  size="lg"
                  data-testid="button-start-today-workout"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Iniciar Treino
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{mockStats.currentStreak}</div>
              <div className="text-sm text-muted-foreground">Dias seguidos</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{mockStats.weeklyProgress}%</div>
              <div className="text-sm text-muted-foreground">Meta semanal</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{mockStats.totalWorkouts}</div>
              <div className="text-sm text-muted-foreground">Treinos totais</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-muted-foreground">Conquistas</div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Workouts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximos Treinos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockUpcomingWorkouts.map((workout) => (
                <div key={workout.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium">{workout.name}</div>
                    <div className="text-sm text-muted-foreground">{workout.date} às {workout.time}</div>
                  </div>
                  <Button size="sm" variant="outline" data-testid={`button-schedule-${workout.id}`}>
                    Ver detalhes
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Messages from Trainer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Mensagens do Lucas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockMessages.map((msg, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.from === 'Lucas' ? trainerAvatar : undefined} />
                    <AvatarFallback>{msg.from[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{msg.from}</span>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                      {msg.unread && <Badge variant="secondary" className="text-xs h-5">Nova</Badge>}
                    </div>
                    <p className="text-sm mt-1">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" data-testid="button-open-chat">
              Abrir Chat Completo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}