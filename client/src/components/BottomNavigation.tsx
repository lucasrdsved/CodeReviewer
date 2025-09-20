import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Activity, 
  TrendingUp, 
  MessageCircle, 
  User,
  Users,
  Calendar,
  BarChart3
} from "lucide-react";

interface BottomNavigationProps {
  userType: 'student' | 'trainer';
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadMessages?: number;
}

export default function BottomNavigation({ 
  userType, 
  activeTab, 
  onTabChange, 
  unreadMessages = 0 
}: BottomNavigationProps) {
  const studentTabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'workouts', label: 'Treinos', icon: Activity },
    { id: 'progress', label: 'Progresso', icon: TrendingUp },
    { id: 'chat', label: 'Chat', icon: MessageCircle, badge: unreadMessages },
    { id: 'profile', label: 'Perfil', icon: User }
  ];

  const trainerTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'students', label: 'Alunos', icon: Users },
    { id: 'workouts', label: 'Treinos', icon: Activity },
    { id: 'schedule', label: 'Agenda', icon: Calendar },
    { id: 'analytics', label: 'Relatórios', icon: BarChart3 }
  ];

  const tabs = userType === 'student' ? studentTabs : trainerTabs;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              className={`flex flex-col gap-1 h-16 px-3 relative ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => {
                console.log('Tab changed to:', tab.id);
                onTabChange(tab.id);
              }}
              data-testid={`nav-${tab.id}`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                {'badge' in tab && tab.badge && tab.badge > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
                  >
                    {'badge' in tab && tab.badge > 99 ? '99+' : 'badge' in tab ? tab.badge : 0}
                  </Badge>
                )}
              </div>
              <span className={`text-xs ${isActive ? 'text-primary font-medium' : ''}`}>
                {tab.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}