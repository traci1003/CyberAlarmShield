import React from "react";
import { SecurityScore } from "@/components/SecurityScore";
import { SecurityTip } from "@/components/SecurityTip";
import { SecurityIssue } from "@/components/SecurityIssue";
import { useSecurity } from "@/hooks/useSecurity";
import { formatTime, formatAmPm } from "@/lib/utils";

export default function SecurityTab() {
  const { latestScan, scanLoading, securityTip, tipLoading } = useSecurity();
  
  if (scanLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Loading security data...</p>
      </div>
    );
  }
  
  // Format the timestamp if available
  const lastUpdated = latestScan?.timestamp 
    ? `${formatTime(new Date(latestScan.timestamp))} ${formatAmPm(new Date(latestScan.timestamp))}`
    : "7:02 AM";
  
  return (
    <div className="h-full">
      <div className="p-4">
        {/* Security Score Section */}
        <SecurityScore 
          score={latestScan?.score || 75}
          statusText={latestScan?.score && latestScan.score >= 80 ? "SECURE" : "AT RISK"}
          lastUpdated={lastUpdated}
          appStatus={latestScan?.appScanResult || "safe"}
          networkStatus={latestScan?.networkCheckResult || "warning"}
          privacyStatus={latestScan?.privacyCheckResult || "safe"}
          systemStatus={latestScan?.systemCheckResult || "safe"}
        />

        {/* Security Tip */}
        {!tipLoading && securityTip && (
          <SecurityTip tip={securityTip.tip} />
        )}

        {/* Security Issues */}
        <h3 className="text-lg font-medium text-foreground mb-3">Security Insights</h3>

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
        <div className="bg-card rounded-xl p-4 mb-4">
          <div className="flex items-start mb-3">
            <i className="ri-eye-line text-muted-foreground text-xl mr-3 mt-0.5"></i>
            <div className="flex-1">
              <h4 className="text-card-foreground font-medium mb-1">Privacy Activity Overnight</h4>
              <p className="text-sm text-muted-foreground">Apps that accessed sensitive permissions:</p>
            </div>
          </div>
          <div className="bg-background rounded-lg p-3">
            {latestScan?.permissionsAccessed && latestScan.permissionsAccessed.length > 0 ? (
              latestScan.permissionsAccessed.map((access, index) => (
                <div key={index} className="flex justify-between items-center mb-3 last:mb-0">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mr-3">
                      <i className={`ri-${access.permission === 'camera' ? 'camera' : 'mic'}-line text-muted-foreground`}></i>
                    </div>
                    <div>
                      <h5 className="text-card-foreground text-sm">{access.app}</h5>
                      <p className="text-xs text-muted-foreground">
                        {`${access.permission} access at ${formatTime(new Date(access.timestamp))} ${formatAmPm(new Date(access.timestamp))}`}
                      </p>
                    </div>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground">
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
        <div className="bg-card rounded-xl p-4 mb-4">
          <div className="flex items-start">
            <i className="ri-shield-check-line text-status-safe text-xl mr-3 mt-0.5"></i>
            <div>
              <h4 className="text-card-foreground font-medium mb-1">App Scan Complete</h4>
              <p className="text-sm text-muted-foreground">No malicious packages detected in 42 installed apps.</p>
              <p className="text-xs text-muted-foreground mt-1">Last scan: {lastUpdated}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
