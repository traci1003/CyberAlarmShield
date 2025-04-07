import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alarm } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { formatTimeForInput } from "@/lib/utils";

const daysOfWeek = [
  { id: "mon", label: "M" },
  { id: "tue", label: "T" },
  { id: "wed", label: "W" },
  { id: "thu", label: "T" },
  { id: "fri", label: "F" },
  { id: "sat", label: "S" },
  { id: "sun", label: "S" },
];

// Define Zod schema for form validation
const alarmFormSchema = z.object({
  time: z.string().min(1, "Time is required"),
  label: z.string().optional(),
  days: z.array(z.string()).min(1, "Select at least one day"),
  sound: z.boolean().default(true),
  vibrate: z.boolean().default(true),
  volumeLevel: z.number().min(1).max(100).default(80),
  mathProblem: z.boolean().default(false),
  securityScan: z.boolean().default(false),
  phishingDrill: z.boolean().default(false),
  gradualVolume: z.boolean().default(false),
  snoozeCount: z.number().min(0).max(5).default(3),
  snoozeDuration: z.number().min(1).max(30).default(5),
});

type AlarmFormValues = z.infer<typeof alarmFormSchema>;

interface AlarmFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: AlarmFormValues) => void;
  defaultValues?: Partial<AlarmFormValues>;
  title?: string;
}

export function AlarmForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  defaultValues = {
    time: formatTimeForInput(new Date()),
    label: "",
    days: ["mon", "tue", "wed", "thu", "fri"],
    sound: true,
    vibrate: true,
    volumeLevel: 80,
    mathProblem: false,
    securityScan: true,
    phishingDrill: false,
    gradualVolume: false,
    snoozeCount: 3,
    snoozeDuration: 5,
  },
  title = "Add New Alarm"
}: AlarmFormProps) {
  const form = useForm<AlarmFormValues>({
    resolver: zodResolver(alarmFormSchema),
    defaultValues,
  });

  const handleSubmit = (values: AlarmFormValues) => {
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-2">
            {/* Time Picker */}
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      className="text-xl h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Label */}
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Alarm label" 
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Days of Week */}
            <FormField
              control={form.control}
              name="days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repeat on days</FormLabel>
                  <div className="flex justify-between items-center">
                    {daysOfWeek.map((day) => (
                      <div 
                        key={day.id} 
                        className={`flex flex-col items-center justify-center w-10 h-10 rounded-full cursor-pointer border-2 
                        ${field.value?.includes(day.id) 
                            ? "border-primary bg-primary text-primary-foreground" 
                            : "border-muted-foreground text-muted-foreground"}`}
                        onClick={() => {
                          const updatedDays = field.value?.includes(day.id)
                            ? field.value.filter(d => d !== day.id)
                            : [...(field.value || []), day.id];
                          field.onChange(updatedDays);
                        }}
                      >
                        {day.label}
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sound & Vibration Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Alarm Settings</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sound"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-0.5">
                        <FormLabel>Sound</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="vibrate"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-0.5">
                        <FormLabel>Vibration</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Volume Level - Only show if sound is enabled */}
              {form.watch("sound") && (
                <FormField
                  control={form.control}
                  name="volumeLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Volume Level ({field.value}%)</FormLabel>
                      <FormControl>
                        <Input
                          type="range"
                          min="1"
                          max="100"
                          value={field.value}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                          className="w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              {/* Gradual Volume Increase - Only show if sound is enabled */}
              {form.watch("sound") && (
                <FormField
                  control={form.control}
                  name="gradualVolume"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-0.5">
                        <FormLabel>Gradual Volume Increase</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Snooze Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Snooze Settings</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="snoozeCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Snooze Count</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="5"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="snoozeDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Snooze Minutes</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="30"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 5)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Wake-up Challenge Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Wake-up Challenges</h3>
              
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="mathProblem"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-0.5">
                        <FormLabel>Math Problems</FormLabel>
                        <p className="text-xs text-muted-foreground">Solve math problems to dismiss</p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="securityScan"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-0.5">
                        <FormLabel>Security Scan</FormLabel>
                        <p className="text-xs text-muted-foreground">Run a security scan to dismiss</p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phishingDrill"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-0.5">
                        <FormLabel>Phishing Drill</FormLabel>
                        <p className="text-xs text-muted-foreground">Take a quick phishing awareness test</p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Alarm</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}