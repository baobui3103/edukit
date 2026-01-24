"use client";

import { useState, useCallback, useEffect, useRef, type RefObject } from 'react';
import { PDF_DIMENSIONS } from '../_lib/types';

interface UseTouchpadDragOptions {
  initialX?: number;
  initialY?: number;
  onPositionChange: (x: number, y: number) => void;
}

interface UseTouchpadDragReturn {
  padRef: RefObject<HTMLDivElement | null>;
  isDragging: boolean;
  handlers: {
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
  };
}

export function useTouchpadDrag({
  onPositionChange,
}: UseTouchpadDragOptions): UseTouchpadDragReturn {
  const padRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePadMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!padRef.current) return;

      const rect = padRef.current.getBoundingClientRect();
      let relativeX = (clientX - rect.left) / rect.width;
      let relativeY = (clientY - rect.top) / rect.height;

      // Clamp values between 0 and 1
      relativeX = Math.max(0, Math.min(1, relativeX));
      relativeY = Math.max(0, Math.min(1, relativeY));

      // Map to PDF coordinates
      const newX = Math.round(relativeX * PDF_DIMENSIONS.WIDTH);
      const newY = Math.round(relativeY * PDF_DIMENSIONS.HEIGHT);

      onPositionChange(newX, newY);
    },
    [onPositionChange]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      handlePadMove(e.clientX, e.clientY);
    },
    [handlePadMove]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        handlePadMove(e.clientX, e.clientY);
      }
    },
    [isDragging, handlePadMove]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true);
      const touch = e.touches[0];
      handlePadMove(touch.clientX, touch.clientY);
    },
    [handlePadMove]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isDragging) {
        const touch = e.touches[0];
        handlePadMove(touch.clientX, touch.clientY);
      }
    },
    [isDragging, handlePadMove]
  );

  // Global event listeners for mouseup/touchend
  useEffect(() => {
    if (isDragging) {
      globalThis.addEventListener('mouseup', handleMouseUp);
      globalThis.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      globalThis.removeEventListener('mouseup', handleMouseUp);
      globalThis.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseUp]);

  return {
    padRef,
    isDragging,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
    },
  };
}

