"use client";

import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Stamp } from "lucide-react";
import { useSidebar } from "./sidebar-provider";
import { cn } from "@/lib/utils";

export function Sidebar({ className }: Readonly<{ className?: string }>) {
  const { isCollapsed } = useSidebar();

  const navItems = [
    { name: "Tổng quan", href: "/", icon: LayoutDashboard },
    { name: "Chèn dấu PDF", href: "/tools/pdf-stamper", icon: Stamp },
  ];

  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border h-screen flex flex-col transition-all duration-300 relative",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <Link href="/" className={cn("p-6 transition-all flex items-center gap-3", isCollapsed && "p-4 justify-center")}>
        <Image
          src="/icon.png"
          alt="EduKit"
          width={32}
          height={32}
          className="flex-shrink-0"
          priority
        />
        <h1
          className={cn(
            "text-2xl font-bold text-sidebar-foreground transition-opacity duration-300",
            isCollapsed && "opacity-0 w-0 overflow-hidden"
          )}
        >
          EduKit
        </h1>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors",
              isCollapsed && "justify-center px-2"
            )}
            title={isCollapsed ? item.name : undefined}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span
              className={cn(
                "font-medium transition-opacity duration-300",
                isCollapsed && "opacity-0 w-0 overflow-hidden"
              )}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </nav>

      {/* Footer with version */}
      <div className="p-4 border-t border-sidebar-border">
        <div
          className={cn(
            "text-sm text-muted-foreground text-center transition-opacity duration-300",
            isCollapsed && "opacity-0 h-0 overflow-hidden"
          )}
        >
          v0.2.0
        </div>
      </div>
    </aside>
  );
}
