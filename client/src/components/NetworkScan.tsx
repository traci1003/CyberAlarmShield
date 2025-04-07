import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface NetworkScanProps {
  onComplete?: (results: NetworkScanResult) => void;
}

export interface NetworkScanResult {
  vulnerabilities: {
    id: number;
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    deviceName?: string;
    ipAddress?: string;
  }[];
  secureNetworks: number;
  vulnerableNetworks: number;
  exposedPorts: number;
  encryptionLevel: 'none' | 'weak' | 'standard' | 'strong';
  vpnConnected: boolean;
}

export function NetworkScan({ onComplete }: NetworkScanProps) {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [results, setResults] = useState<NetworkScanResult | null>(null);

  const startScan = () => {
    setScanning(true);
    setProgress(0);
    setResults(null);
    
    // Simulate scanning process
    const tasks = [
      'Scanning local network',
      'Detecting devices',
      'Checking encryption',
      'Identifying open ports',
      'Analyzing vulnerabilities',
      'Verifying VPN status',
      'Generating report'
    ];
    
    let currentIndex = 0;
    setCurrentTask(tasks[currentIndex]);
    
    const interval = setInterval(() => {
      const increment = 100 / tasks.length;
      setProgress(prev => {
        const newProgress = prev + (increment / 3);
        if (newProgress >= (currentIndex + 1) * increment) {
          currentIndex++;
          if (currentIndex < tasks.length) {
            setCurrentTask(tasks[currentIndex]);
          } else {
            clearInterval(interval);
            setTimeout(() => {
              const scanResults: NetworkScanResult = generateScanResults();
              setResults(scanResults);
              setScanning(false);
              if (onComplete) {
                onComplete(scanResults);
              }
            }, 500);
          }
        }
        return newProgress;
      });
    }, 400);
  };
  
  const generateScanResults = (): NetworkScanResult => {
    // This would normally come from a real network scan
    // For demo purposes, we're generating simulated results
    const vulnerabilities = [
      {
        id: 1,
        type: 'open-port',
        description: 'Port 8080 exposed on router',
        severity: 'medium' as const,
        deviceName: 'Home Router',
        ipAddress: '192.168.1.1'
      },
      {
        id: 2,
        type: 'weak-password',
        description: 'Weak password on network device',
        severity: 'high' as const,
        deviceName: 'IoT Camera',
        ipAddress: '192.168.1.24'
      },
      {
        id: 3, 
        type: 'outdated-firmware',
        description: 'Router firmware is outdated by 2 versions',
        severity: 'medium' as const,
        deviceName: 'Home Router',
        ipAddress: '192.168.1.1'
      }
    ];
    
    // Random check if VPN is connected (30% chance)
    const vpnConnected = Math.random() > 0.7;
    
    return {
      vulnerabilities: vulnerabilities,
      secureNetworks: 1,
      vulnerableNetworks: 2,
      exposedPorts: 3,
      encryptionLevel: 'standard' as const,
      vpnConnected
    };
  };

  return (
    <div className="bg-card rounded-xl p-4 mb-4 cyber-border">
      <div className="flex items-start mb-3">
        <i className="ri-wifi-line text-primary text-xl mr-3 mt-0.5"></i>
        <div className="flex-1">
          <h4 className="text-card-foreground font-medium mb-1">Network Security</h4>
          <p className="text-sm text-muted-foreground">
            {!scanning && !results 
              ? 'Scan your network for vulnerabilities and open ports' 
              : scanning 
                ? 'Analyzing network traffic and security...' 
                : 'Network scan complete'}
          </p>
        </div>
      </div>
      
      {scanning && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-muted-foreground">{currentTask}</span>
            <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      )}
      
      {results && (
        <div className="bg-background/50 rounded-lg p-3 mb-4">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="text-center p-2 bg-background rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Vulnerabilities</p>
              <p className="text-xl text-foreground font-semibold">
                {results.vulnerabilities.length}
              </p>
            </div>
            <div className="text-center p-2 bg-background rounded-md">
              <p className="text-xs text-muted-foreground mb-1">VPN Status</p>
              <p className={`text-sm font-medium ${results.vpnConnected ? 'text-status-safe' : 'text-status-danger'}`}>
                {results.vpnConnected ? 'Connected' : 'Disconnected'}
              </p>
            </div>
          </div>
          
          {results.vulnerabilities.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Top Issues:</p>
              {results.vulnerabilities.slice(0, 2).map(vuln => (
                <div key={vuln.id} className="flex items-start mb-2 last:mb-0">
                  <div className={`w-2 h-2 mt-1.5 mr-2 rounded-full 
                    ${vuln.severity === 'high' 
                      ? 'bg-status-danger' 
                      : vuln.severity === 'medium' 
                        ? 'bg-status-warning' 
                        : 'bg-status-safe'}`} 
                  />
                  <div>
                    <p className="text-xs text-card-foreground">{vuln.description}</p>
                    <p className="text-xs text-muted-foreground">{vuln.deviceName}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <Button 
        onClick={startScan} 
        disabled={scanning}
        className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
      >
        <i className={`ri-${scanning ? 'loader-2-line animate-spin' : 'radar-line'} mr-2`}></i>
        {scanning ? 'Scanning...' : results ? 'Scan Again' : 'Scan Network'}
      </Button>
    </div>
  );
}