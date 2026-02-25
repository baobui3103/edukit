"use client";

import { memo, useMemo } from 'react';
import { FileText } from 'lucide-react';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import type { Plugin } from '@react-pdf-viewer/core';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';

/** Plugin để giữ zoom khi document reload (vd: đổi vị trí stamp -> tạo PDF mới -> previewUrl đổi) */
function createPreserveZoomPlugin(): Plugin {
  let zoomFn: ((scale: number) => void) | null = null;
  let lastScale: number | null = null;
  let lastFileRef: object | null = null;

  return {
    install: (pluginFunctions) => {
      zoomFn = pluginFunctions.zoom;
    },
    onViewerStateChange: (state) => {
      // Chỉ cập nhật lastScale khi user zoom (cùng file), KHÔNG khi document mới load
      if (state.file && lastFileRef === state.file) {
        lastScale = state.scale;
      }
      lastFileRef = state.file ?? null;
      return state;
    },
    onDocumentLoad: () => {
      const scale = lastScale;
      const zoom = zoomFn;
      if (scale != null && zoom) {
        zoom(scale);
        setTimeout(() => zoom(scale), 100);
      }
    },
  };
}

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
  const zoomPluginInstance = zoomPlugin();
  const preserveZoomPluginInstance = useMemo(() => createPreserveZoomPlugin(), []);
  const { CurrentPageInput, CurrentPageLabel, GoToNextPage, GoToPreviousPage } =
    pageNavigationPluginInstance;
  const { ZoomIn, ZoomOut } = zoomPluginInstance;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="border-b py-3 flex items-center justify-between gap-3 flex-wrap">
        <CardTitle className="text-base">Xem trước</CardTitle>
        {previewUrl && (
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <div className="flex items-center gap-1 border-r border-border pr-2 mr-1">
              <ZoomIn>
                {(props) => (
                  <button
                    type="button"
                    onClick={props.onClick}
                    className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-border bg-background hover:bg-accent"
                    title="Phóng to"
                  >
                    +
                  </button>
                )}
              </ZoomIn>
              <ZoomOut>
                {(props) => (
                  <button
                    type="button"
                    onClick={props.onClick}
                    className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-border bg-background hover:bg-accent"
                    title="Thu nhỏ"
                  >
                    −
                  </button>
                )}
              </ZoomOut>
            </div>
            <GoToPreviousPage>
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
            </GoToPreviousPage>

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

            <GoToNextPage>
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
            </GoToNextPage>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0 overflow-hidden relative">
        {previewUrl ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div className="w-full h-[560px] overflow-auto bg-muted/40 rounded-b-xl">
              {/* PDF hiển thị to, fit theo chiều rộng container */}
              <Viewer
                fileUrl={previewUrl}
                plugins={[pageNavigationPluginInstance, zoomPluginInstance, preserveZoomPluginInstance]}
                defaultScale={SpecialZoomLevel.PageFit}
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

