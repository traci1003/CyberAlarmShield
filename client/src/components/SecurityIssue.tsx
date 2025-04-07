import React from "react";
import { Button } from "@/components/ui/button";
import { getSecurityStatusColor } from "@/lib/utils";

interface SecurityIssueProps {
  icon: string;
  title: string;
  description: string;
  status: string;
  actionText?: string;
  onAction?: () => void;
}

export function SecurityIssue({ 
  icon, 
  title, 
  description, 
  status, 
  actionText, 
  onAction 
}: SecurityIssueProps) {
  const statusColorClass = getSecurityStatusColor(status);
  
  return (
    <div className={`bg-card rounded-xl p-4 mb-4 ${status !== 'safe' ? `border-l-4 border-${status}-warning` : ''}`}>
      <div className="flex items-start">
        <i className={`${icon} ${statusColorClass} text-xl mr-3 mt-0.5`}></i>
        <div>
          <h4 className="text-card-foreground font-medium mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
          {actionText && onAction && (
            <Button 
              variant="outline" 
              size="sm" 
              className={`text-xs bg-${status}-warning/20 text-${status}-warning rounded-full px-3 py-1.5`}
              onClick={onAction}
            >
              {actionText} <i className="ri-arrow-right-line ml-1"></i>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
