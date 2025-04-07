import React, { useEffect, useState } from "react";

export function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format time as HH:MM:SS
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-muted cyber-border relative z-10">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center mr-2 cyberpulse">
          <i className="ri-shield-keyhole-line text-primary text-lg"></i>
        </div>
        <h1 className="text-xl font-bold text-foreground cyber-glow">CyberClock</h1>
      </div>
      
      <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
        <div className="bg-background/80 px-3 py-1 rounded-full flex items-center">
          <i className="ri-global-line text-primary text-sm mr-1"></i>
          <span className="text-xs text-muted-foreground font-mono">{formattedTime}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <button aria-label="Notifications" className="relative text-muted-foreground hover:text-primary transition-colors">
          <i className="ri-notification-3-line text-xl"></i>
          <span className="absolute -top-1 -right-1 bg-accent w-2 h-2 rounded-full"></span>
        </button>
        <button aria-label="Settings" className="text-muted-foreground hover:text-primary transition-colors">
          <i className="ri-settings-4-line text-xl"></i>
        </button>
        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
          <i className="ri-user-line text-primary text-sm"></i>
        </div>
      </div>
    </header>
  );
}
