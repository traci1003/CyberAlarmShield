import React from "react";
import { Button } from "@/components/ui/button";
import { SecurityTip } from "./SecurityTip";

interface ScanResultModalProps {
  isOpen: boolean;
  securityScore: number;
  issuesFound: number;
  securityTip: string;
  onDismiss: () => void;
}

export function ScanResultModal({
  isOpen,
  securityScore,
  issuesFound,
  securityTip,
  onDismiss,
}: ScanResultModalProps) {
  if (!isOpen) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-status-safe";
    if (score >= 60) return "text-status-warning";
    return "text-status-danger";
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl p-6 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-status-safe/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-shield-check-line text-status-safe text-3xl"></i>
          </div>
          <h2 className="text-2xl text-card-foreground font-bold mb-2">
            Morning Security Scan Complete
          </h2>
          <p className="text-muted-foreground">
            Your device is secure and ready for the day
          </p>
        </div>

        {/* Security Summary */}
        <div className="bg-background rounded-xl p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Security Score</p>
              <p className={`text-2xl ${getScoreColor(securityScore)} font-bold`}>
                {securityScore}
                <span className="text-sm">/100</span>
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Issues Found</p>
              <p className="text-2xl text-card-foreground font-bold">{issuesFound}</p>
            </div>
          </div>
        </div>

        {/* Security Tip */}
        <SecurityTip tip={securityTip} />

        <Button 
          className="w-full bg-primary hover:bg-primary-light text-white py-3 rounded-lg"
          onClick={onDismiss}
        >
          Start Your Day
        </Button>
      </div>
    </div>
  );
}
