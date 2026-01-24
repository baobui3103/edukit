// Types for PDF Stamper feature

export interface StampConfig {
  text: string;
  pageRange: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  opacity: number;
  lineHeight: number;
}

export interface PdfState {
  file: File | null;
  bytes: ArrayBuffer | null;
  previewUrl: string | null;
  totalPages: number;
  isProcessing: boolean;
  error: string | null;
}

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface DrawPosition {
  x: number;
  y: number;
  rotate: number;
}

// PDF A4 standard dimensions in points
export const PDF_DIMENSIONS = {
  WIDTH: 600,
  HEIGHT: 842,
  ASPECT_RATIO: 1 / 1.41,
} as const;

