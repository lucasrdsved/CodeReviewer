import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, User } from "lucide-react";

interface LoginFormProps {
  onLogin: (userType: 'student' | 'trainer', email: string, password: string) => Promise<{ data?: any; error?: any }>;
}

function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showTrainerLogin, setShowTrainerLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log('Form submitted');

    const userType = showTrainerLogin ? 'trainer' : 'student';
    const result = await onLogin(userType, email, password);

    if (result.error) {
      setError(result.error.message || 'Erro ao fazer login');
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bem-vindo!</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {showTrainerLogin ? 'Acesse o painel do treinador' : 'Inicie seu aprendizado'}
          </p>
        </div>

        {showTrainerLogin ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="trainer-email">E-mail</Label>
              <Input
                id="trainer-email"
                type="email"
                placeholder="lucas@athletica.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="input-trainer-email"
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

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              data-testid="button-trainer-login"
              disabled={loading}
            >
              <User className="w-4 h-4 mr-2" />
              {loading ? 'Entrando...' : 'Acessar Painel'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="input-email"
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

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover-elevate"
              size="lg"
              data-testid="button-login"
              disabled={loading}
            >
              <Play className="w-4 h-4 mr-2" />
              {loading ? 'Entrando...' : 'Iniciar Treino'}
            </Button>
          </form>
        )}

        <div className="text-center space-y-3">
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-3">Ou teste a aplicação:</p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => onLogin('student', 'demo-student@athletica.com', 'demo123')}
                variant="outline"
                size="sm"
                data-testid="button-demo-student"
                disabled={loading}
              >
                <User className="w-4 h-4 mr-2" />
                Demo Estudante
              </Button>
              <Button
                onClick={() => onLogin('trainer', 'demo-trainer@athletica.com', 'demo123')}
                variant="outline"
                size="sm"
                data-testid="button-demo-trainer"
                disabled={loading}
              >
                <User className="w-4 h-4 mr-2" />
                Demo Treinador
              </Button>
            </div>
          </div>
          
          <button
            onClick={() => setShowTrainerLogin(!showTrainerLogin)}
            className="text-sm text-primary hover:underline"
            data-testid="toggle-login-mode"
          >
            {showTrainerLogin ? 'É um estudante? Clique aqui para entrar.' : 'É um treinador? Clique aqui para acessar o painel.'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;