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
    <nav className="bg-muted p-1">
      <div className="flex justify-around">
        {tabs.map((tab) => (
          <Link key={tab.id} href={`/${tab.id}`}>
            <a
              className={`flex flex-col items-center justify-center p-2 ${
                currentTab === tab.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <i className={`${tab.icon} text-xl`}></i>
              <span className="text-xs mt-1">{tab.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </nav>
  );
}
