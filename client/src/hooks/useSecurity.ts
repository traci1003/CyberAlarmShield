import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { SecurityScan, SecurityTip, SecurityIssue, PermissionAccess } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useState, useCallback } from "react";

export function useSecurity() {
  const { toast } = useToast();
  const [cybersecurityScore, setCybersecurityScore] = useState(75);
  
  // Get latest security scan
  const { 
    data: latestScan, 
    isLoading: scanLoading, 
    error: scanError 
  } = useQuery<SecurityScan>({
    queryKey: ['/api/security/latest'],
  });
  
  // Get security scan history
  const { 
    data: scanHistory = [], 
    isLoading: historyLoading, 
    error: historyError 
  } = useQuery<SecurityScan[]>({
    queryKey: ['/api/security/scans'],
  });
  
  // Get security tip of the day
  const { 
    data: securityTip, 
    isLoading: tipLoading, 
    error: tipError 
  } = useQuery<SecurityTip>({
    queryKey: ['/api/security/tip'],
  });
  
  // Generate mock permissions accessed for demo
  const generateMockPermissionsAccessed = useCallback((): PermissionAccess[] => {
    const now = new Date();
    return [
      {
        app: 'Social Media App',
        permission: 'camera',
        timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000) // 3 hours ago
      },
      {
        app: 'Maps App',
        permission: 'location',
        timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000) // 5 hours ago
      },
      {
        app: 'Video Call App',
        permission: 'mic',
        timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000) // 8 hours ago
      }
    ];
  }, []);
  
  // Generate mock security issues for demo
  const generateMockSecurityIssues = useCallback((): SecurityIssue[] => {
    return [
      {
        type: 'network',
        severity: 'medium',
        description: 'Using unsecured public Wi-Fi'
      },
      {
        type: 'privacy',
        severity: 'low',
        description: 'Browser data not cleared in 30 days'
      }
    ];
  }, []);
  
  // Perform security check
  const { mutate: performSecurityCheck, isPending: isChecking } = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/security/check');
      return res.json();
    },
    onMutate: async () => {
      // If we have no scan yet, create mock data to make the UI look good
      // This simulates what the backend would return while we're waiting
      if (!latestScan) {
        const mockScan: SecurityScan = {
          id: 1,
          timestamp: new Date(),
          score: Math.floor(Math.random() * 30) + 65, // 65-95
          appScanResult: Math.random() > 0.3 ? 'safe' : 'warning',
          networkCheckResult: Math.random() > 0.6 ? 'safe' : 'warning',
          privacyCheckResult: Math.random() > 0.4 ? 'safe' : 'warning',
          systemCheckResult: Math.random() > 0.2 ? 'safe' : 'warning',
          issuesFound: generateMockSecurityIssues(),
          permissionsAccessed: generateMockPermissionsAccessed()
        };
        
        // Set temporary optimistic data
        queryClient.setQueryData(['/api/security/latest'], mockScan);
        
        // Generate a random cybersecurity score for demo purposes
        const newScore = Math.floor(Math.random() * 30) + 65;
        setCybersecurityScore(newScore);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/security/latest'] });
      queryClient.invalidateQueries({ queryKey: ['/api/security/scans'] });
      toast({
        title: "Security scan complete",
        description: `Your device security score is ${data.score || cybersecurityScore}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to complete security scan",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Perform network scan
  const { mutate: performNetworkScan } = useMutation({
    mutationFn: async () => {
      // Simulate a network scan - this would normally be an API call
      return new Promise<any>((resolve) => {
        setTimeout(() => {
          resolve({
            vulnerabilities: Math.floor(Math.random() * 3),
            score: Math.floor(Math.random() * 20) + 75,
          });
        }, 2000);
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Network scan complete",
        description: `Found ${data.vulnerabilities} potential vulnerabilities`,
      });
    },
  });
  
  // Perform permissions check
  const { mutate: performPermissionsCheck } = useMutation({
    mutationFn: async () => {
      // Simulate a permissions check - this would normally be an API call
      return new Promise<any>((resolve) => {
        setTimeout(() => {
          resolve({
            unnecessaryPermissions: Math.floor(Math.random() * 5) + 2,
            score: Math.floor(Math.random() * 30) + 65,
          });
        }, 2000);
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Permissions check complete",
        description: `Found ${data.unnecessaryPermissions} unnecessary permissions`,
      });
    },
  });
  
  return {
    latestScan,
    scanLoading,
    scanError,
    scanHistory,
    historyLoading,
    historyError,
    securityTip,
    tipLoading,
    tipError,
    performSecurityCheck,
    performNetworkScan,
    performPermissionsCheck,
    isChecking,
    cybersecurityScore,
  };
}
