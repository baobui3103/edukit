import { Type } from "lucide-react";

export function Header() {
  return (
    <header className="bg-card shadow-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
        <div className="bg-primary text-primary-foreground p-2 rounded-lg shadow-md">
          <Type size={24} />
        </div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">
          Luyện Chữ Tiểu Học
        </h1>
      </div>
    </header>
  );
}
