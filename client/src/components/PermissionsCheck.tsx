import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface PermissionsCheckProps {
  onComplete?: (results: PermissionsCheckResult) => void;
}

export interface AppPermission {
  id: number;
  appName: string;
  icon: string;
  permissions: {
    type: string;
    description: string;
    isActive: boolean;
    isRecommended: boolean;
  }[];
}

export interface PermissionsCheckResult {
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  highRiskApps: number;
  mediumRiskApps: number;
  totalPermissions: number;
  unnecessaryPermissions: number;
  apps: AppPermission[];
}

export function PermissionsCheck({ onComplete }: PermissionsCheckProps) {
  const [checking, setChecking] = useState(false);
  const [results, setResults] = useState<PermissionsCheckResult | null>(null);
  const [expandedApp, setExpandedApp] = useState<number | null>(null);

  const startCheck = () => {
    setChecking(true);
    setResults(null);
    
    // Simulate scan delay
    setTimeout(() => {
      const checkResults = generatePermissionsResults();
      setResults(checkResults);
      setChecking(false);
      
      if (onComplete) {
        onComplete(checkResults);
      }
    }, 2000);
  };
  
  const togglePermission = (appId: number, permissionType: string) => {
    if (!results) return;
    
    const updatedResults = {
      ...results,
      apps: results.apps.map(app => {
        if (app.id === appId) {
          return {
            ...app,
            permissions: app.permissions.map(perm => {
              if (perm.type === permissionType) {
                return { ...perm, isActive: !perm.isActive };
              }
              return perm;
            })
          };
        }
        return app;
      })
    };
    
    // Recalculate risk scores
    let unnecessary = 0;
    let highRisk = 0;
    let mediumRisk = 0;
    
    updatedResults.apps.forEach(app => {
      let appRisk = 0;
      app.permissions.forEach(perm => {
        if (perm.isActive && !perm.isRecommended) {
          unnecessary++;
          appRisk++;
        }
      });
      
      if (appRisk >= 2) highRisk++;
      else if (appRisk >= 1) mediumRisk++;
    });
    
    updatedResults.unnecessaryPermissions = unnecessary;
    updatedResults.highRiskApps = highRisk;
    updatedResults.mediumRiskApps = mediumRisk;
    
    // Calculate overall risk level based on unnecessary permissions
    const total = updatedResults.totalPermissions;
    const riskScore = Math.max(0, Math.min(100, 100 - (unnecessary * 100 / total)));
    updatedResults.riskScore = Math.round(riskScore);
    
    if (riskScore > 75) updatedResults.riskLevel = 'low';
    else if (riskScore > 50) updatedResults.riskLevel = 'medium';
    else updatedResults.riskLevel = 'high';
    
    setResults(updatedResults);
    
    if (onComplete) {
      onComplete(updatedResults);
    }
  };
  
  const generatePermissionsResults = (): PermissionsCheckResult => {
    // This would normally come from checking actual app permissions
    // For demo, generating simulated results
    const apps: AppPermission[] = [
      {
        id: 1,
        appName: 'Social Connect',
        icon: 'ri-chat-3-line',
        permissions: [
          { 
            type: 'camera', 
            description: 'Access camera for photos and video calls', 
            isActive: true, 
            isRecommended: true 
          },
          { 
            type: 'location', 
            description: 'Access precise location', 
            isActive: true, 
            isRecommended: false 
          },
          { 
            type: 'contacts', 
            description: 'Access contacts list', 
            isActive: true, 
            isRecommended: true 
          },
          { 
            type: 'storage', 
            description: 'Access photos and media', 
            isActive: true, 
            isRecommended: true 
          }
        ]
      },
      {
        id: 2,
        appName: 'Weather Forecast',
        icon: 'ri-cloud-line',
        permissions: [
          { 
            type: 'location', 
            description: 'Access precise location', 
            isActive: true, 
            isRecommended: true 
          },
          { 
            type: 'contacts', 
            description: 'Access contacts list', 
            isActive: true, 
            isRecommended: false 
          },
          { 
            type: 'background', 
            description: 'Run in background', 
            isActive: true, 
            isRecommended: true 
          }
        ]
      },
      {
        id: 3,
        appName: 'Flashlight Tools',
        icon: 'ri-flashlight-line',
        permissions: [
          { 
            type: 'camera', 
            description: 'Access camera flash', 
            isActive: true, 
            isRecommended: true 
          },
          { 
            type: 'location', 
            description: 'Access precise location', 
            isActive: true, 
            isRecommended: false 
          }
        ]
      }
    ];
    
    // Count total and unnecessary permissions
    let totalPermissions = 0;
    let unnecessaryPermissions = 0;
    let highRiskApps = 0;
    let mediumRiskApps = 0;
    
    apps.forEach(app => {
      let appUnnecessary = 0;
      app.permissions.forEach(perm => {
        totalPermissions++;
        if (perm.isActive && !perm.isRecommended) {
          unnecessaryPermissions++;
          appUnnecessary++;
        }
      });
      
      if (appUnnecessary >= 2) highRiskApps++;
      else if (appUnnecessary >= 1) mediumRiskApps++;
    });
    
    // Calculate risk score (0-100)
    const riskScore = Math.max(0, Math.min(100, 100 - (unnecessaryPermissions * 100 / totalPermissions)));
    
    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high';
    if (riskScore > 75) riskLevel = 'low';
    else if (riskScore > 50) riskLevel = 'medium';
    else riskLevel = 'high';
    
    return {
      riskLevel,
      riskScore: Math.round(riskScore),
      highRiskApps,
      mediumRiskApps,
      totalPermissions,
      unnecessaryPermissions,
      apps
    };
  };

  return (
    <div className="bg-card rounded-xl p-4 mb-4 cyber-border">
      <div className="flex items-start mb-3">
        <i className="ri-shield-user-line text-primary text-xl mr-3 mt-0.5"></i>
        <div className="flex-1">
          <h4 className="text-card-foreground font-medium mb-1">App Permissions</h4>
          <p className="text-sm text-muted-foreground">
            {!checking && !results 
              ? 'Check which apps have excessive permissions' 
              : checking 
                ? 'Scanning app permissions...' 
                : `${results?.unnecessaryPermissions || 0} unnecessary permissions found`}
          </p>
        </div>
      </div>
      
      {results && (
        <>
          <div className="bg-background/50 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-muted-foreground">Privacy Score</p>
                <p className={`text-xl font-semibold ${
                  results.riskLevel === 'low' 
                    ? 'text-status-safe' 
                    : results.riskLevel === 'medium' 
                      ? 'text-status-warning' 
                      : 'text-status-danger'
                }`}>
                  {results.riskScore}/100
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Risk Level</p>
                <p className={`text-sm font-medium ${
                  results.riskLevel === 'low' 
                    ? 'text-status-safe' 
                    : results.riskLevel === 'medium' 
                      ? 'text-status-warning' 
                      : 'text-status-danger'
                }`}>
                  {results.riskLevel.charAt(0).toUpperCase() + results.riskLevel.slice(1)}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2 bg-background rounded-md">
                <p className="text-xs text-muted-foreground mb-1">High Risk Apps</p>
                <p className="text-lg text-status-danger font-semibold">
                  {results.highRiskApps}
                </p>
              </div>
              <div className="text-center p-2 bg-background rounded-md">
                <p className="text-xs text-muted-foreground mb-1">Medium Risk Apps</p>
                <p className="text-lg text-status-warning font-semibold">
                  {results.mediumRiskApps}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">App Permission Details:</p>
            {results.apps.map(app => {
              // Count unnecessary permissions for this app
              const unnecessaryCount = app.permissions.filter(p => p.isActive && !p.isRecommended).length;
              const isExpanded = expandedApp === app.id;
              
              return (
                <div key={app.id} className="mb-2 last:mb-0">
                  <div 
                    className={`flex items-center justify-between p-2 rounded-md ${
                      unnecessaryCount > 0 
                        ? 'bg-background border-l-2 border-status-warning' 
                        : 'bg-background'
                    }`}
                    onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                  >
                    <div className="flex items-center">
                      <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center mr-2">
                        <i className={`${app.icon} text-primary`}></i>
                      </div>
                      <div>
                        <p className="text-sm text-card-foreground">{app.appName}</p>
                        <p className="text-xs text-muted-foreground">
                          {unnecessaryCount > 0 
                            ? `${unnecessaryCount} unnecessary permission${unnecessaryCount > 1 ? 's' : ''}` 
                            : 'All permissions required'}
                        </p>
                      </div>
                    </div>
                    <i className={`ri-arrow-${isExpanded ? 'up' : 'down'}-s-line text-muted-foreground`}></i>
                  </div>
                  
                  {isExpanded && (
                    <div className="ml-4 mt-2 pl-2 border-l border-primary/20">
                      {app.permissions.map((perm, index) => (
                        <div key={index} className="flex items-center justify-between py-1.5">
                          <div>
                            <p className="text-xs text-card-foreground flex items-center">
                              <i className={`ri-${
                                perm.type === 'camera' ? 'camera' : 
                                perm.type === 'location' ? 'map-pin' :
                                perm.type === 'contacts' ? 'contacts-book' :
                                perm.type === 'storage' ? 'folder' :
                                perm.type === 'background' ? 'timer' : 'question'
                              }-line mr-1.5 text-primary/70`}></i>
                              {perm.description}
                            </p>
                            {!perm.isRecommended && (
                              <p className="text-xs text-status-warning ml-5 mt-0.5">
                                Not recommended
                              </p>
                            )}
                          </div>
                          <Switch
                            checked={perm.isActive}
                            onCheckedChange={() => togglePermission(app.id, perm.type)}
                            className="data-[state=checked]:bg-primary"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
      
      <Button 
        onClick={startCheck} 
        disabled={checking}
        className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
      >
        <i className={`ri-${checking ? 'loader-2-line animate-spin' : 'shield-check-line'} mr-2`}></i>
        {checking ? 'Checking...' : results ? 'Recheck Permissions' : 'Check App Permissions'}
      </Button>
    </div>
  );
}