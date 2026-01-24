"use client";

import { memo } from 'react';
import { Move, MousePointer2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useTouchpadDrag } from '../_hooks/useTouchpadDrag';
import { PDF_DIMENSIONS } from '../_lib/types';

interface PositionTouchpadProps {
  x: number;
  y: number;
  onPositionChange: (x: number, y: number) => void;
}

export const PositionTouchpad = memo(function PositionTouchpad({
  x,
  y,
  onPositionChange,
}: PositionTouchpadProps) {
  const { padRef, isDragging, handlers } = useTouchpadDrag({
    onPositionChange,
  });

  // Calculate percentage for cursor position
  const xPercent = (x / PDF_DIMENSIONS.WIDTH) * 100;
  const yPercent = (y / PDF_DIMENSIONS.HEIGHT) * 100;

  return (
    <div className="space-y-4">
      <Label className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
        <Move className="w-4 h-4" />
        4. Vị trí (Kéo thả) & Kiểu
      </Label>

      <div className="bg-muted p-4 rounded-xl border">
        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
          <MousePointer2 className="w-3 h-3" /> Kéo điểm tròn để chỉnh vị trí trên trang
        </p>

        <div
          ref={padRef}
          {...handlers}
          className="w-full aspect-[1/1.41] bg-background border-2 border-dashed border-border rounded relative cursor-crosshair shadow-sm overflow-hidden select-none"
        >
          {/* Grid lines */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-border/50 pointer-events-none" />
          <div className="absolute left-1/2 top-0 h-full w-px bg-border/50 pointer-events-none" />

          {/* Position cursor */}
          <div
            className={`absolute w-4 h-4 rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 border-2 border-background transition-transform pointer-events-none ${
              isDragging ? 'bg-primary scale-125' : 'bg-destructive'
            }`}
            style={{
              left: `${xPercent}%`,
              top: `${yPercent}%`,
            }}
          />

          {/* Coordinates tooltip */}
          <div className="absolute bottom-1 right-1 text-[10px] text-muted-foreground font-mono bg-background/80 px-1 rounded pointer-events-none">
            X:{x} Y:{y}
          </div>
        </div>
      </div>
    </div>
  );
});

