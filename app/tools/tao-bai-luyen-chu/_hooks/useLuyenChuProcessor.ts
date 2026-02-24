"use client";

import { useEffect, useState, useCallback } from "react";
import { processHp001Text } from "../_lib/processText";
import type { ReplacementRule } from "../_lib/types";

export function useLuyenChuProcessor(rules: ReplacementRule[] | null) {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [fontSize, setFontSize] = useState(32);
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
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(outputText).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    } else {
      const ta = document.createElement("textarea");
      ta.value = outputText;
      ta.style.cssText =
        "position:fixed;left:-9999px;top:-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand("copy");
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (e) {
        console.error("Copy failed", e);
      }
      document.body.removeChild(ta);
    }
  }, [outputText]);

  const clearInput = useCallback(() => setInputText(""), []);

  return {
    inputText,
    setInputText,
    outputText,
    fontSize,
    setFontSize,
    isCopied,
    handleCopy,
    clearInput,
  };
}
