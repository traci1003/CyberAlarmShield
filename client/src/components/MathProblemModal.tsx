import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { BrainCircuit, Shield, AlarmClock, CircleAlert, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
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
  level = 2,
  problemCount = 3,
  onComplete,
  onCancel
}: MathProblemModalProps) {
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [remainingTime, setRemainingTime] = useState(20); // 20 seconds per problem
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showSecurityTip, setShowSecurityTip] = useState(false);
  const [securityTip, setSecurityTip] = useState("");

  // Array of cybersecurity tips to show between problems
  const securityTips = [
    "Always use two-factor authentication when available.",
    "Update your device software regularly to patch security vulnerabilities.",
    "Use unique passwords for different accounts and consider a password manager.",
    "Be cautious of suspicious emails and never click on unknown links.",
    "Regularly scan your device for malware and security threats.",
    "Back up your important data regularly to prevent loss from ransomware.",
    "Use a VPN when connecting to public Wi-Fi networks.",
    "Check app permissions regularly and remove unnecessary access."
  ];

  // Generate math problems on mount
  useEffect(() => {
    if (isOpen) {
      const newProblems = Array.from({ length: problemCount }, () => generateMathProblem(level));
      setProblems(newProblems);
      setCurrentProblemIndex(0);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setRemainingTime(20);
      setCorrectAnswers(0);
      setShowSecurityTip(false);
      
      // Set a random security tip
      const randomTip = securityTips[Math.floor(Math.random() * securityTips.length)];
      setSecurityTip(randomTip);
    }
  }, [isOpen, level, problemCount]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || isCorrect !== null || showSecurityTip) return;

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
  }, [isOpen, currentProblemIndex, isCorrect, showSecurityTip]);

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
      // If this isn't the last problem and answer was correct, show security tip
      if (currentProblemIndex < problems.length - 1 && correct) {
        setShowSecurityTip(true);
        // Auto-advance after 5 seconds
        setTimeout(() => {
          setShowSecurityTip(false);
          handleNextProblem(correct);
        }, 5000);
      } else {
        handleNextProblem(correct);
      }
    }, 1000);
  };

  const handleNextProblem = (wasCorrect: boolean) => {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setRemainingTime(20);
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
        setRemainingTime(20);
        setCorrectAnswers(0);
        setShowSecurityTip(false);
      }
    }
  };

  if (!isOpen || problems.length === 0) {
    return null;
  }

  const currentProblem = problems[currentProblemIndex];
  const timePercentage = (remainingTime / 20) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md border-primary/30 data-stream">
        <DialogHeader className="space-y-2">
          <div className="flex items-center justify-center mb-2">
            {showSecurityTip ? (
              <Shield className="h-10 w-10 text-primary" />
            ) : (
              <BrainCircuit className="h-10 w-10 text-primary" />
            )}
          </div>
          <DialogTitle className="text-center text-xl">
            {showSecurityTip ? "Security Tip" : "Wake Up Challenge"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {showSecurityTip ? (
              "Learn while you wake up!"
            ) : (
              <>
                Solve {problemCount} math problems to dismiss the alarm.
                <div className="mt-1 text-sm font-medium">
                  Problem {currentProblemIndex + 1} of {problemCount}
                </div>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {showSecurityTip ? (
          <div className="py-6 scanning-element">
            <div className="bg-card p-4 rounded-lg border border-primary/20 mb-4">
              <p className="text-center text-lg mb-2">{securityTip}</p>
              <div className="text-center text-muted-foreground text-sm mt-4">
                Moving to next problem in a few seconds...
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4">
            {/* Timer */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm flex items-center">
                  <AlarmClock className="h-4 w-4 mr-1" />
                  <span className={remainingTime < 5 ? "text-destructive font-bold" : ""}>{remainingTime}s</span>
                </div>
                <div className="text-sm">
                  Score: <span className="font-medium">{correctAnswers}/{currentProblemIndex}</span>
                </div>
              </div>
              <Progress 
                value={timePercentage} 
                className="h-2" 
                indicatorClassName={
                  timePercentage > 60 ? 'bg-primary' : 
                  timePercentage > 30 ? 'bg-yellow-500' : 
                  'bg-red-500'
                } 
              />
            </div>

            {/* Question */}
            <div className="text-2xl font-mono text-center my-6 cyber-glow px-4 py-2 bg-background rounded-lg">
              {currentProblem.question}
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3 mb-2">
              {currentProblem.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === option 
                    ? isCorrect 
                      ? "default" 
                      : "destructive" 
                    : "outline"}
                  className={`text-lg h-14 font-mono ${
                    selectedAnswer === option && isCorrect ? 'bg-green-600 hover:bg-green-700 text-white' : ''
                  } ${selectedAnswer && selectedAnswer !== option ? "opacity-50" : ""}`}
                  onClick={() => !selectedAnswer && handleAnswerSelect(option)}
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="flex sm:justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Shield className="h-4 w-4 mr-1" /> 
            <span>Level {level} difficulty</span>
          </div>
          <Button variant="outline" onClick={onCancel} className="border-primary/30">
            <AlarmClock className="h-4 w-4 mr-2" /> Snooze Alarm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}