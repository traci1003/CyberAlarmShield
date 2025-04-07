import React from "react";
import { Switch } from "@/components/ui/switch";
import { Alarm } from "@/lib/types";
import { formatTimeOnly, getTimeAmPm, formatDays } from "@/lib/utils";

interface AlarmItemProps {
  alarm: Alarm;
  onToggle: (id: number, isActive: boolean) => void;
}

export function AlarmItem({ alarm, onToggle }: AlarmItemProps) {
  const handleToggle = (checked: boolean) => {
    onToggle(alarm.id, checked);
  };
  
  return (
    <div className={`bg-card rounded-xl p-4 mb-4 relative ${!alarm.isActive ? 'opacity-60' : ''}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-clock text-2xl font-bold text-card-foreground">{formatTimeOnly(alarm.time)}</p>
          <p className="text-muted-foreground text-sm">{formatDays(alarm.days)}</p>
        </div>
        <div className="flex items-center">
          {/* Alarm Type Icons */}
          <div className="flex space-x-2 mr-4">
            {alarm.sound && (
              <span className="text-card-foreground" title="Sound alarm">
                <i className="ri-volume-up-line"></i>
              </span>
            )}
            {alarm.vibrate && (
              <span className="text-card-foreground" title="Vibration">
                <i className="ri-vibrate-line"></i>
              </span>
            )}
          </div>
          
          {/* Toggle Switch */}
          <Switch 
            checked={alarm.isActive} 
            onCheckedChange={handleToggle}
          />
        </div>
      </div>
      
      <div className="mt-2 flex flex-wrap">
        {alarm.mathProblem && <span className="text-xs bg-background rounded-full px-3 py-1 mr-2 mb-2">Math Problems</span>}
        {alarm.securityScan && <span className="text-xs bg-background rounded-full px-3 py-1 mr-2 mb-2">Security Scan</span>}
        {alarm.phishingDrill && <span className="text-xs bg-background rounded-full px-3 py-1 mr-2 mb-2">Phishing Drill</span>}
      </div>
    </div>
  );
}
