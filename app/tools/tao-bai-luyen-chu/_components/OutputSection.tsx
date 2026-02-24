"use client";

import { Copy } from "lucide-react";

interface OutputSectionProps {
  outputText: string;
  fontSize: number;
  isCopied: boolean;
  onCopy: () => void;
}

const FONT_FAMILY =
  '"HP001 4 hang Web", "HP001 4 hang", "HL Truong hoc", "Dancing Script", cursive';

export function OutputSection({
  outputText,
  fontSize,
  isCopied,
  onCopy,
}: OutputSectionProps) {
  return (
    <div className="flex flex-col gap-2 relative">
      <div className="flex items-center justify-between">
        <label className="text-base font-semibold flex items-center gap-2">
          <span className="bg-primary text-primary-foreground w-6 h-6 rounded flex items-center justify-center text-xs">
            2
          </span>
          Văn bản đã xử lý nét nối
        </label>
        <button
          onClick={onCopy}
          className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          <Copy size={14} />
          {isCopied ? "Đã copy" : "Copy kết quả"}
        </button>
      </div>
      <div className="relative w-full h-80 lg:h-[500px] bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div
          className="flex-grow w-full overflow-y-auto outline-none whitespace-pre-wrap break-words p-4"
          style={{
            lineHeight: 1.3,
            fontFamily: FONT_FAMILY,
            fontSize: `${fontSize}px`,
          }}
        >
          {outputText || (
            <span className="text-muted-foreground italic opacity-60">
              Kết quả sẽ hiển thị tại đây...
            </span>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card to-transparent pointer-events-none opacity-60" />
      </div>
    </div>
  );
}
