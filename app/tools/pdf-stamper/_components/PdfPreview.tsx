"use client";

import { memo } from 'react';
import { FileText } from 'lucide-react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';

interface PdfPreviewProps {
  previewUrl: string | null;
}

// Static placeholder - hoisted outside component for performance (rendering-hoist-jsx)
const PlaceholderContent = (
  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-8">
    <div className="w-24 h-32 border-2 border-dashed border-border rounded-lg mb-4 flex items-center justify-center bg-muted/50">
      <FileText className="w-10 h-10 opacity-50" />
    </div>
    <p className="text-sm">Tải file lên để xem trước kết quả tại đây</p>
  </div>
);

export const PdfPreview = memo(function PdfPreview({ previewUrl }: PdfPreviewProps) {
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const {
    CurrentPageInput,
    CurrentPageLabel,
    GoToNextPageButton,
    GoToPreviousPageButton,
  } = pageNavigationPluginInstance;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="border-b py-3 flex items-center justify-between gap-3">
        <CardTitle className="text-base">Xem trước</CardTitle>
        {previewUrl && (
          <div className="flex items-center gap-2 text-xs">
            <GoToPreviousPageButton>
              {(props) => (
                <button
                  type="button"
                  onClick={props.onClick}
                  disabled={props.isDisabled}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-border bg-background hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {'<'}
                </button>
              )}
            </GoToPreviousPageButton>

            <div className="flex items-center gap-1">
              <div className="w-14">
                <CurrentPageInput />
              </div>
              <span className="text-muted-foreground whitespace-nowrap">
                /{' '}
                <CurrentPageLabel>
                  {(props) => <span>{props.numberOfPages}</span>}
                </CurrentPageLabel>{' '}
                trang
              </span>
            </div>

            <GoToNextPageButton>
              {(props) => (
                <button
                  type="button"
                  onClick={props.onClick}
                  disabled={props.isDisabled}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-border bg-background hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {'>'}
                </button>
              )}
            </GoToNextPageButton>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0 overflow-hidden relative">
        {previewUrl ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div className="w-full h-[560px] overflow-auto bg-muted/40 rounded-b-xl">
              {/* PDF hiển thị full theo chiều rộng container */}
              <Viewer
                fileUrl={previewUrl}
                plugins={[pageNavigationPluginInstance]}
                defaultScale={1}
              />
            </div>
          </Worker>
        ) : (
          PlaceholderContent
        )}
      </CardContent>
    </Card>
  );
});

