import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Alarm } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export function useAlarms() {
  const { toast } = useToast();
  
  // Get all alarms
  const { 
    data: alarms = [], 
    isLoading: alarmsLoading, 
    error: alarmsError 
  } = useQuery<Alarm[]>({
    queryKey: ['/api/alarms'],
  });
  
  // Create alarm
  const { mutate: createAlarm, isPending: isCreating } = useMutation({
    mutationFn: async (alarm: Omit<Alarm, 'id'>) => {
      const res = await apiRequest('POST', '/api/alarms', alarm);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alarms'] });
      toast({
        title: "Alarm created",
        description: "Your alarm has been successfully created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create alarm",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update alarm
  const { mutate: updateAlarm, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Alarm> }) => {
      const res = await apiRequest('PATCH', `/api/alarms/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alarms'] });
      toast({
        title: "Alarm updated",
        description: "Your alarm has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update alarm",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete alarm
  const { mutate: deleteAlarm, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/alarms/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alarms'] });
      toast({
        title: "Alarm deleted",
        description: "Your alarm has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete alarm",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Toggle alarm active state
  const toggleAlarmActive = (id: number, isActive: boolean) => {
    updateAlarm({ id, data: { isActive } });
  };
  
  return {
    alarms,
    alarmsLoading,
    alarmsError,
    createAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarmActive,
    isCreating,
    isUpdating,
    isDeleting,
  };
}
