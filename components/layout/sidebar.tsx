import Link from "next/link";
import { LayoutDashboard, PenTool, Settings } from "lucide-react";

export function Sidebar({ className }: { className?: string }) {
  const navItems = [
    { name: "Tổng quan", href: "/", icon: LayoutDashboard },
    { name: "Công cụ", href: "/tools", icon: PenTool },
    { name: "Cài đặt", href: "/settings", icon: Settings },
  ];

  return (
    <aside
      className={`w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col ${className}`}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold text-sidebar-foreground">
          EduKit
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors"
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-sm text-muted-foreground text-center">
          v0.1.0
        </div>
      </div>
    </aside>
  );
}
