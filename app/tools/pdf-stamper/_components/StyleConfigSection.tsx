"use client";

import { memo, useCallback } from 'react';
import { Palette } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface StyleConfigSectionProps {
  fontSize: number;
  lineHeight: number;
  color: string;
  opacity: number;
  onFontSizeChange: (size: number) => void;
  onLineHeightChange: (height: number) => void;
  onColorChange: (color: string) => void;
  onOpacityChange: (opacity: number) => void;
}

export const StyleConfigSection = memo(function StyleConfigSection({
  fontSize,
  lineHeight,
  color,
  opacity,
  onFontSizeChange,
  onLineHeightChange,
  onColorChange,
  onOpacityChange,
}: StyleConfigSectionProps) {
  const handleFontSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFontSizeChange(Number.parseInt(e.target.value, 10) || 12);
    },
    [onFontSizeChange]
  );

  const handleLineHeightChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onLineHeightChange(Number.parseInt(e.target.value, 10) || 15);
    },
    [onLineHeightChange]
  );

  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onColorChange(e.target.value);
    },
    [onColorChange]
  );

  const handleOpacityChange = useCallback(
    (values: number[]) => {
      onOpacityChange(values[0]);
    },
    [onOpacityChange]
  );

  return (
    <>
      {/* Font Size & Line Height */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Cỡ chữ</Label>
          <Input
            type="number"
            value={fontSize}
            onChange={handleFontSizeChange}
            min={1}
            max={72}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Giãn dòng</Label>
          <Input
            type="number"
            value={lineHeight}
            onChange={handleLineHeightChange}
            min={1}
            max={100}
          />
        </div>
      </div>

      {/* Color & Opacity */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground flex items-center gap-1">
            <Palette className="w-3 h-3" /> Màu sắc
          </Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={handleColorChange}
              className="w-10 h-10 rounded cursor-pointer border border-border"
            />
            <span className="text-xs text-muted-foreground font-mono">{color}</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Độ đậm: {opacity.toFixed(1)}
          </Label>
          <Slider
            min={0}
            max={1}
            step={0.1}
            value={[opacity]}
            onValueChange={handleOpacityChange}
          />
        </div>
      </div>
    </>
  );
});

