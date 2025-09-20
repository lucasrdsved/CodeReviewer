import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Plus, 
  Calendar, 
  TrendingUp, 
  MessageCircle, 
  Search,
  Activity,
  AlertTriangle,
  Clock,
  Award
} from "lucide-react";
import trainerAvatar from '@assets/generated_images/Personal_trainer_Lucas_avatar_5987325d.png';

interface TrainerDashboardProps {
  trainer: {
    name: string;
    avatar?: string;
  };
}

export default function TrainerDashboard({ trainer }: TrainerDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  //todo: remove mock functionality 
  const mockStats = {
    activeStudents: 24,
    weeklyWorkouts: 156,
    avgAdherence: 87,
    pendingEvaluations: 3
  };

  const mockStudents = [
    {
      id: "1",
      name: "Maria Silva",
      lastWorkout: "Hoje",
      adherence: 95,
      status: "active",
      avatar: undefined,
      alerts: []
    },
    {
      id: "2", 
      name: "João Santos",
      lastWorkout: "2 dias atrás",
      adherence: 75,
      status: "warning",
      avatar: undefined,
      alerts: ["Baixa adesão"]
    },
    {
      id: "3",
      name: "Ana Costa",
      lastWorkout: "Hoje",
      adherence: 92,
      status: "active", 
      avatar: undefined,
      alerts: []
    },
    {
      id: "4",
      name: "Pedro Lima",
      lastWorkout: "5 dias atrás",
      adherence: 45,
      status: "inactive",
      avatar: undefined,
      alerts: ["Inativo há 5 dias", "Baixa adesão"]
    }
  ];

  const mockRecentActivities = [
    { student: "Maria Silva", action: "Completou Treino A", time: "30 min atrás" },
    { student: "João Santos", action: "Pergunta sobre execução", time: "2h atrás" },
    { student: "Ana Costa", action: "Novo PR no supino", time: "4h atrás" },
    { student: "Carlos Mendes", action: "Avaliação agendada", time: "1d atrás" }
  ];

  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'inactive': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'warning': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Atenção</Badge>;
      case 'inactive': return <Badge variant="destructive">Inativo</Badge>;
      default: return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={trainerAvatar} alt={trainer.name} />
              <AvatarFallback>{trainer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold">Painel do Personal - {trainer.name}</h1>
              <p className="text-muted-foreground">Gestão completa de alunos e treinos</p>
            </div>
          </div>
          <Button data-testid="button-add-student">
            <Plus className="w-4 h-4 mr-2" />
            Novo Aluno
          </Button>
        </div>
      </div>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" data-testid="tab-overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="students" data-testid="tab-students">Alunos</TabsTrigger>
            <TabsTrigger value="workouts" data-testid="tab-workouts">Treinos</TabsTrigger>
            <TabsTrigger value="analytics" data-testid="tab-analytics">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="p-4">
                  <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{mockStats.activeStudents}</div>
                  <div className="text-sm text-muted-foreground">Alunos ativos</div>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-4">
                  <Activity className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{mockStats.weeklyWorkouts}</div>
                  <div className="text-sm text-muted-foreground">Treinos semanais</div>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-4">
                  <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{mockStats.avgAdherence}%</div>
                  <div className="text-sm text-muted-foreground">Adesão média</div>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-4">
                  <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{mockStats.pendingEvaluations}</div>
                  <div className="text-sm text-muted-foreground">Avaliações pendentes</div>
                </CardContent>
              </Card>
            </div>

            {/* Alerts & Important */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Alertas Importantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div className="flex-1">
                      <div className="font-medium">Pedro Lima inativo há 5 dias</div>
                      <div className="text-sm text-muted-foreground">Última sessão: 14/09/2025</div>
                    </div>
                    <Button size="sm" variant="outline" data-testid="button-contact-pedro">
                      Contatar
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    <div className="flex-1">
                      <div className="font-medium">3 reavaliações físicas vencidas</div>
                      <div className="text-sm text-muted-foreground">Agendar reavaliações</div>
                    </div>
                    <Button size="sm" variant="outline" data-testid="button-schedule-evaluations">
                      Agendar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockRecentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{activity.student.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{activity.student}</div>
                        <div className="text-sm text-muted-foreground">{activity.action}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar alunos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-students"
              />
            </div>

            {/* Students List */}
            <div className="grid gap-4">
              {filteredStudents.map((student) => (
                <Card key={student.id} className="hover-elevate">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{student.name}</h3>
                          {getStatusBadge(student.status)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Último treino: {student.lastWorkout} • Adesão: {student.adherence}%
                        </div>
                        {student.alerts.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {student.alerts.map((alert, index) => (
                              <Badge key={index} variant="destructive" className="text-xs">
                                {alert}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" data-testid={`button-view-${student.id}`}>
                          Ver Perfil
                        </Button>
                        <Button size="sm" data-testid={`button-message-${student.id}`}>
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="workouts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Biblioteca de Treinos</CardTitle>
                <CardDescription>
                  Crie e gerencie treinos personalizados para seus alunos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Criador de Treinos</h3>
                  <p className="text-muted-foreground mb-4">
                    Monte treinos personalizados com nossa biblioteca de exercícios
                  </p>
                  <Button data-testid="button-create-workout">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Novo Treino
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios e Analytics</CardTitle>
                <CardDescription>
                  Acompanhe o progresso dos seus alunos com dados detalhados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Analytics Avançado</h3>
                  <p className="text-muted-foreground mb-4">
                    Visualize dados de performance, adesão e progresso
                  </p>
                  <Button data-testid="button-view-analytics">
                    Ver Relatórios Completos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}