import { useState } from 'react';
import BottomNavigation from '../BottomNavigation';

export default function BottomNavigationExample() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Navegação do Aluno</h3>
        <div className="relative h-20 bg-muted/20 rounded-lg">
          <BottomNavigation 
            userType="student"
            activeTab={activeTab}
            onTabChange={setActiveTab}
            unreadMessages={3}
          />
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Navegação do Personal</h3>
        <div className="relative h-20 bg-muted/20 rounded-lg">
          <BottomNavigation 
            userType="trainer"
            activeTab="dashboard"
            onTabChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
}