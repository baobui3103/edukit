"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Stamp,
  Type,
  User2,
  Mail,
  Phone,
  Github,
  Globe2,
  X,
} from "lucide-react";
import { useSidebar } from "./sidebar-provider";
import { cn } from "@/lib/utils";

export function Sidebar({ className }: Readonly<{ className?: string }>) {
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();
  const [isContactOpen, setIsContactOpen] = useState(false);

  const navItems = [
    { name: "Tổng quan", href: "/", icon: LayoutDashboard },
    { name: "Chèn dấu PDF", href: "/tools/pdf-stamper", icon: Stamp },
    { name: "Tạo bài luyện chữ", href: "/tools/tao-bai-luyen-chu", icon: Type },
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
      <Link
        href="/"
        className={cn(
          "p-6 transition-all flex items-center gap-3",
          isCollapsed && "p-4 justify-center"
        )}
      >
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
      <nav
        className={cn(
          "flex-1 px-4",
          isCollapsed ? "space-y-1" : "space-y-2"
        )}
      >
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                isCollapsed && "justify-center px-2 gap-0"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span
                className={cn(
                  "font-medium transition-opacity duration-300",
                  isCollapsed && "hidden"
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center justify-center">
          {isCollapsed ? (
            <button
              type="button"
              onClick={() => setIsContactOpen(true)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] shadow-sm hover:bg-primary/90"
              title="Thông tin liên hệ"
            >
              <User2 className="h-3.5 w-3.5" />
            </button>
          ) : (
            <p className="text-xs text-muted-foreground text-center">
              <span className="mr-1 text-[11px]">Powered by</span>
              <button
                type="button"
                onClick={() => setIsContactOpen(true)}
                className="font-semibold text-primary hover:underline"
              >
                baobui3103
              </button>
            </p>
          )}
        </div>
      </div>

      {isContactOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4"
          onClick={() => setIsContactOpen(false)}
        >
          <div
            className="max-w-sm w-full rounded-xl bg-card border border-border shadow-xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold leading-tight">
                    Thông tin liên hệ
                  </h2>
                  <p className="text-[11px] text-muted-foreground">
                    Hỗ trợ EduKit &amp; Luyện Chữ Tiểu Học
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsContactOpen(false)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                aria-label="Đóng"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Nếu bạn cần hỗ trợ thêm về công cụ Luyện Chữ Tiểu Học hoặc các dự án
              khác, có thể liên hệ:
            </p>
            <div className="space-y-2 pt-1 text-xs text-foreground">
              <div className="flex items-center gap-2">
                <User2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-medium">Bảo Bùi (baobui3103)</span>
              </div>
              <a
                href="https://www.facebook.com/baobui3103"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-primary"
              >
                <Globe2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span>facebook.com/baobui3103</span>
              </a>
              <a
                href="https://github.com/baobui3103"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-primary"
              >
                <Github className="h-3.5 w-3.5 text-muted-foreground" />
                <span>github.com/baobui3103</span>
              </a>
              <a
                href="mailto:hongbao2003@gmail.com"
                className="flex items-center gap-2 hover:text-primary"
              >
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                <span>hongbao2003@gmail.com</span>
              </a>
              <a
                href="tel:0908141453"
                className="flex items-center gap-2 hover:text-primary"
              >
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                <span>0908&nbsp;141&nbsp;453</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
