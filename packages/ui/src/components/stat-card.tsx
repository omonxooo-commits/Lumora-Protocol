import * as React from "react";
import { cn } from "../lib/utils";
import { Card, CardContent } from "./card";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label?: string;
  };
  className?: string;
  accentColor?: "violet" | "emerald" | "amber" | "blue" | "rose";
}

const accentMap = {
  violet: "from-violet-500/20 to-violet-600/5 border-violet-500/20",
  emerald: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20",
  amber: "from-amber-500/20 to-amber-600/5 border-amber-500/20",
  blue: "from-blue-500/20 to-blue-600/5 border-blue-500/20",
  rose: "from-rose-500/20 to-rose-600/5 border-rose-500/20",
};

const iconAccentMap = {
  violet: "bg-violet-500/20 text-violet-400",
  emerald: "bg-emerald-500/20 text-emerald-400",
  amber: "bg-amber-500/20 text-amber-400",
  blue: "bg-blue-500/20 text-blue-400",
  rose: "bg-rose-500/20 text-rose-400",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
  accentColor = "violet",
}: StatCardProps) {
  const isPositive = trend && trend.value >= 0;

  return (
    <Card
      className={cn(
        "bg-gradient-to-br border",
        accentMap[accentColor],
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                iconAccentMap[accentColor]
              )}
            >
              {icon}
            </div>
          )}
        </div>
        {trend && (
          <div className="mt-3 flex items-center gap-1">
            <span
              className={cn(
                "text-xs font-medium",
                isPositive ? "text-emerald-400" : "text-rose-400"
              )}
            >
              {isPositive ? "+" : ""}
              {trend.value}%
            </span>
            {trend.label && (
              <span className="text-xs text-gray-500">{trend.label}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
