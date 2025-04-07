import React from "react";
import { Shield, Clock, Bell } from "lucide-react";

export function Header() {
  return (
    <div className="flex items-center justify-center pt-4 pb-2">
      <div className="flex items-center space-x-2">
        <Shield className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-primary animate-pulse">Cyber</span>
          <span className="text-foreground">Clock</span>
        </h1>
      </div>
    </div>
  );
}