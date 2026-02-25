"use client";

import { useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { FileText, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Local modules - using direct imports instead of barrel (bundle-barrel-imports)
import { usePdfProcessor } from './_hooks/usePdfProcessor';
import { FileUploadSection } from './_components/FileUploadSection';
import { TextConfigSection } from './_components/TextConfigSection';
import { PositionTouchpad } from './_components/PositionTouchpad';
import { StyleConfigSection } from './_components/StyleConfigSection';
import { ErrorAlert } from './_components/ErrorAlert';
import type { StampConfig } from './_lib/types';

// PDF preview needs browser APIs (pdf.js), so load it only on client
const PdfPreview = dynamic(
  () => import('./_components/PdfPreview').then((mod) => mod.PdfPreview),
  { ssr: false },
);

// Default config values
const DEFAULT_CONFIG: StampConfig = {
  text: 'Tên: ...................',
  pageRange: '',
  x: 50,
  y: 50,
  fontSize: 12,
  color: '#000000',
  opacity: 1,
  lineHeight: 15,
};

export default function PDFStamperPage() {
  // Stamp configuration state
  const [config, setConfig] = useState<StampConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<'upload' | 'content' | 'position' | 'style'>(
    'upload',
  );

  // Memoize config for hook to prevent unnecessary re-renders
  const memoizedConfig = useMemo(() => config, [config]);

  // PDF processor hook
  const { pdfState, handleFileUpload, handleRemoveFile, handleDownload } =
    usePdfProcessor(memoizedConfig);

  // Config update handlers - using functional setState for stable callbacks (rerender-functional-setstate)
  const handleTextChange = useCallback((text: string) => {
    setConfig((prev) => ({ ...prev, text }));
  }, []);

  const handlePageRangeChange = useCallback((pageRange: string) => {
    setConfig((prev) => ({ ...prev, pageRange }));
  }, []);

  const handlePositionChange = useCallback((x: number, y: number) => {
    setConfig((prev) => ({ ...prev, x, y }));
  }, []);

  const handleFontSizeChange = useCallback((fontSize: number) => {
    setConfig((prev) => ({ ...prev, fontSize }));
  }, []);

  const handleLineHeightChange = useCallback((lineHeight: number) => {
    setConfig((prev) => ({ ...prev, lineHeight }));
  }, []);

  const handleColorChange = useCallback((color: string) => {
    setConfig((prev) => ({ ...prev, color }));
  }, []);

  const handleOpacityChange = useCallback((opacity: number) => {
    setConfig((prev) => ({ ...prev, opacity }));
  }, []);

  // File handler wrapper
  const handleFileSelect = useCallback(
    (file: File) => {
      handleFileUpload(file);
      setActiveTab('content');
    },
    [handleFileUpload],
  );

  const hasFile = Boolean(pdfState.file);

  return (
    <div className="min-h-[calc(100vh-72px)] bg-background px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[300px_minmax(0,1.4fr)] gap-4">
        {/* Left Column: Controls */}
        <div className="flex flex-col">
          <Card className="flex flex-col h-full">
            <CardHeader className="border-b py-3 flex-shrink-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="w-5 h-5" />
                Chèn dấu PDF
              </CardTitle>
              <CardDescription className="text-sm">Thêm nội dung vào hàng loạt trang</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {/* File Upload */}
              <FileUploadSection
                file={pdfState.file}
                totalPages={pdfState.totalPages}
                onFileSelect={handleFileSelect}
                onFileRemove={handleRemoveFile}
              />

              {/* Error Display */}
              <ErrorAlert message={pdfState.error} />

              {/* Config Sections in tabs - only show when file is loaded */}
              {hasFile && (
                <>
                  <Separator />

                  <div className="flex gap-1 mb-2 border border-border rounded-lg p-1 bg-muted/40 text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveTab('content')}
                      className={`flex-1 rounded-md px-2 py-1 text-center transition-colors ${
                        activeTab === 'content'
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-background/60'
                      }`}
                    >
                      Nội dung
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('position')}
                      className={`flex-1 rounded-md px-2 py-1 text-center transition-colors ${
                        activeTab === 'position'
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-background/60'
                      }`}
                    >
                      Vị trí
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('style')}
                      className={`flex-1 rounded-md px-2 py-1 text-center transition-colors ${
                        activeTab === 'style'
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-background/60'
                      }`}
                    >
                      Kiểu chữ
                    </button>
                  </div>

                  {activeTab === 'content' && (
                    <TextConfigSection
                      text={config.text}
                      pageRange={config.pageRange}
                      onTextChange={handleTextChange}
                      onPageRangeChange={handlePageRangeChange}
                    />
                  )}

                  {activeTab === 'position' && (
                    <PositionTouchpad
                      x={config.x}
                      y={config.y}
                      onPositionChange={handlePositionChange}
                    />
                  )}

                  {activeTab === 'style' && (
                    <StyleConfigSection
                      fontSize={config.fontSize}
                      lineHeight={config.lineHeight}
                      color={config.color}
                      opacity={config.opacity}
                      onFontSizeChange={handleFontSizeChange}
                      onLineHeightChange={handleLineHeightChange}
                      onColorChange={handleColorChange}
                      onOpacityChange={handleOpacityChange}
                    />
                  )}
                </>
              )}
            </CardContent>

            {/* Download Button */}
            {hasFile && (
              <CardFooter className="border-t p-3 flex-shrink-0">
                <Button
                  onClick={handleDownload}
                  disabled={!pdfState.previewUrl || pdfState.isProcessing}
                  className="w-full"
                  size="sm"
                >
                  {pdfState.isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Tải xuống PDF mới
                    </>
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>

        {/* Right Column: Preview */}
        <div className="flex flex-col">
          <PdfPreview previewUrl={pdfState.previewUrl} />
        </div>
      </div>
    </div>
  );
}
