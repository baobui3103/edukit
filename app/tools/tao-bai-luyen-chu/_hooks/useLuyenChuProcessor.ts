"use client";

import { useEffect, useState, useCallback } from "react";
import { processHp001Text } from "../_lib/processText";
import type { ReplacementRule } from "../_lib/types";

export function useLuyenChuProcessor(rules: ReplacementRule[] | null) {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const fontSize = 28;
  const [isCopied, setIsCopied] = useState(false);

  const processText = useCallback(
    (text: string) => processHp001Text(text, rules),
    [rules]
  );

  useEffect(() => {
    setOutputText(processText(inputText));
  }, [inputText, processText]);

  const handleCopy = useCallback(() => {
    if (!outputText) return;

    const plainText = outputText;
    const fontFamily = "HP001 4 hang";
    const fontSizePt = 18;

    async function copyWithFormatting() {
      try {
        const anyNavigator = navigator as Navigator & {
          clipboard?: {
            write?: (items: ClipboardItem[]) => Promise<void>;
            writeText?: (text: string) => Promise<void>;
          };
        };

        const ClipboardItemCtor =
          typeof window !== "undefined"
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (window as any).ClipboardItem
            : undefined;

        if (
          anyNavigator.clipboard &&
          typeof anyNavigator.clipboard.write === "function" &&
          ClipboardItemCtor
        ) {
          const escapeHtml = (value: string) =>
            value
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#39;");

          const html = `<div style="font-family: '${fontFamily}'; font-size: ${fontSizePt}pt; white-space: pre-wrap;">${escapeHtml(
            plainText
          )}</div>`;

          const htmlBlob = new Blob([html], { type: "text/html" });
          const textBlob = new Blob([plainText], { type: "text/plain" });

          const item = new ClipboardItemCtor({
            "text/html": htmlBlob,
            "text/plain": textBlob,
          });

          await anyNavigator.clipboard.write([item]);
        } else if (anyNavigator.clipboard?.writeText) {
          await anyNavigator.clipboard.writeText(plainText);
        } else {
          const ta = document.createElement("textarea");
          ta.value = plainText;
          ta.style.cssText = "position:fixed;left:-9999px;top:-9999px";
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
        }

        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (e) {
        console.error("Copy failed", e);
        try {
          await navigator.clipboard.writeText(plainText);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
          console.error("Fallback copy failed", err);
        }
      document.body.removeChild(ta);
      }
    }

    void copyWithFormatting();
  }, [outputText]);

  const clearInput = useCallback(() => setInputText(""), []);

  return {
    inputText,
    setInputText,
    outputText,
    fontSize,
    isCopied,
    handleCopy,
    clearInput,
  };
}
