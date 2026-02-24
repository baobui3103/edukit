"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Copy, RefreshCw, Type, Info } from "lucide-react";

type ReplacementRule = readonly [from: string, to: string];

export default function TaoBaiLuyenChuPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [fontSize, setFontSize] = useState(32);
  const [isCopied, setIsCopied] = useState(false);
  const [hp001Rules, setHp001Rules] = useState<ReplacementRule[] | null>(null);

  const outputRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/hp001-rules")
      .then((r) => r.json())
      .then((data: { rules?: ReplacementRule[]; error?: string }) => {
        if (!isMounted) return;
        if (Array.isArray(data.rules) && data.rules.length > 0) {
          setHp001Rules(data.rules);
        } else {
          console.error("Không tải được HP001 rules:", data.error);
          setHp001Rules([]);
        }
      })
      .catch((err) => {
        console.error("Không tải được HP001 rules:", err);
        if (isMounted) setHp001Rules([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const processText = (text: string) => {
    const rules = hp001Rules;
    if (!rules || rules.length === 0) {
      return text;
    }

    // Mô phỏng logic C++: thêm khoảng trắng 2 đầu để bắt các rule dạng " ie", " r", ...
    let result = ` ${text} `;

    for (const [from, to] of rules) {
      // C++ Replace() thay hết occurrences; JS replaceAll() tương đương cho string pattern
      result = result.replaceAll(from, to);
    }

    return result.trim();
  };

  useEffect(() => {
    setOutputText(processText(inputText));
  }, [inputText, hp001Rules]);

  const handleCopy = () => {
    if (!outputText) return;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(outputText).then(() => {
        showCopiedToast();
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = outputText;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        showCopiedToast();
      } catch (error) {
        console.error("Lỗi khi copy", error);
      }
      textArea.remove();
    }
  };

  const showCopiedToast = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const outputStyle: React.CSSProperties = {
    lineHeight: "20px",
    fontFamily:
      '"HP001 4 hang Web", "HP001 4 hang", "HL Truong hoc", "Dancing Script", cursive',
    padding: "16px 24px",
    fontSize: `${fontSize}px`,
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg shadow-md">
              <Type size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                Luyện Chữ Tiểu Học
              </h1>
            </div>
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
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-24 md:w-32 accent-primary"
            />
            <span className="text-sm font-bold text-primary w-8">
              {fontSize}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hướng dẫn */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8 flex items-start gap-3">
          <Info className="shrink-0 mt-0.5 text-primary" size={20} />
          <div className="text-sm leading-relaxed">
            <p className="font-semibold mb-1">Hướng dẫn sử dụng:</p>
            <ol className="list-decimal list-inside space-y-1 ml-1">
              <li>
                Nhập hoặc dán văn bản bình thường vào ô{" "}
                <strong>Văn bản gốc</strong> (bên trái/phía trên).
              </li>
              <li>
                Công cụ (sau này) sẽ tự động xử lý các nét nối chữ khó (như ôi,
                ơi, ơu...) cho phù hợp với font luyện viết.
              </li>
              <li>
                Bấm nút <strong>Copy kết quả</strong> và dán vào file Word{" "}
                <em>(File luyện chữ mẫu.docx)</em> của bạn.
              </li>
              <li>
                Lưu ý: Để hiển thị đúng nhất trên Word, máy tính của bạn cần
                cài đặt sẵn font chữ 4 ô ly chuẩn (vd: HP001).
              </li>
            </ol>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cột Trái: Input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-base font-semibold flex items-center gap-2">
                <span className="bg-muted text-muted-foreground w-6 h-6 rounded flex items-center justify-center text-xs">
                  1
                </span>
                Văn bản gốc
              </label>
              <button
                onClick={() => setInputText("")}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
              >
                <RefreshCw size={14} /> Xóa trắng
              </button>
            </div>

            <textarea
              className="w-full h-80 lg:h-[500px] p-4 bg-card border border-input rounded-xl shadow-inner focus:ring-2 focus:ring-ring focus:border-ring outline-none resize-none transition-shadow text-lg leading-relaxed placeholder:text-muted-foreground"
              placeholder="Gõ hoặc dán văn bản cần tạo file luyện chữ vào đây..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          {/* Cột Phải: Output / Preview */}
          <div className="flex flex-col gap-2 relative">
            <div className="flex items-center justify-between">
              <label className="text-base font-semibold flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-6 h-6 rounded flex items-center justify-center text-xs">
                  2
                </span>
                Văn bản đã xử lý nét nối
              </label>
            </div>

            <div className="relative group w-full h-80 lg:h-[500px] bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
              {/* Vùng hiển thị kết quả (nền trơn) */}
              <div
                ref={outputRef}
                className="flex-grow w-full h-full overflow-y-auto outline-none whitespace-pre-wrap break-words"
                style={outputStyle}
              >
                {outputText || (
                  <span className="text-muted-foreground italic opacity-60">
                    Kết quả sẽ hiển thị tại đây...
                  </span>
                )}
              </div>

              {/* Lớp mờ ở dưới đáy để báo hiệu có thể scroll */}
              <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card to-transparent pointer-events-none opacity-60" />
            </div>

            {/* Nút thao tác dính ở dưới của khối */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
                  isCopied
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {isCopied ? (
                  <>Đã Copy thành công!</>
                ) : (
                  <>
                    <Copy size={18} /> Copy kết quả để dán vào Word
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

