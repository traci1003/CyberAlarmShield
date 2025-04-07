import React from "react";
import { useLocation, Link } from "wouter";
import { Tab } from "@/lib/types";

interface NavigationProps {
  tabs: Tab[];
}

export function Navigation({ tabs }: NavigationProps) {
  const [location] = useLocation();
  
  // Remove any slashes to get the tab ID
  const currentTab = location.replace(/\//g, "") || "alarm";
  
  return (
    <nav className="bg-muted p-1 pt-0 cyber-border border-b-0 border-x-0">
      {/* Navigation Track - visual element */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-2"></div>
      
      {/* Main Navigation */}
      <div className="flex justify-around relative">
        {/* Active Tab Indicator */}
        <div className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300"
             style={{
               width: `${100 / tabs.length}%`,
               left: `${tabs.findIndex(tab => tab.id === currentTab) * (100 / tabs.length)}%`
             }}>
          <div className="absolute -top-1 left-1/2 w-1 h-1 bg-primary rounded-full transform -translate-x-1/2"></div>
        </div>
        
        {tabs.map((tab) => (
          <Link key={tab.id} href={`/${tab.id}`}>
            <a
              className={`flex flex-col items-center justify-center p-2 relative ${
                currentTab === tab.id 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground hover:text-primary/80 transition-colors"
              }`}
            >
              {currentTab === tab.id && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary/5 rounded-full -z-10"></div>
              )}
              <i className={`${tab.icon} text-xl mb-0.5`}></i>
              <span className="text-xs tracking-wide">{tab.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </nav>
  );
}
