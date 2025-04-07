import React from "react";

interface SecurityTipProps {
  tip: string;
}

export function SecurityTip({ tip }: SecurityTipProps) {
  return (
    <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-6">
      <div className="flex items-start mb-2">
        <i className="ri-lightbulb-line text-primary text-xl mr-2 mt-0.5"></i>
        <h3 className="text-card-foreground font-medium">Security Tip of the Day</h3>
      </div>
      <p className="text-sm text-muted-foreground">{tip}</p>
    </div>
  );
}
