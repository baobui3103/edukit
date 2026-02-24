"use client";

import {
  Header,
  GuideSection,
  DownloadSection,
  InputSection,
  OutputSection,
} from "./_components";
import { useHp001Rules, useLuyenChuProcessor } from "./_hooks";

export default function TaoBaiLuyenChuPage() {
  const hp001Rules = useHp001Rules();
  const {
    inputText,
    setInputText,
    outputText,
    fontSize,
    isCopied,
    handleCopy,
    clearInput,
  } = useLuyenChuProcessor(hp001Rules);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <GuideSection />
        <DownloadSection />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InputSection
            value={inputText}
            onChange={setInputText}
            onClear={clearInput}
          />
          <OutputSection
            outputText={outputText}
            fontSize={fontSize}
            isCopied={isCopied}
            onCopy={handleCopy}
          />
        </div>
      </main>
    </div>
  );
}
