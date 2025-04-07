import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import type { LockdownSettings } from '@shared/schema';

export function LockdownSettings() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLockdownEnabled, setIsLockdownEnabled] = useState(false);
  const [settings, setSettings] = useState<{
    startTime: string;
    endTime: string;
    blockBackgroundActivity: boolean;
    enforceVpn: boolean;
    disableBluetoothWifi: boolean;
    autoScanOnEnd: boolean;
  }>({
    startTime: '22:00',
    endTime: '07:00',
    blockBackgroundActivity: true,
    enforceVpn: false,
    disableBluetoothWifi: false,
    autoScanOnEnd: true
  });
  
  const queryClient = useQueryClient();
  
  // Fetch existing lockdown settings
  const { data, isLoading, isError } = useQuery<LockdownSettings>({
    queryKey: ['/api/security/lockdown'],
    retry: false,
    gcTime: 0,
    // Handle 404 - settings don't exist yet
    staleTime: 0
  });
  
  // Update settings when data is fetched
  useEffect(() => {
    if (data) {
      setIsLockdownEnabled(data.isEnabled ?? false);
      setSettings({
        startTime: data.startTime ?? '22:00',
        endTime: data.endTime ?? '07:00',
        blockBackgroundActivity: data.blockBackgroundActivity ?? true,
        enforceVpn: data.enforceVpn ?? false,
        disableBluetoothWifi: data.disableBluetoothWifi ?? false,
        autoScanOnEnd: data.autoScanOnEnd ?? true
      });
    }
  }, [data]);
  
  // Toggle lockdown mode
  const toggleLockdownMutation = useMutation<LockdownSettings, Error, boolean>({
    mutationFn: async (isEnabled: boolean) => {
      return apiRequest<LockdownSettings>('/api/security/lockdown/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isEnabled })
      });
    },
    onSuccess: (data) => {
      const isEnabled = data.isEnabled === null ? false : data.isEnabled;
      setIsLockdownEnabled(isEnabled);
      queryClient.invalidateQueries({ queryKey: ['/api/security/lockdown'] });
      toast({
        title: isEnabled ? 'Lockdown Mode Activated' : 'Lockdown Mode Deactivated',
        description: isEnabled 
          ? 'Your device is now protected with enhanced security measures.' 
          : 'Standard security settings restored.',
        variant: isEnabled ? 'default' : 'destructive'
      });
    },
    onError: (error) => {
      console.error('Error toggling lockdown mode:', error);
      toast({
        title: 'Failed to toggle Lockdown Mode',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    }
  });
  
  // Save lockdown settings
  const saveSettingsMutation = useMutation<LockdownSettings, Error, Partial<LockdownSettings>>({
    mutationFn: async (updatedSettings: Partial<LockdownSettings>) => {
      return apiRequest<LockdownSettings>('/api/security/lockdown', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/security/lockdown'] });
      setIsDialogOpen(false);
      toast({
        title: 'Settings Saved',
        description: 'Your lockdown settings have been updated.',
        variant: 'default'
      });
    },
    onError: (error) => {
      console.error('Error saving lockdown settings:', error);
      toast({
        title: 'Failed to Save Settings',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    }
  });
  
  const handleToggleLockdown = () => {
    toggleLockdownMutation.mutate(!isLockdownEnabled);
  };
  
  const handleSaveSettings = () => {
    saveSettingsMutation.mutate(settings);
  };
  
  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <div className="bg-card rounded-xl p-4 mb-4 cyber-border">
      <div className="flex items-start">
        <i className="ri-shield-keyhole-line text-primary text-xl mr-3 mt-0.5"></i>
        <div className="flex-1">
          <h4 className="text-card-foreground font-medium mb-1">Auto-Lockdown Mode</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Automatically disable background activity and enhance security during sleep hours.
          </p>
          
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-card-foreground">Lockdown Status</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isLockdownEnabled ? 'Active - Enhanced protection enabled' : 'Inactive - Standard protection'}
              </p>
            </div>
            <Switch 
              checked={isLockdownEnabled} 
              onCheckedChange={handleToggleLockdown}
              disabled={toggleLockdownMutation.isPending}
              className="data-[state=checked]:bg-primary"
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20"
              >
                <i className="ri-settings-line mr-1.5"></i>
                Configure Protection
              </Button>
            </DialogTrigger>
            <DialogContent className="cyber-bg max-w-md border-primary/20">
              <DialogHeader>
                <DialogTitle className="text-primary">Lockdown Settings</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input 
                      id="startTime" 
                      type="time" 
                      value={settings.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      className="bg-card"
                    />
                    <p className="text-xs text-muted-foreground">When lockdown begins</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input 
                      id="endTime" 
                      type="time" 
                      value={settings.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                      className="bg-card"
                    />
                    <p className="text-xs text-muted-foreground">When lockdown ends</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="blockActivity" className="cursor-pointer">Block Background Activity</Label>
                      <p className="text-xs text-muted-foreground">Prevent apps from running in background</p>
                    </div>
                    <Switch 
                      id="blockActivity"
                      checked={settings.blockBackgroundActivity} 
                      onCheckedChange={(value) => handleInputChange('blockBackgroundActivity', value)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enforceVpn" className="cursor-pointer">Enforce VPN Connection</Label>
                      <p className="text-xs text-muted-foreground">Require VPN to be active during lockdown</p>
                    </div>
                    <Switch 
                      id="enforceVpn"
                      checked={settings.enforceVpn} 
                      onCheckedChange={(value) => handleInputChange('enforceVpn', value)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="disableBluetooth" className="cursor-pointer">Disable Bluetooth & Wi-Fi</Label>
                      <p className="text-xs text-muted-foreground">Turn off wireless connections</p>
                    </div>
                    <Switch 
                      id="disableBluetooth"
                      checked={settings.disableBluetoothWifi} 
                      onCheckedChange={(value) => handleInputChange('disableBluetoothWifi', value)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoScan" className="cursor-pointer">Run Security Scan After Lockdown</Label>
                      <p className="text-xs text-muted-foreground">Check for threats when lockdown ends</p>
                    </div>
                    <Switch 
                      id="autoScan"
                      checked={settings.autoScanOnEnd} 
                      onCheckedChange={(value) => handleInputChange('autoScanOnEnd', value)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button
                  onClick={handleSaveSettings}
                  disabled={saveSettingsMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  {saveSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          {isLockdownEnabled && (
            <div className="mt-3 p-2 rounded-md bg-primary/10 border border-primary/20">
              <p className="text-xs text-primary flex items-center">
                <i className="ri-shield-check-line mr-1.5"></i>
                Lockdown active: {settings.startTime} - {settings.endTime}
                {settings.blockBackgroundActivity && ', blocking background activity'}
                {settings.enforceVpn && ', enforcing VPN'}
                {settings.disableBluetoothWifi && ', wireless disabled'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}