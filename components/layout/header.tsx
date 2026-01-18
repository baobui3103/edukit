import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { ModeToggle } from "@/components/mode-toggle";

export function Header() {
  return (
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
      <div className="ml-4 font-bold text-lg">EduKit</div>
      <div className="ml-auto">
        <ModeToggle />
      </div>
    </header>
  );
}
