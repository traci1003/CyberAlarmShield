import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlarmItem } from "@/components/AlarmItem";
import { useAlarms } from "@/hooks/useAlarms";
import { useSecurity } from "@/hooks/useSecurity";
import { formatTime, formatAmPm, formatDate } from "@/lib/utils";
import { AlarmModal } from "@/components/AlarmModal";
import { ScanResultModal } from "@/components/ScanResultModal";

export default function AlarmTab() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  
  const { alarms, alarmsLoading, toggleAlarmActive } = useAlarms();
  const { securityTip, performSecurityCheck, latestScan } = useSecurity();
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  const handleSnooze = () => {
    setShowAlarmModal(false);
    // Set a timeout to show the alarm again after 5 minutes
    setTimeout(() => {
      setShowAlarmModal(true);
    }, 5 * 60 * 1000);
  };
  
  const handleStartScan = () => {
    setShowAlarmModal(false);
    performSecurityCheck();
    setShowScanModal(true);
  };
  
  const handleDismissScan = () => {
    setShowScanModal(false);
  };
  
  // Demo - show alarm modal
  const handleDemoAlarm = () => {
    setShowAlarmModal(true);
  };
  
  return (
    <div className="h-full">
      {/* Time Display */}
      <div className="flex flex-col items-center justify-center py-8 px-4">
        <div className="text-clock text-foreground text-7xl md:text-8xl font-bold tracking-tighter mb-2">
          {formatTime(currentTime)}
          <span className="text-xl align-top ml-1 text-muted-foreground">{formatAmPm(currentTime)}</span>
        </div>
        <p className="text-muted-foreground text-lg">{formatDate(currentTime)}</p>
      </div>

      {/* Active Alarm Section */}
      <div className="bg-muted rounded-t-3xl px-5 pt-6 pb-24">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-foreground">Active Alarms</h2>
          <Button size="icon" className="rounded-full">
            <i className="ri-add-line text-xl"></i>
          </Button>
        </div>

        {alarmsLoading ? (
          <div className="flex justify-center py-8">
            <p className="text-muted-foreground">Loading alarms...</p>
          </div>
        ) : alarms.length === 0 ? (
          <div className="bg-card rounded-xl p-6 text-center">
            <p className="text-muted-foreground mb-4">No alarms set</p>
            <Button onClick={handleDemoAlarm}>Demo Alarm</Button>
          </div>
        ) : (
          alarms.map((alarm) => (
            <AlarmItem
              key={alarm.id}
              alarm={alarm}
              onToggle={toggleAlarmActive}
            />
          ))
        )}
      </div>
      
      {/* Alarm Modal */}
      <AlarmModal 
        isOpen={showAlarmModal} 
        onSnooze={handleSnooze} 
        onDismiss={handleStartScan} 
      />
      
      {/* Scan Result Modal */}
      <ScanResultModal 
        isOpen={showScanModal}
        securityScore={latestScan?.score || 92}
        issuesFound={latestScan?.issuesFound?.length || 0}
        securityTip={securityTip?.tip || "Use a password manager to generate and store unique passwords for all your accounts."}
        onDismiss={handleDismissScan}
      />
    </div>
  );
}
