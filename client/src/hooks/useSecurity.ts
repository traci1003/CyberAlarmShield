import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { SecurityScan, SecurityTip } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export function useSecurity() {
  const { toast } = useToast();
  
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
  
  // Perform security check
  const { mutate: performSecurityCheck, isPending: isChecking } = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/security/check');
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/security/latest'] });
      queryClient.invalidateQueries({ queryKey: ['/api/security/scans'] });
      toast({
        title: "Security scan complete",
        description: `Your device security score is ${data.score}`,
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
    isChecking,
  };
}
