"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

const LOWER_LETTERS = [
  "a",
  "ă",
  "â",
  "b",
  "c",
  "d",
  "đ",
  "e",
  "ê",
  "g",
  "h",
  "i",
  "k",
  "l",
  "m",
  "n",
  "o",
  "ô",
  "ơ",
  "p",
  "q",
  "ǟ",
  "s",
  "t",
  "u",
  "ư",
  "v",
  "x",
  "y",
];

const HANDWRITING_FONT =
  '"HP001 4 hang Web", "HP001 4 hang", "HL Truong hoc", "Dancing Script", cursive';

type TabId = "lower" | "upper";

export function QuickCopySection() {
  const [activeTab, setActiveTab] = useState<TabId>("lower");
  const [copiedChar, setCopiedChar] = useState<string | null>(null);

  const letters =
    activeTab === "lower"
      ? LOWER_LETTERS
      : LOWER_LETTERS.map((ch) => ch.toUpperCase());

  const handleCopy = async (ch: string) => {
    try {
      await navigator.clipboard.writeText(ch);
      setCopiedChar(ch);
      setTimeout(() => {
        setCopiedChar((current) => (current === ch ? null : current));
      }, 1200);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <section className="mt-6 mb-8 bg-muted/40 border border-border rounded-xl p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div>
          <p className="text-sm font-semibold flex items-center gap-2">
            <Copy size={16} className="text-muted-foreground" />
            Copy nhanh các ký tự
          </p>
          <p className="text-xs text-muted-foreground">
            Bấm vào ký tự để copy nhanh
          </p>
        </div>
        <div className="inline-flex items-center rounded-lg border border-border bg-card p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("lower")}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === "lower"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            Chữ thường
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("upper")}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === "upper"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            CHỮ HOA
          </button>
        </div>
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
        {letters.map((ch) => {
          return (
            <button
              key={`${activeTab}-${ch}`}
              type="button"
              onClick={() => handleCopy(ch)}
              className={`flex items-center justify-center gap-1 rounded-lg border text-base sm:text-lg py-1.5 bg-card hover:bg-accent hover:border-accent transition-colors ${
                copiedChar === ch
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100"
                  : "border-border text-foreground"
              }`}
            >
              <span style={{ fontFamily: HANDWRITING_FONT }}>{ch}</span>
              {copiedChar === ch && (
                <Copy
                  size={14}
                  className="text-emerald-600 dark:text-emerald-300"
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

