import { RefreshCw } from "lucide-react";

interface InputSectionProps {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
}

export function InputSection({ value, onChange, onClear }: InputSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-base font-semibold flex items-center gap-2">
          <span className="bg-muted text-muted-foreground w-6 h-6 rounded flex items-center justify-center text-xs">
            1
          </span>
          Văn bản gốc
        </label>
        <button
          onClick={onClear}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
        >
          <RefreshCw size={14} /> Xóa trắng
        </button>
      </div>
      <textarea
        className="w-full h-80 lg:h-[500px] p-4 bg-card border border-input rounded-xl shadow-inner focus:ring-2 focus:ring-ring focus:border-ring outline-none resize-none text-lg leading-relaxed placeholder:text-muted-foreground"
        placeholder="Gõ hoặc dán văn bản cần tạo file luyện chữ..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
