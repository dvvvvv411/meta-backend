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
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  className,
  style,
}: StatCardProps) {
  return (
    <div className={cn("stat-card", className)} style={style}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold font-display">{value}</p>
          {change && (
            <p
              className={cn(
                "mt-2 text-sm font-medium",
                changeType === "positive" && "text-success",
                changeType === "negative" && "text-destructive",
                changeType === "neutral" && "text-muted-foreground"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className="rounded-xl gradient-bg-soft p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
}
