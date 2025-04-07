import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield, XCircle, AlarmClock, Music2 } from "lucide-react";
import { SoundCloudPlayer } from "@/components/SoundCloudPlayer";
import { MathProblem } from "@/lib/types";
import { generateMathProblem } from "@/lib/utils";

interface AlarmModalProps {
  isOpen: boolean;
  onSnooze: () => void;
  onDismiss: () => void;
  alarmLabel?: string;
  alarmTime?: string;
  soundCloudUrl?: string;
}

export function AlarmModal({ 
  isOpen, 
  onSnooze, 
  onDismiss,
  alarmLabel = "Wake Up",
  alarmTime = "6:30 AM",
  soundCloudUrl = ""
}: AlarmModalProps) {
  const [mathProblem] = useState<MathProblem>(() => generateMathProblem(2));
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Add pulse animation effect
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setIsAnimating(prev => !prev);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === mathProblem.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      // Wait a moment before moving to the next step
      setTimeout(() => {
        onDismiss();
      }, 1000);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className={`bg-card shadow-lg shadow-primary/20 rounded-xl p-6 w-full max-w-md border border-primary/30 ${isAnimating ? 'animate-pulse' : ''}`}>
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <AlarmClock className="h-12 w-12 text-primary animate-bounce" />
          </div>
          <h2 className="text-3xl text-card-foreground font-bold mb-2">{alarmLabel}</h2>
          <div className="text-4xl font-mono text-primary mb-2">{alarmTime}</div>
          <p className="text-muted-foreground">Complete the challenge to dismiss alarm</p>
        </div>
        
        {/* SoundCloud Player - only show if URL is provided */}
        {soundCloudUrl && (
          <div className="bg-background rounded-xl p-4 mb-6 border border-muted">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-card-foreground font-medium flex items-center">
                <Music2 className="h-4 w-4 mr-2 text-primary" /> 
                Wake Up Music
              </h3>
            </div>
            <SoundCloudPlayer 
              playlistUrl={soundCloudUrl}
              autoPlay={true}
              className="w-full h-24 mb-2"
            />
          </div>
        )}

        {/* Math Challenge */}
        <div className="bg-background rounded-xl p-5 mb-6 border border-muted">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-card-foreground font-medium">Math Challenge</h3>
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Level 2</span>
          </div>
          
          <p className="text-xl text-card-foreground text-center font-mono mb-4">{mathProblem.question}</p>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            {mathProblem.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === option 
                  ? (isCorrect ? "default" : "destructive") 
                  : "secondary"}
                onClick={() => handleAnswerSelect(option)}
                className={`py-2 rounded-lg text-lg ${selectedAnswer === option && isCorrect ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                disabled={selectedAnswer !== null}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            className="flex-1 border-primary/50"
            onClick={onSnooze}
          >
            <AlarmClock className="h-4 w-4 mr-2" /> Snooze (5m)
          </Button>
          <Button 
            variant="default" 
            className="flex-1 bg-primary hover:bg-primary/80 flex items-center justify-center"
            disabled={isCorrect !== true}
            onClick={onDismiss}
          >
            <Shield className="h-4 w-4 mr-2" /> Start Scan
          </Button>
        </div>
      </div>
    </div>
  );
}
