import { Type } from "lucide-react";

interface HeaderProps {
  fontSize: number;
  onFontSizeChange: (v: number) => void;
}

export function Header({ fontSize, onFontSizeChange }: HeaderProps) {
  return (
    <header className="bg-card shadow-sm border-b border-border sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg shadow-md">
            <Type size={24} />
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Luyện Chữ Tiểu Học
          </h1>
        </div>
        <div className="flex items-center gap-4 bg-muted p-2 rounded-lg">
          <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">
            Kích cỡ chữ:
          </span>
          <input
            type="range"
            min="20"
            max="60"
            value={fontSize}
            onChange={(e) => onFontSizeChange(Number(e.target.value))}
            className="w-24 md:w-32 accent-primary"
          />
          <span className="text-sm font-bold text-primary w-8">{fontSize}</span>
        </div>
      </div>
    </header>
  );
}
