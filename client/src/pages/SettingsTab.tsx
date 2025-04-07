import React from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function SettingsTab() {
  return (
    <div className="h-full">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-foreground mb-4">Settings</h2>
        
        {/* Alarm Settings */}
        <div className="bg-card rounded-xl p-4 mb-6">
          <h3 className="text-card-foreground font-medium border-b border-background pb-2 mb-4">Alarm Settings</h3>
          
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-card-foreground">Default Alarm Sound</p>
              <p className="text-xs text-muted-foreground">Digital Beep</p>
            </div>
            <Button variant="link" className="text-primary">Change</Button>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-card-foreground">Snooze Duration</p>
              <p className="text-xs text-muted-foreground">5 minutes</p>
            </div>
            <Button variant="link" className="text-primary">Change</Button>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-card-foreground">Gradual Volume Increase</p>
              <p className="text-xs text-muted-foreground">Start quiet and get louder</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
        
        {/* Security Settings */}
        <div className="bg-card rounded-xl p-4 mb-6">
          <h3 className="text-card-foreground font-medium border-b border-background pb-2 mb-4">Security Settings</h3>
          
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-card-foreground">Auto-Scan After Alarm</p>
              <p className="text-xs text-muted-foreground">Run security check after waking up</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-card-foreground">Night Lockdown Mode</p>
              <p className="text-xs text-muted-foreground">Disable background activity at night</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-card-foreground">Auto-Enable VPN</p>
              <p className="text-xs text-muted-foreground">Activate VPN during sleep hours</p>
            </div>
            <Switch />
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-card-foreground">Security Challenge Level</p>
              <p className="text-xs text-muted-foreground">Moderate</p>
            </div>
            <Button variant="link" className="text-primary">Change</Button>
          </div>
        </div>
        
        {/* Notification Settings */}
        <div className="bg-card rounded-xl p-4">
          <h3 className="text-card-foreground font-medium border-b border-background pb-2 mb-4">Notification Settings</h3>
          
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-card-foreground">Security Alerts</p>
              <p className="text-xs text-muted-foreground">High priority only</p>
            </div>
            <Button variant="link" className="text-primary">Change</Button>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-card-foreground">Daily Security Tips</p>
              <p className="text-xs text-muted-foreground">Show after alarm</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );
}
