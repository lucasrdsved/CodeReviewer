
import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
// Demo mode - no Supabase required
// import { supabase } from "@/lib/supabase";
// import type { Session } from '@supabase/supabase-js';

// Import all main components
import LoginForm from "./components/examples/LoginForm";
import StudentDashboard from "./components/examples/StudentDashboard";
import TrainerDashboard from "./components/examples/TrainerDashboard";
import BottomNavigation from "./components/examples/BottomNavigation";
import WorkoutPlayer from "./components/examples/WorkoutPlayer";
import ChatInterface from "./components/examples/ChatInterface";
import WelcomeHeader from "./components/examples/WelcomeHeader";

// Types
type UserType = 'student' | 'trainer' | null;
type AppView = 'login' | 'dashboard' | 'workout' | 'chat' | 'profile' | 'students' | 'analytics';

interface User {
  name: string;
  avatar?: string;
  type: UserType;
}

function App() {
  // Demo mode - simplified state management
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<AppView>('login');
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false); // No loading for demo

  // Demo mode - no Supabase authentication needed
  useEffect(() => {
    // Demo is ready immediately
    setLoading(false);
  }, []);

  // Handle login - Demo mode only
  const handleLogin = async (userType: 'student' | 'trainer', email: string, password: string) => {
    console.log('Demo login attempt:', { userType, email });
    
    // Demo mode - all logins work as demo accounts
    const mockUser: User = {
      name: userType === 'student' ? 'Maria Silva (Demo)' : 'Lucas Personal (Demo)',
      type: userType,
      avatar: undefined
    };
    
    setCurrentUser(mockUser);
    setActiveView('dashboard');
    setActiveTab('home');
    
    console.log('Demo login successful:', mockUser);
    return { data: { user: mockUser }, error: null };
  };

  // Handle logout - Demo mode
  const handleLogout = async () => {
    console.log('Demo logout triggered');
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

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Athletica Pro</h2>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Render current view content - Demo mode
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
              currentUser={currentUser.type as 'student' | 'trainer'}
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

      case 'workout':
        return <WorkoutPlayer />;

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

  // Show bottom navigation for logged in users (except on workout view) - Demo mode
  const showBottomNav = currentUser && activeView !== 'workout' && activeView !== 'login';

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          {/* Header for logged-in users - Demo mode */}
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
              userType={currentUser.type as 'student' | 'trainer'}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              unreadMessages={3} // todo: replace with real data
            />
          )}

          {/* PWA Install Button - Fixed position - Demo mode */}
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

          {/* Debug Panel - Only in development - Demo mode */}
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
