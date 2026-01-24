"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { useSidebar } from "./sidebar-provider";

export function Header() {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <>
      {/* Mobile Header */}
      <header className="h-16 bg-background border-b border-border flex items-center px-4 md:hidden sticky top-0 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="-ml-2">
              <Menu className="w-6 h-6" />
              <span className="sr-only">Open Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-r-0">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <Sidebar className="h-full border-none" />
          </SheetContent>
        </Sheet>
        <Link href="/" className="ml-4 flex items-center gap-2 font-bold text-lg">
          <Image
            src="/icon.png"
            alt="EduKit"
            width={24}
            height={24}
            className="flex-shrink-0"
            priority
          />
          <span>EduKit</span>
        </Link>
        <div className="ml-auto">
          <ModeToggle />
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden md:flex h-16 items-center justify-between px-8 border-b border-border bg-card">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          title={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </Button>
        <div className="ml-auto">
          <ModeToggle />
        </div>
      </header>
    </>
  );
}
