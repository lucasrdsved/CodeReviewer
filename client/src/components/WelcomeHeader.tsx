import { Activity } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function WelcomeHeader() {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-2">
        <Activity className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Athletica Pro</h1>
      </div>
      <div className="flex items-center space-x-2">
        <ThemeToggle />
      </div>
    </header>
  );
}