import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  className,
  style,
  onClick,
}: StatCardProps) {
  return (
    <div 
      className={cn(
        "stat-card rounded-xl p-3 sm:p-4 transition-all duration-300 hover:shadow-lg",
        onClick && "cursor-pointer",
        className
      )} 
      style={style}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl sm:text-3xl font-bold font-display">{value}</p>
          {change && (
            <p
              className={cn(
                "mt-2 text-sm font-medium flex items-center gap-1",
                changeType === "positive" && "text-success",
                changeType === "negative" && "text-destructive",
                changeType === "neutral" && "text-muted-foreground"
              )}
            >
              {changeType === "positive" && "↑"}
              {changeType === "negative" && "↓"}
              {change}
            </p>
          )}
        </div>
        <div className="rounded-xl gradient-bg-soft p-2.5 sm:p-3">
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        </div>
      </div>
    </div>
  );
}
