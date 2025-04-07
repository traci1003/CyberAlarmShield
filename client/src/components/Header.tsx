import React from "react";

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-muted">
      <div className="flex items-center">
        <i className="ri-shield-keyhole-line text-primary text-xl mr-2"></i>
        <h1 className="text-xl font-semibold text-foreground">CyberClock</h1>
      </div>
      <div className="flex items-center space-x-3">
        <button aria-label="Settings" className="text-muted-foreground hover:text-foreground">
          <i className="ri-settings-4-line text-xl"></i>
        </button>
        <button aria-label="User Profile" className="text-muted-foreground hover:text-foreground">
          <i className="ri-user-line text-xl"></i>
        </button>
      </div>
    </header>
  );
}
