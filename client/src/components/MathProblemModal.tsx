import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { MathProblem } from "@/lib/types";
import { generateMathProblem } from "@/lib/utils";

interface MathProblemModalProps {
  isOpen: boolean;
  level?: number;
  problemCount?: number;
  onComplete: () => void;
  onCancel: () => void;
}

export function MathProblemModal({
  isOpen,
  level = 1,
  problemCount = 3,
  onComplete,
  onCancel
}: MathProblemModalProps) {
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [remainingTime, setRemainingTime] = useState(15); // 15 seconds per problem
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Generate math problems on mount
  useEffect(() => {
    if (isOpen) {
      const newProblems = Array.from({ length: problemCount }, () => generateMathProblem(level));
      setProblems(newProblems);
      setCurrentProblemIndex(0);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setRemainingTime(15);
      setCorrectAnswers(0);
    }
  }, [isOpen, level, problemCount]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || isCorrect !== null) return;

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleNextProblem(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, currentProblemIndex, isCorrect]);

  const handleAnswerSelect = (answer: string) => {
    const currentProblem = problems[currentProblemIndex];
    const correct = answer === currentProblem.correctAnswer;
    
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    
    if (correct) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    // Move to next problem after a short delay
    setTimeout(() => {
      handleNextProblem(correct);
    }, 1000);
  };

  const handleNextProblem = (wasCorrect: boolean) => {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setRemainingTime(15);
    } else {
      // All problems completed
      const passingScore = Math.ceil(problemCount / 2); // Need at least half correct
      if (correctAnswers + (wasCorrect ? 1 : 0) >= passingScore) {
        onComplete();
      } else {
        // Regenerate problems if failed
        const newProblems = Array.from({ length: problemCount }, () => generateMathProblem(level));
        setProblems(newProblems);
        setCurrentProblemIndex(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setRemainingTime(15);
        setCorrectAnswers(0);
      }
    }
  };

  if (!isOpen || problems.length === 0) {
    return null;
  }

  const currentProblem = problems[currentProblemIndex];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Math Problem Challenge</DialogTitle>
          <DialogDescription>
            Solve {problemCount} math problems to dismiss the alarm.
            Problem {currentProblemIndex + 1} of {problemCount}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {/* Timer */}
          <div className="mb-4 flex justify-between items-center">
            <div className="text-sm">
              Time: <span className={remainingTime < 5 ? "text-destructive font-bold" : ""}>{remainingTime}s</span>
            </div>
            <div className="text-sm">
              Correct: {correctAnswers}/{currentProblemIndex}
            </div>
          </div>

          {/* Question */}
          <div className="text-2xl font-bold text-center my-6">
            {currentProblem.question}
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {currentProblem.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === option 
                  ? isCorrect 
                    ? "default" 
                    : "destructive" 
                  : "outline"}
                className={`text-lg h-14 ${
                  selectedAnswer === option && isCorrect ? "bg-green-600 hover:bg-green-700" : ""
                } ${selectedAnswer && selectedAnswer !== option ? "opacity-50" : ""}`}
                onClick={() => !selectedAnswer && handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            I give up, let me snooze
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}