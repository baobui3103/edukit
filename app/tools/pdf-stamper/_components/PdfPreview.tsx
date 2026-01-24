"use client";

import { memo } from 'react';
import { FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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
  return (
    <Card className="flex-1 flex flex-col min-h-0 h-full">
      <CardHeader className="border-b py-3 flex-shrink-0">
        <CardTitle className="text-base">Xem trước</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden relative min-h-0">
        {previewUrl ? (
          <iframe
            src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full border-0"
            title="PDF Preview"
          />
        ) : (
          PlaceholderContent
        )}
      </CardContent>
    </Card>
  );
});

