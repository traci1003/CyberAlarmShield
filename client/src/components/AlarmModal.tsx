import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MathProblem } from "@/lib/types";
import { generateMathProblem } from "@/lib/utils";

interface AlarmModalProps {
  isOpen: boolean;
  onSnooze: () => void;
  onDismiss: () => void;
}

export function AlarmModal({ isOpen, onSnooze, onDismiss }: AlarmModalProps) {
  const [mathProblem] = useState<MathProblem>(() => generateMathProblem(2));
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
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
    <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl p-6 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl text-card-foreground font-bold mb-2">Time to wake up!</h2>
          <p className="text-muted-foreground">Complete the challenge to dismiss alarm</p>
        </div>
        
        {/* Security Challenge */}
        <div className="bg-background rounded-xl p-5 mb-6">
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
                  ? (isCorrect ? "success" : "destructive") 
                  : "secondary"}
                onClick={() => handleAnswerSelect(option)}
                className="py-2 rounded-lg"
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
            className="flex-1"
            onClick={onSnooze}
          >
            Snooze (5m)
          </Button>
          <Button 
            variant="default" 
            className="flex-1 bg-primary hover:bg-primary-light flex items-center justify-center"
            disabled={isCorrect !== true}
            onClick={onDismiss}
          >
            <i className="ri-shield-keyhole-line mr-2"></i> Start Scan
          </Button>
        </div>
      </div>
    </div>
  );
}
