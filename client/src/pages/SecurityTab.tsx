import React, { useState, useEffect } from "react";
import { SecurityScore } from "@/components/SecurityScore";
import { SecurityTip } from "@/components/SecurityTip";
import { SecurityIssue } from "@/components/SecurityIssue";
import { NetworkScan } from "@/components/NetworkScan";
import { PermissionsCheck } from "@/components/PermissionsCheck";
import { ThreatAlert, Threat } from "@/components/ThreatAlert";
import { useSecurity } from "@/hooks/useSecurity";
import { formatTime, formatAmPm } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function SecurityTab() {
  const { latestScan, scanLoading, securityTip, tipLoading, performSecurityCheck } = useSecurity();
  const [threatAlerts, setThreatAlerts] = useState<Threat[]>([]);
  const [showFullScan, setShowFullScan] = useState(false);
  
  // Initialize demo threat alert for demonstration
  useEffect(() => {
    const demoThreats: Threat[] = [
      {
        id: 101,
        type: 'suspicious_activity',
        severity: 'medium',
        title: 'Unusual Login Activity',
        description: 'Multiple login attempts detected from different locations in the last 24 hours.',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        sourceIp: '94.228.123.5',
        recommendedAction: 'Review your recent account activity and enable login notifications',
        dismissed: false
      }
    ];
    
    setThreatAlerts(demoThreats);
  }, []);
  
  if (scanLoading) {
    return (
      <div className="h-full flex items-center justify-center cyber-bg">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 cyberpulse">
            <i className="ri-shield-keyhole-line text-primary text-xl"></i>
          </div>
          <p className="text-muted-foreground">Loading security data...</p>
        </div>
      </div>
    );
  }
  
  // Format the timestamp if available
  const lastUpdated = latestScan?.timestamp 
    ? `${formatTime(new Date(latestScan.timestamp))} ${formatAmPm(new Date(latestScan.timestamp))}`
    : "7:02 AM";

  const handleThreatAction = (threatId: number, action: string) => {
    // Update threat status
    setThreatAlerts(prev => 
      prev.map(threat => 
        threat.id === threatId 
          ? { ...threat, dismissed: true } 
          : threat
      )
    );
    
    // In a real app, you would make an API call to handle the threat here
    console.log(`Handling threat ${threatId} with action: ${action}`);
  };
  
  return (
    <div className="h-full">
      <div className="p-4 pb-20">
        {/* Security Score Section */}
        <div className="mb-5 relative">
          <SecurityScore 
            score={latestScan?.score || 75}
            statusText={latestScan?.score && latestScan.score >= 80 ? "SECURE" : "AT RISK"}
            lastUpdated={lastUpdated}
            appStatus={latestScan?.appScanResult || "safe"}
            networkStatus={latestScan?.networkCheckResult || "warning"}
            privacyStatus={latestScan?.privacyCheckResult || "safe"}
            systemStatus={latestScan?.systemCheckResult || "safe"}
          />
          
          {/* Quick Scan Button */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
            <Button 
              onClick={() => {
                performSecurityCheck();
                setShowFullScan(true);
              }}
              className="bg-primary text-background hover:bg-primary/90 shadow-lg cyber-glow"
            >
              <i className="ri-shield-flash-line mr-2"></i>
              Quick Scan
            </Button>
          </div>
        </div>

        {/* Security Tip */}
        {!tipLoading && securityTip && (
          <SecurityTip tip={securityTip.tip} />
        )}
        
        {/* Threat Alerts */}
        <ThreatAlert 
          recentThreats={threatAlerts}
          onAction={handleThreatAction}
          enableDemoThreat={true}
        />

        {/* Security Tabs */}
        <Tabs defaultValue="insights" className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights" className="space-y-4">
            {/* Network Warning - conditionally rendered if network status is warning or danger */}
            {latestScan?.networkCheckResult === "warning" && (
              <SecurityIssue
                icon="ri-wifi-warning-line"
                title="Unsecured Wi-Fi Connection"
                description={"You're connected to \"CoffeeShop_Free\" without a VPN. This could expose your data."}
                status="warning"
                actionText="Enable VPN"
                onAction={() => console.log("Enable VPN")}
              />
            )}

            {/* App Privacy */}
            <div className="bg-card rounded-xl p-4 mb-4 cyber-border">
              <div className="flex items-start mb-3">
                <i className="ri-eye-line text-primary text-xl mr-3 mt-0.5"></i>
                <div className="flex-1">
                  <h4 className="text-card-foreground font-medium mb-1">Privacy Activity Overnight</h4>
                  <p className="text-sm text-muted-foreground">Apps that accessed sensitive permissions:</p>
                </div>
              </div>
              <div className="bg-background/50 rounded-lg p-3">
                {latestScan?.permissionsAccessed && latestScan.permissionsAccessed.length > 0 ? (
                  latestScan.permissionsAccessed.map((access, index) => (
                    <div key={index} className="flex justify-between items-center mb-3 last:mb-0">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                          <i className={`ri-${access.permission === 'camera' ? 'camera' : 'mic'}-line text-primary`}></i>
                        </div>
                        <div>
                          <h5 className="text-card-foreground text-sm">{access.app}</h5>
                          <p className="text-xs text-muted-foreground">
                            {`${access.permission} access at ${formatTime(new Date(access.timestamp))} ${formatAmPm(new Date(access.timestamp))}`}
                          </p>
                        </div>
                      </div>
                      <button className="text-primary/70 hover:text-primary">
                        <i className="ri-more-2-fill"></i>
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-2">No permissions accessed overnight</p>
                )}
              </div>
            </div>

            {/* App Scan Results */}
            <div className="bg-card rounded-xl p-4 mb-4 cyber-border">
              <div className="flex items-start">
                <i className="ri-shield-check-line text-status-safe text-xl mr-3 mt-0.5"></i>
                <div>
                  <h4 className="text-card-foreground font-medium mb-1">App Scan Complete</h4>
                  <p className="text-sm text-muted-foreground">No malicious packages detected in 42 installed apps.</p>
                  <p className="text-xs text-muted-foreground mt-1">Last scan: {lastUpdated}</p>
                </div>
              </div>
            </div>
            
            {/* 2FA Reminder */}
            <div className="bg-card rounded-xl p-4 mb-4 cyber-border">
              <div className="flex items-start">
                <i className="ri-lock-password-line text-primary text-xl mr-3 mt-0.5"></i>
                <div>
                  <h4 className="text-card-foreground font-medium mb-1">2FA Status</h4>
                  <p className="text-sm text-muted-foreground mb-3">2 of your critical accounts are missing two-factor authentication</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-background/50 rounded p-2">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                          <i className="ri-bank-line text-primary text-sm"></i>
                        </div>
                        <span className="text-xs text-foreground">Banking App</span>
                      </div>
                      <span className="text-xs bg-status-danger/20 text-status-danger px-2 py-0.5 rounded-full">
                        Missing 2FA
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center bg-background/50 rounded p-2">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                          <i className="ri-mail-line text-primary text-sm"></i>
                        </div>
                        <span className="text-xs text-foreground">Email</span>
                      </div>
                      <span className="text-xs bg-status-danger/20 text-status-danger px-2 py-0.5 rounded-full">
                        Missing 2FA
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="network">
            <NetworkScan />
            
            {/* VPN Toggle */}
            <div className="bg-card rounded-xl p-4 mb-4 cyber-border">
              <div className="flex items-start">
                <i className="ri-lock-line text-primary text-xl mr-3 mt-0.5"></i>
                <div className="flex-1">
                  <h4 className="text-card-foreground font-medium mb-1">VPN Protection</h4>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Enable VPN at bedtime</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Automatically secure your connection during sleep hours</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20"
                    >
                      <i className="ri-shield-check-line mr-1.5"></i>
                      Enable
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Data Privacy */}
            <div className="bg-card rounded-xl p-4 mb-4 cyber-border">
              <div className="flex items-start mb-3">
                <i className="ri-database-2-line text-primary text-xl mr-3 mt-0.5"></i>
                <div className="flex-1">
                  <h4 className="text-card-foreground font-medium mb-1">Data Privacy</h4>
                  <p className="text-sm text-muted-foreground">Manage your data and privacy settings</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                  <div>
                    <p className="text-xs text-card-foreground">Clear browsing data</p>
                    <p className="text-xs text-muted-foreground">Clear cookies, cache and history</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-primary">
                    Clear
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                  <div>
                    <p className="text-xs text-card-foreground">Location data</p>
                    <p className="text-xs text-muted-foreground">Apps using location services: 8</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-primary">
                    Manage
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                  <div>
                    <p className="text-xs text-card-foreground">Password check</p>
                    <p className="text-xs text-muted-foreground">2 weak passwords detected</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-primary">
                    Fix
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="permissions">
            <PermissionsCheck />
            
            {/* Auto-Lock Settings */}
            <div className="bg-card rounded-xl p-4 mb-4 cyber-border">
              <div className="flex items-start">
                <i className="ri-timer-line text-primary text-xl mr-3 mt-0.5"></i>
                <div className="flex-1">
                  <h4 className="text-card-foreground font-medium mb-1">Auto-Lockdown Mode</h4>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Enable overnight protection</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Activate enhanced security during sleep hours</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20"
                    >
                      <i className="ri-lock-line mr-1.5"></i>
                      Configure
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
