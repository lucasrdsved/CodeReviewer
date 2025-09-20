import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Play, User } from "lucide-react";

interface LoginFormProps {
  onLogin: (userType: 'student' | 'trainer', username: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showTrainerLogin, setShowTrainerLogin] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempted', { username, userType: showTrainerLogin ? 'trainer' : 'student' });
    onLogin(showTrainerLogin ? 'trainer' : 'student', username);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {!showTrainerLogin ? (
          <>
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Bem-vindo de volta!</CardTitle>
                <CardDescription>
                  Entre para acessar seus treinos personalizados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Usuário ou Email</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Digite seu usuário"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      data-testid="input-username"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      data-testid="input-password"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover-elevate"
                    size="lg"
                    data-testid="button-login"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar Treino
                  </Button>
                </form>
                
                <div className="mt-4 space-y-2 text-center">
                  <Button variant="ghost" className="text-sm text-muted-foreground">
                    Esqueci minha senha
                  </Button>
                  <Button variant="ghost" className="text-sm text-muted-foreground">
                    Primeiro acesso?
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-center">
              <Button 
                variant="ghost" 
                className="text-xs text-muted-foreground"
                onClick={() => setShowTrainerLogin(true)}
                data-testid="link-trainer-login"
              >
                Acesso do Personal (Lucas)
              </Button>
            </div>
          </>
        ) : (
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Painel do Personal</CardTitle>
              <CardDescription>
                Acesso administrativo para gestão de alunos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="trainer-username">Usuário</Label>
                  <Input
                    id="trainer-username"
                    type="text"
                    placeholder="lucas"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    data-testid="input-trainer-username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trainer-password">Senha</Label>
                  <Input
                    id="trainer-password"
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    data-testid="input-trainer-password"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  size="lg"
                  data-testid="button-trainer-login"
                >
                  <User className="w-4 h-4 mr-2" />
                  Acessar Painel
                </Button>
              </form>
              
              <Separator className="my-4" />
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowTrainerLogin(false)}
                data-testid="button-back-to-student"
              >
                Voltar para login de aluno
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}