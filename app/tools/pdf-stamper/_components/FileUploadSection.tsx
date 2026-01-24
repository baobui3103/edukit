"use client";

import { memo, useRef, useCallback } from 'react';
import { Upload, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface FileUploadSectionProps {
  file: File | null;
  totalPages: number;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
}

export const FileUploadSection = memo(function FileUploadSection({
  file,
  totalPages,
  onFileSelect,
  onFileRemove,
}: FileUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        onFileSelect(selectedFile);
      }
    },
    [onFileSelect]
  );

  const handleRemove = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileRemove();
  }, [onFileRemove]);

  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold uppercase tracking-wider">
        1. Tải file lên
      </Label>

      {file ? (
        <div className="border-2 border-dashed border-primary/50 bg-accent/50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{file.name}</p>
              {totalPages > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {totalPages} trang
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center transition-all hover:border-primary hover:bg-accent/50 cursor-pointer">
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">
              Kéo thả hoặc chọn file PDF
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

