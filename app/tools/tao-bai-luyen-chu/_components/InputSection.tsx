import { useState } from "react";
import { RefreshCw, Sparkles } from "lucide-react";

interface InputSectionProps {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
}

export function InputSection({ value, onChange, onClear }: InputSectionProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-base font-semibold flex items-center gap-2">
          <span className="bg-muted text-muted-foreground w-6 h-6 rounded flex items-center justify-center text-xs">
            1
          </span>
          Văn bản gốc
        </label>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <button
            onClick={onClear}
            className="hover:text-destructive transition-colors flex items-center gap-1"
          >
            <RefreshCw size={14} /> Xóa trắng
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Sparkles size={14} />
              Chuyển đổi
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-56 rounded-lg border border-border bg-popover shadow-lg z-10 text-xs py-1">
                <p className="px-3 py-1.5 text-[11px] text-muted-foreground border-b border-border">
                  Các thao tác nhanh với văn bản hiện tại
                </p>
                <button
                  type="button"
                  className="w-full text-left px-3 py-1.5 hover:bg-accent transition-colors"
                  onClick={() => {
                    onChange(value.toLowerCase());
                    setMenuOpen(false);
                  }}
                >
                  Chuyển hết về chữ thường
                </button>
                <button
                  type="button"
                  className="w-full text-left px-3 py-1.5 hover:bg-accent transition-colors"
                  onClick={() => {
                    onChange(value.toUpperCase());
                    setMenuOpen(false);
                  }}
                >
                  Chuyển hết về CHỮ HOA
                </button>
                <button
                  type="button"
                  className="w-full text-left px-3 py-1.5 hover:bg-accent transition-colors"
                  onClick={() => {
                    onChange(
                      value.replace(
                        /(^\s*\p{L}|\.\s*\p{L}|\?\s*\p{L}|!\s*\p{L})/gu,
                        (match) => match.toUpperCase()
                      )
                    );
                    setMenuOpen(false);
                  }}
                >
                  Viết hoa chữ cái đầu câu
                </button>
                <button
                  type="button"
                  className="w-full text-left px-3 py-1.5 hover:bg-accent transition-colors"
                  onClick={() => {
                    onChange(
                      value.replace(
                        /\p{L}+/gu,
                        (word) =>
                          word[0]?.toUpperCase() + word.slice(1).toLowerCase()
                      )
                    );
                    setMenuOpen(false);
                  }}
                >
                  Viết hoa chữ cái đầu mỗi từ
                </button>
              </div>
            )}
          </div>
        </div>
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
