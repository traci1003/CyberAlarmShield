import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlarmItem } from "@/components/AlarmItem";
import { AlarmForm } from "@/components/AlarmForm";
import { useAlarms } from "@/hooks/useAlarms";
import { useSecurity } from "@/hooks/useSecurity";
import { formatTime, formatAmPm, formatDate, convertFormAlarmToApiAlarm } from "@/lib/utils";
import { AlarmModal } from "@/components/AlarmModal";
import { ScanResultModal } from "@/components/ScanResultModal";
import { MathProblemModal } from "@/components/MathProblemModal";
import { Alarm } from "@/lib/types";
import { PlusCircle } from "lucide-react";

export default function AlarmTab() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showMathProblemModal, setShowMathProblemModal] = useState(false);
  const [showAlarmForm, setShowAlarmForm] = useState(false);
  const [editAlarm, setEditAlarm] = useState<Alarm | null>(null);
  
  const { 
    alarms, 
    alarmsLoading, 
    toggleAlarmActive, 
    createAlarm, 
    updateAlarm, 
    deleteAlarm 
  } = useAlarms();
  
  const { securityTip, performSecurityCheck, latestScan } = useSecurity();
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Update time every second for more accurate display
  useEffect(() => {
    const secondTimer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(secondTimer);
  }, []);
  
  const handleSnooze = () => {
    setShowAlarmModal(false);
    // Set a timeout to show the alarm again after 5 minutes
    setTimeout(() => {
      setShowAlarmModal(true);
    }, 5 * 60 * 1000);
  };
  
  const handleDismissAlarm = () => {
    // Randomly decide whether to show math problems or security scan
    const usesMathProblem = Math.random() > 0.5;
    
    setShowAlarmModal(false);
    
    if (usesMathProblem) {
      setShowMathProblemModal(true);
    } else {
      performSecurityCheck();
      setShowScanModal(true);
    }
  };
  
  const handleMathProblemComplete = () => {
    setShowMathProblemModal(false);
  };
  
  const handleMathProblemCancel = () => {
    setShowMathProblemModal(false);
    // Go back to snooze
    handleSnooze();
  };
  
  const handleDismissScan = () => {
    setShowScanModal(false);
  };
  
  // Demo - show alarm modal
  const handleDemoAlarm = () => {
    setShowAlarmModal(true);
  };
  
  // Get the SoundCloud URL from the active alarm
  const getActiveSoundCloudUrl = (): string => {
    const activeAlarm = alarms.find(a => a.isActive);
    return activeAlarm?.soundCloudUrl || "";
  };
  
  // Open add alarm form
  const handleAddAlarm = () => {
    setEditAlarm(null);
    setShowAlarmForm(true);
  };
  
  // Open edit alarm form
  const handleEditAlarm = (alarm: Alarm) => {
    setEditAlarm(alarm);
    setShowAlarmForm(true);
  };
  
  // Handle saving alarm form
  const handleSaveAlarm = (formData: any) => {
    const alarmData = convertFormAlarmToApiAlarm(formData);
    
    if (editAlarm) {
      updateAlarm({ id: editAlarm.id, data: alarmData });
    } else {
      createAlarm(alarmData);
    }
    
    setShowAlarmForm(false);
    setEditAlarm(null);
  };
  
  // Handle deleting alarm
  const handleDeleteAlarm = (id: number) => {
    if (window.confirm("Are you sure you want to delete this alarm?")) {
      deleteAlarm(id);
    }
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
          <Button size="icon" className="rounded-full" onClick={handleAddAlarm}>
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>

        {alarmsLoading ? (
          <div className="flex justify-center py-8">
            <p className="text-muted-foreground">Loading alarms...</p>
          </div>
        ) : alarms.length === 0 ? (
          <div className="bg-card rounded-xl p-6 text-center">
            <p className="text-muted-foreground mb-4">No alarms set</p>
            <Button onClick={handleDemoAlarm} className="mr-2">Demo Alarm</Button>
            <Button onClick={handleAddAlarm} variant="outline">Add Alarm</Button>
          </div>
        ) : (
          alarms.map((alarm) => (
            <AlarmItem
              key={alarm.id}
              alarm={alarm}
              onToggle={toggleAlarmActive}
              onEdit={handleEditAlarm}
              onDelete={handleDeleteAlarm}
            />
          ))
        )}
      </div>
      
      {/* Alarm Modal */}
      <AlarmModal 
        isOpen={showAlarmModal} 
        onSnooze={handleSnooze} 
        onDismiss={handleDismissAlarm}
        soundCloudUrl={getActiveSoundCloudUrl()}
      />
      
      {/* Scan Result Modal */}
      <ScanResultModal 
        isOpen={showScanModal}
        securityScore={latestScan?.score || 85}
        issuesFound={latestScan?.issuesFound?.length || 2}
        securityTip={securityTip?.tip || "Use a password manager to generate and store unique passwords for all your accounts."}
        onDismiss={handleDismissScan}
      />
      
      {/* Math Problem Modal */}
      <MathProblemModal
        isOpen={showMathProblemModal}
        level={2}
        problemCount={3}
        onComplete={handleMathProblemComplete}
        onCancel={handleMathProblemCancel}
      />
      
      {/* Alarm Form Modal */}
      <AlarmForm
        isOpen={showAlarmForm}
        onClose={() => {
          setShowAlarmForm(false);
          setEditAlarm(null);
        }}
        onSubmit={handleSaveAlarm}
        defaultValues={editAlarm ? {
          time: editAlarm.time,
          label: editAlarm.label || "",
          days: editAlarm.days,
          sound: editAlarm.sound,
          vibrate: editAlarm.vibrate,
          mathProblem: editAlarm.mathProblem,
          securityScan: editAlarm.securityScan,
          phishingDrill: editAlarm.phishingDrill,
          soundCloudUrl: editAlarm.soundCloudUrl || "",
          // Parse additional settings from JSON string
          ...(editAlarm.settings ? JSON.parse(editAlarm.settings) : {
            volumeLevel: 80,
            gradualVolume: false,
            snoozeCount: 3,
            snoozeDuration: 5
          })
        } : undefined}
        title={editAlarm ? "Edit Alarm" : "Add New Alarm"}
      />
    </div>
  );
}
