import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

export interface Threat {
  id: number;
  type: 'phishing' | 'malware' | 'vulnerability' | 'suspicious_activity' | 'data_breach';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: Date;
  sourceIp?: string;
  url?: string;
  app?: string;
  affectedDevice?: string;
  recommendedAction: string;
  dismissed: boolean;
}

interface ThreatAlertProps {
  recentThreats?: Threat[];
  onAction?: (threatId: number, action: string) => void;
  enableDemoThreat?: boolean;
}

export function ThreatAlert({ 
  recentThreats = [], 
  onAction,
  enableDemoThreat = false
}: ThreatAlertProps) {
  const [activeThreats, setActiveThreats] = useState<Threat[]>([]);
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showLiveDemo, setShowLiveDemo] = useState(false);
  
  // Demo threat countdown
  const [demoCountdown, setDemoCountdown] = useState(10);
  
  useEffect(() => {
    setActiveThreats(recentThreats.filter(threat => !threat.dismissed));
  }, [recentThreats]);
  
  // Demo threat timer if enabled
  useEffect(() => {
    if (!enableDemoThreat || showLiveDemo) return;
    
    const timer = setInterval(() => {
      setDemoCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerDemoThreat();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [enableDemoThreat, showLiveDemo]);
  
  const triggerDemoThreat = () => {
    const demoThreat: Threat = {
      id: 9999,
      type: 'phishing',
      severity: 'high',
      title: 'Suspicious Login Attempt Detected',
      description: 'A login attempt to your email account was detected from an unrecognized location and device.',
      timestamp: new Date(),
      sourceIp: '185.193.87.42',
      url: 'secure-mail-login.com/account',
      recommendedAction: 'Reset your email password immediately and enable two-factor authentication',
      dismissed: false
    };
    
    setActiveThreats(prev => [...prev, demoThreat]);
    setShowLiveDemo(true);
    setSelectedThreat(demoThreat);
    setShowDialog(true);
  };
  
  const handleThreatAction = (threatId: number, action: string) => {
    setShowDialog(false);
    
    // Mark the threat as dismissed in the local state
    setActiveThreats(prev => 
      prev.map(threat => 
        threat.id === threatId 
          ? { ...threat, dismissed: true } 
          : threat
      ).filter(threat => threat.id !== threatId)
    );
    
    // Notify parent component
    if (onAction) {
      onAction(threatId, action);
    }
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-[#FF0D3D] text-white';
      case 'high': return 'bg-status-danger text-white';
      case 'medium': return 'bg-status-warning text-black';
      case 'low': return 'bg-primary text-black';
      default: return 'bg-muted text-foreground';
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'phishing': return 'ri-spy-line';
      case 'malware': return 'ri-virus-line';
      case 'vulnerability': return 'ri-error-warning-line';
      case 'suspicious_activity': return 'ri-alarm-warning-line';
      case 'data_breach': return 'ri-lock-unlock-line';
      default: return 'ri-alert-line';
    }
  };
  
  return (
    <>
      <div className="bg-card rounded-xl p-4 mb-4 cyber-border relative overflow-hidden">
        {/* Background grid effect for cybersecurity theme */}
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 gap-px opacity-5 pointer-events-none">
          {Array.from({ length: 12 * 6 }).map((_, i) => (
            <div key={i} className="bg-primary"></div>
          ))}
        </div>
        
        <div className="flex items-start mb-3 relative z-10">
          <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
            <i className="ri-shield-flash-line text-primary text-lg"></i>
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <h4 className="text-card-foreground font-medium mb-1">Threat Detection</h4>
              {activeThreats.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {activeThreats.length}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {activeThreats.length === 0 
                ? 'No active threats detected' 
                : `${activeThreats.length} active threat${activeThreats.length > 1 ? 's' : ''} detected`}
            </p>
          </div>
        </div>
        
        {activeThreats.length > 0 ? (
          <div className="space-y-2 mb-4 relative z-10">
            {activeThreats.map(threat => (
              <div 
                key={threat.id}
                className="p-2 bg-background/70 rounded-md cursor-pointer hover:bg-background"
                onClick={() => {
                  setSelectedThreat(threat);
                  setShowDialog(true);
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <i className={`${getTypeIcon(threat.type)} text-status-danger mr-2`}></i>
                    <p className="text-sm font-medium text-card-foreground">{threat.title}</p>
                  </div>
                  <Badge className={getSeverityColor(threat.severity)}>
                    {threat.severity}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1 ml-6 mb-1">
                  {threat.description}
                </p>
                <p className="text-xs text-primary ml-6">
                  {new Date(threat.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        ) : enableDemoThreat && !showLiveDemo ? (
          <div className="bg-muted/30 rounded-md p-3 mb-4 relative z-10">
            <p className="text-xs text-muted-foreground mb-2">
              Demo: A simulated threat will appear in {demoCountdown} seconds
            </p>
            <div className="w-full bg-muted rounded-full h-1.5 mb-1">
              <div 
                className="bg-primary h-1.5 rounded-full" 
                style={{ width: `${(10 - demoCountdown) * 10}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="bg-muted/30 rounded-md p-3 mb-4 text-center relative z-10">
            <i className="ri-shield-check-line text-status-safe text-2xl mb-1"></i>
            <p className="text-xs text-muted-foreground">Your device is protected</p>
          </div>
        )}
        
        <div className="flex justify-between relative z-10">
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs"
          >
            View History
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs"
            onClick={enableDemoThreat && !showLiveDemo ? triggerDemoThreat : undefined}
          >
            <i className="ri-radar-line mr-1.5"></i>
            Scan Now
          </Button>
        </div>
      </div>
      
      {/* Detailed Threat Alert Dialog */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center mb-2">
              <i className={`${selectedThreat ? getTypeIcon(selectedThreat.type) : 'ri-alert-line'} text-status-danger text-xl mr-2`}></i>
              <AlertDialogTitle>{selectedThreat?.title || 'Security Alert'}</AlertDialogTitle>
            </div>
            <Badge className={selectedThreat ? getSeverityColor(selectedThreat.severity) : 'bg-muted'}>
              {selectedThreat?.severity || 'unknown'} severity
            </Badge>
            <AlertDialogDescription className="mt-4 space-y-3">
              <p className="text-sm">{selectedThreat?.description}</p>
              
              {selectedThreat?.sourceIp && (
                <div className="text-xs bg-background p-2 rounded">
                  <span className="text-muted-foreground">Source IP: </span>
                  <span className="font-mono">{selectedThreat.sourceIp}</span>
                </div>
              )}
              
              {selectedThreat?.url && (
                <div className="text-xs bg-background p-2 rounded overflow-hidden">
                  <span className="text-muted-foreground">URL: </span>
                  <span className="font-mono break-all">{selectedThreat.url}</span>
                </div>
              )}
              
              {selectedThreat?.app && (
                <div className="text-xs bg-background p-2 rounded">
                  <span className="text-muted-foreground">Application: </span>
                  <span>{selectedThreat.app}</span>
                </div>
              )}
              
              <div className="bg-status-danger/10 border border-status-danger/30 p-3 rounded-md mt-3">
                <p className="text-sm font-medium mb-1 text-status-danger">Recommended Action:</p>
                <p className="text-sm">{selectedThreat?.recommendedAction}</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2">
            <AlertDialogCancel>Dismiss</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-primary hover:bg-primary/80"
              onClick={() => selectedThreat && handleThreatAction(selectedThreat.id, 'resolve')}
            >
              Take Action
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}