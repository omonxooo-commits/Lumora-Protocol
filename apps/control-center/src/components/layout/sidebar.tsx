"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  CheckSquare,
  Vote,
  Vault,
  AlertTriangle,
  Settings,
  Zap,
} from "lucide-react";
import { cn } from "@lumora/ui";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pools", label: "Asset Pools", icon: Layers },
  { href: "/milestones", label: "Milestones", icon: CheckSquare },
  { href: "/governance", label: "Governance", icon: Vote },
  { href: "/treasury", label: "Treasury", icon: Vault },
  { href: "/disputes", label: "Disputes", icon: AlertTriangle },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col border-r border-white/5 bg-gray-950">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-white/5 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">Lumora</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">
            Control Center
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-violet-600/20 text-violet-300"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/5 p-4">
        <p className="text-xs text-gray-600">Lumora Protocol v0.1.0</p>
        <p className="text-xs text-gray-600">Stellar Testnet</p>
      </div>
    </aside>
  );
}
