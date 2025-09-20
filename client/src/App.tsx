import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Import all main components
import LoginForm from "./components/LoginForm";
import StudentDashboard from "./components/StudentDashboard";
import TrainerDashboard from "./components/TrainerDashboard";
import BottomNavigation from "./components/BottomNavigation";
import WorkoutPlayer from "./components/WorkoutPlayer";
import ChatInterface from "./components/ChatInterface";
import WelcomeHeader from "./components/WelcomeHeader";

// Types
type UserType = 'student' | 'trainer' | null;
type AppView = 'login' | 'dashboard' | 'workout' | 'chat' | 'profile' | 'students' | 'analytics';

interface User {
  name: string;
  avatar?: string;
  type: UserType;
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<AppView>('login');
  const [activeTab, setActiveTab] = useState('home');

  // Handle login from LoginForm
  const handleLogin = (userType: 'student' | 'trainer', username: string) => {
    console.log('Login successful:', { userType, username });
    
    const userData: User = {
      name: userType === 'trainer' ? 'Lucas' : username,
      type: userType,
      avatar: undefined
    };
    
    setCurrentUser(userData);
    setActiveView('dashboard');
    setActiveTab(userType === 'student' ? 'home' : 'dashboard');
  };

  // Handle logout
  const handleLogout = () => {
    console.log('Logout triggered');
    setCurrentUser(null);
    setActiveView('login');
    setActiveTab('home');
  };

  // Handle navigation
  const handleTabChange = (tab: string) => {
    console.log('Navigation tab changed:', tab);
    setActiveTab(tab);
    
    // Map tab to view
    switch (tab) {
      case 'home':
      case 'dashboard':
        setActiveView('dashboard');
        break;
      case 'chat':
        setActiveView('chat');
        break;
      case 'students':
        setActiveView('students');
        break;
      case 'analytics':
        setActiveView('analytics');
        break;
      default:
        setActiveView('dashboard');
    }
  };

  const handleStartWorkout = (workoutId: string) => {
    console.log('Starting workout from dashboard:', workoutId);
    setActiveView('workout');
  };

  // Render current view content
  const renderMainContent = () => {
    if (!currentUser) {
      return <LoginForm onLogin={handleLogin} />;
    }

    switch (activeView) {
      case 'chat':
        const otherUser = currentUser.type === 'student' 
          ? { name: 'Lucas', status: 'online' as const }
          : { name: 'Maria Silva', status: 'online' as const };
        
        return (
          <div className="p-4 max-w-md mx-auto">
            <ChatInterface 
              currentUser={currentUser.type}
              otherUser={otherUser}
            />
          </div>
        );

      case 'dashboard':
        if (currentUser.type === 'trainer') {
          return <TrainerDashboard trainer={currentUser} />;
        } else {
          return (
            <StudentDashboard 
              student={currentUser}
              onStartWorkout={handleStartWorkout}
            />
          );
        }

      case 'students':
        if (currentUser.type === 'trainer') {
          return <TrainerDashboard trainer={currentUser} />;
        }
        break;

      case 'analytics':
        if (currentUser.type === 'trainer') {
          return <TrainerDashboard trainer={currentUser} />;
        }
        break;

      default:
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Athletica Pro</h2>
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          </div>
        );
    }
  };

  // Show bottom navigation for logged in users (except on workout view)
  const showBottomNav = currentUser && activeView !== 'workout' && activeView !== 'login';

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          {/* Header for logged-in users */}
          {currentUser && activeView !== 'login' && (
            <div className="sticky top-0 z-40 bg-background border-b">
              <WelcomeHeader />
            </div>
          )}

          {/* Main Content */}
          <main className={`${showBottomNav ? 'pb-20' : ''}`}>
            {renderMainContent()}
          </main>

          {/* Bottom Navigation */}
          {showBottomNav && currentUser && (
            <BottomNavigation
              userType={currentUser.type}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              unreadMessages={3} // todo: replace with real data
            />
          )}

          {/* PWA Install Button - Fixed position */}
          {currentUser && (
            <div className="fixed top-4 right-4 z-50">
              <button
                onClick={() => {
                  console.log('PWA install prompt would trigger here');
                  // PWA install logic would go here
                }}
                className="bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium shadow-lg hover-elevate"
                data-testid="button-install-pwa"
              >
                📱 Instalar App
              </button>
            </div>
          )}

          {/* Debug Panel - Only in development */}
          {import.meta.env.DEV && currentUser && (
            <div className="fixed bottom-4 left-4 bg-background border rounded-lg p-3 shadow-lg text-xs space-y-2 z-40">
              <div className="font-semibold">Debug Info</div>
              <div>User: {currentUser.name} ({currentUser.type})</div>
              <div>View: {activeView}</div>
              <div>Tab: {activeTab}</div>
              <button
                onClick={handleLogout}
                className="text-destructive hover:underline"
                data-testid="button-debug-logout"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;