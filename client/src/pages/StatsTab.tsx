import React from "react";
import { useSecurity } from "@/hooks/useSecurity";
import { formatTime, formatAmPm } from "@/lib/utils";

export default function StatsTab() {
  const { scanHistory, historyLoading } = useSecurity();
  
  // Generate mock weekly score data for demonstration
  const weeklyScores = [
    { day: "Mon", score: 70 },
    { day: "Tue", score: 85 },
    { day: "Wed", score: 65 },
    { day: "Thu", score: 45 },
    { day: "Fri", score: 75 },
    { day: "Sat", score: 80 },
    { day: "Sun", score: 75 }
  ];
  
  // Security drill performance
  const drillPerformance = {
    mathProblems: 92,
    phishingDrills: 85
  };
  
  if (historyLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Loading statistics...</p>
      </div>
    );
  }
  
  return (
    <div className="h-full">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-foreground mb-4">Security History</h2>
        
        {/* Weekly Score Chart */}
        <div className="bg-card rounded-xl p-4 mb-6">
          <h3 className="text-card-foreground font-medium mb-3">Weekly Security Score</h3>
          <div className="h-40 flex items-end justify-between px-2">
            {weeklyScores.map((item, index) => (
              <div key={index} className="flex flex-col items-center w-1/7">
                <div 
                  className={`rounded-t-sm ${item.score < 50 ? 'bg-status-warning' : 'bg-primary'} w-8`} 
                  style={{ height: `${item.score}%` }}
                ></div>
                <p className="text-xs text-muted-foreground mt-2">{item.day}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Security Challenge Stats */}
        <div className="bg-card rounded-xl p-4 mb-6">
          <h3 className="text-card-foreground font-medium mb-3">Security Drills Performance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background rounded-lg p-3 text-center">
              <p className="text-sm text-muted-foreground mb-1">Math Problems</p>
              <p className="text-2xl text-foreground font-semibold">{drillPerformance.mathProblems}%</p>
              <p className="text-xs text-muted-foreground">Success Rate</p>
            </div>
            <div className="bg-background rounded-lg p-3 text-center">
              <p className="text-sm text-muted-foreground mb-1">Phishing Drills</p>
              <p className="text-2xl text-foreground font-semibold">{drillPerformance.phishingDrills}%</p>
              <p className="text-xs text-muted-foreground">Detection Rate</p>
            </div>
          </div>
        </div>
        
        {/* Recent Activity Log */}
        <h3 className="text-card-foreground font-medium mb-3">Recent Security Activity</h3>
        <div className="bg-card rounded-xl divide-y divide-background">
          {scanHistory && scanHistory.length > 0 ? (
            scanHistory.slice(0, 5).map((scan, index) => {
              const scanDate = new Date(scan.timestamp);
              const today = new Date();
              const isToday = scanDate.toDateString() === today.toDateString();
              const dateText = isToday 
                ? `Today, ${formatTime(scanDate)} ${formatAmPm(scanDate)}`
                : `Yesterday, ${formatTime(scanDate)} ${formatAmPm(scanDate)}`;
              
              return (
                <div key={index} className="p-4 flex items-start">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <i className="ri-shield-check-line text-primary"></i>
                  </div>
                  <div>
                    <h4 className="text-card-foreground text-sm font-medium">System Scan Completed</h4>
                    <p className="text-xs text-muted-foreground">{dateText}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {scan.score >= 80 
                        ? "No threats detected during the scan." 
                        : `${scan.issuesFound?.length || 0} issues detected during the scan.`}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center">
              <p className="text-muted-foreground">No recent security activity</p>
            </div>
          )}
          
          {/* Show additional mock activities if real data is limited */}
          {(!scanHistory || scanHistory.length < 2) && (
            <>
              <div className="p-4 flex items-start">
                <div className="w-8 h-8 bg-status-warning/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <i className="ri-wifi-warning-line text-status-warning"></i>
                </div>
                <div>
                  <h4 className="text-card-foreground text-sm font-medium">Network Warning</h4>
                  <p className="text-xs text-muted-foreground">Yesterday, 8:32 PM</p>
                  <p className="text-xs text-muted-foreground mt-1">Connected to unsecured Wi-Fi network "CoffeeShop_Free".</p>
                </div>
              </div>
              <div className="p-4 flex items-start">
                <div className="w-8 h-8 bg-status-safe/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <i className="ri-shield-user-line text-status-safe"></i>
                </div>
                <div>
                  <h4 className="text-card-foreground text-sm font-medium">Privacy Scan</h4>
                  <p className="text-xs text-muted-foreground">Yesterday, 6:00 AM</p>
                  <p className="text-xs text-muted-foreground mt-1">No unusual permissions access detected overnight.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
