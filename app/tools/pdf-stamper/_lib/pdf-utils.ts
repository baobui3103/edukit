import type { RgbColor, DrawPosition } from './types';

/**
 * Convert hex color string to RGB values (0-1 range)
 */
export function hexToRgb(hex: string): RgbColor {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: Number.parseInt(result[1], 16) / 255,
        g: Number.parseInt(result[2], 16) / 255,
        b: Number.parseInt(result[3], 16) / 255,
      }
    : { r: 0, g: 0, b: 0 };
}

/**
 * Check if page number is valid and add to indices set
 */
function addValidPageIndex(pageNum: number, totalPages: number, indices: Set<number>): void {
  if (pageNum >= 1 && pageNum <= totalPages) {
    indices.add(pageNum - 1);
  }
}

/**
 * Parse a range like "3-5" and add all valid indices
 */
function parseRange(rangeMatch: RegExpExecArray, totalPages: number, indices: Set<number>): void {
  const start = Number.parseInt(rangeMatch[1], 10);
  const end = Number.parseInt(rangeMatch[2], 10);
  const min = Math.min(start, end);
  const max = Math.max(start, end);

  for (let i = min; i <= max; i++) {
    addValidPageIndex(i, totalPages, indices);
  }
}

/**
 * Parse page range string to Set of 0-based indices
 * Examples: "1, 3-5" -> Set([0, 2, 3, 4])
 * Returns null if all pages should be selected
 */
export function getPageIndices(rangeStr: string, totalPages: number): Set<number> | null {
  if (!rangeStr?.trim() || rangeStr.toLowerCase() === 'all') {
    return null;
  }

  const indices = new Set<number>();
  const parts = rangeStr.split(',');
  const rangePattern = /^(\d+)\s*-\s*(\d+)$/;

  for (const part of parts) {
    const trimmed = part.trim();
    const rangeMatch = rangePattern.exec(trimmed);

    if (rangeMatch) {
      parseRange(rangeMatch, totalPages, indices);
    } else {
      const pageNum = Number.parseInt(trimmed, 10);
      if (!Number.isNaN(pageNum)) {
        addValidPageIndex(pageNum, totalPages, indices);
      }
    }
  }

  return indices;
}

/**
 * Calculate draw position based on page rotation
 * PDF coordinate system: origin at bottom-left
 * Input (x, y): origin at top-left (browser coordinates)
 */
export function calculateDrawPosition(
  x: number,
  y: number,
  pageWidth: number,
  pageHeight: number,
  rotationAngle: number
): DrawPosition {
  const rotation = rotationAngle % 360;

  switch (rotation) {
    case 90:
      return { x: y, y: x, rotate: 90 };
    case 180:
      return { x: pageWidth - x, y: y, rotate: 180 };
    case 270:
    case -90:
      return { x: pageWidth - y, y: pageHeight - x, rotate: 270 };
    case 0:
    default:
      return { x, y: pageHeight - y, rotate: 0 };
  }
}

