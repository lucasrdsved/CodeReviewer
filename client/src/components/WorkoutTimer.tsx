import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import ProgressRing from "./ProgressRing";

interface WorkoutTimerProps {
  duration: number; // seconds
  onComplete?: () => void;
  autoStart?: boolean;
  title?: string;
}

export default function WorkoutTimer({ 
  duration, 
  onComplete, 
  autoStart = false,
  title = "Descanso entre séries"
}: WorkoutTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsRunning(false);
            onComplete?.();
            if (soundEnabled) {
              console.log('Timer completed - would play completion sound');
            }
            return 0;
          }
          
          // Play countdown beeps for last 5 seconds
          if (time <= 5 && soundEnabled) {
            console.log(`Countdown beep: ${time - 1}`);
          }
          
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete, soundEnabled]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  const handlePlayPause = () => {
    console.log('Timer play/pause triggered');
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    console.log('Timer reset triggered');
    setTimeLeft(duration);
    setIsRunning(false);
  };

  const toggleSound = () => {
    console.log('Sound toggle triggered');
    setSoundEnabled(!soundEnabled);
  };

  const getTimerColor = () => {
    if (timeLeft <= 5) return "text-destructive";
    if (timeLeft <= 15) return "text-warning";
    return "text-foreground";
  };

  return (
    <Card className="p-6 text-center space-y-4">
      <h3 className="text-lg font-semibold text-muted-foreground">{title}</h3>
      
      <ProgressRing progress={progress} size={160}>
        <div className="text-center">
          <div className={`text-4xl font-bold ${getTimerColor()}`}>
            {formatTime(timeLeft)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {timeLeft === 0 ? "Concluído!" : isRunning ? "Em execução" : "Pausado"}
          </div>
        </div>
      </ProgressRing>

      <div className="flex justify-center gap-3">
        <Button
          size="icon"
          variant="outline"
          onClick={handlePlayPause}
          data-testid="button-timer-play-pause"
          className="h-12 w-12"
        >
          {isRunning ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>
        
        <Button
          size="icon"
          variant="outline"
          onClick={handleReset}
          data-testid="button-timer-reset"
          className="h-12 w-12"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
        
        <Button
          size="icon"
          variant="outline"
          onClick={toggleSound}
          data-testid="button-timer-sound"
          className="h-12 w-12"
        >
          {soundEnabled ? (
            <Volume2 className="h-5 w-5" />
          ) : (
            <VolumeX className="h-5 w-5" />
          )}
        </Button>
      </div>

      {timeLeft <= 5 && timeLeft > 0 && (
        <div className="text-sm text-destructive font-medium animate-pulse">
          Prepare-se para o próximo exercício!
        </div>
      )}
    </Card>
  );
}