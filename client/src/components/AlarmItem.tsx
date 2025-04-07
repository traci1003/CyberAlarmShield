import React from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Alarm } from "@/lib/types";
import { formatTimeOnly, getTimeAmPm, formatDays } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";

interface AlarmItemProps {
  alarm: Alarm;
  onToggle: (id: number, isActive: boolean) => void;
  onEdit?: (alarm: Alarm) => void;
  onDelete?: (id: number) => void;
}

export function AlarmItem({ alarm, onToggle, onEdit, onDelete }: AlarmItemProps) {
  const handleToggle = (checked: boolean) => {
    onToggle(alarm.id, checked);
  };
  
  return (
    <div className={`bg-card rounded-xl p-4 mb-4 relative ${!alarm.isActive ? 'opacity-60' : ''}`}>
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center">
            <p className="text-clock text-2xl font-bold text-card-foreground">
              {formatTimeOnly(alarm.time)}
            </p>
            {alarm.label && (
              <span className="ml-2 text-sm text-primary">{alarm.label}</span>
            )}
          </div>
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
      
      {/* Edit and Delete buttons */}
      <div className="mt-3 flex justify-end space-x-2">
        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(alarm)}
            className="h-8"
          >
            <Pencil className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(alarm.id)}
            className="h-8"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}
