import React from "react";
import { getStatusColorClass, calculateStrokeDashoffset } from "@/lib/utils";

interface SecurityScoreProps {
  score: number;
  statusText?: string;
  lastUpdated?: string;
  appStatus?: string;
  networkStatus?: string;
  privacyStatus?: string;
  systemStatus?: string;
}

export function SecurityScore({ 
  score, 
  statusText = "SECURE", 
  lastUpdated,
  appStatus = "safe",
  networkStatus = "safe",
  privacyStatus = "safe",
  systemStatus = "safe"
}: SecurityScoreProps) {
  const scoreColorClass = getStatusColorClass(score);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = calculateStrokeDashoffset(score, circumference);
  
  const getStatusColor = (status: string) => {
    return status === 'safe' ? 'bg-status-safe' : (status === 'warning' ? 'bg-status-warning' : 'bg-status-danger');
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-6">
      {/* SVG Circle Progress */}
      <div className="relative w-44 h-44 mb-2">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#282828" strokeWidth="8" />
          <circle 
            className="score-circle" 
            cx="50" 
            cy="50" 
            r={radius} 
            fill="transparent" 
            stroke={score >= 80 ? "#4CAF50" : (score >= 60 ? "#FFC107" : "#F44336")} 
            strokeWidth="8" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round" 
          />
          <text 
            x="50" 
            y="50" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            className="text-clock text-3xl font-bold text-white"
          >
            {score}
          </text>
          <text 
            x="50" 
            y="65" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            className="text-sm text-muted-foreground"
          >
            {statusText}
          </text>
        </svg>
      </div>
      <h2 className="text-lg font-medium text-card-foreground mb-1">Device Health Score</h2>
      {lastUpdated && <p className="text-sm text-muted-foreground mb-4">Last updated: {lastUpdated}</p>}
      
      {/* Security Status Summary */}
      <div className="flex justify-between w-full max-w-xs mb-2">
        <div className="flex flex-col items-center">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(appStatus)} mb-1`}></div>
          <p className="text-xs text-muted-foreground">Apps</p>
        </div>
        <div className="flex flex-col items-center">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(networkStatus)} mb-1`}></div>
          <p className="text-xs text-muted-foreground">Network</p>
        </div>
        <div className="flex flex-col items-center">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(privacyStatus)} mb-1`}></div>
          <p className="text-xs text-muted-foreground">Privacy</p>
        </div>
        <div className="flex flex-col items-center">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(systemStatus)} mb-1`}></div>
          <p className="text-xs text-muted-foreground">System</p>
        </div>
      </div>
    </div>
  );
}
