"use client";

import { memo, useCallback } from 'react';
import { Type, Layers } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TextConfigSectionProps {
  text: string;
  pageRange: string;
  onTextChange: (text: string) => void;
  onPageRangeChange: (range: string) => void;
}

export const TextConfigSection = memo(function TextConfigSection({
  text,
  pageRange,
  onTextChange,
  onPageRangeChange,
}: TextConfigSectionProps) {
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onTextChange(e.target.value);
    },
    [onTextChange]
  );

  const handlePageRangeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onPageRangeChange(e.target.value);
    },
    [onPageRangeChange]
  );

  return (
    <>
      {/* Nội dung */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
          <Type className="w-4 h-4" />
          2. Nội dung
        </Label>
        <Textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Nhập nội dung... (Enter để xuống dòng)"
          className="min-h-[100px] resize-y font-mono text-sm"
        />
      </div>

      {/* Phạm vi trang */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4" />
          3. Phạm vi trang
        </Label>
        <Input
          type="text"
          value={pageRange}
          onChange={handlePageRangeChange}
          placeholder="VD: 1, 3-5 (Để trống = Tất cả)"
          className="font-mono text-sm"
        />
      </div>
    </>
  );
});

