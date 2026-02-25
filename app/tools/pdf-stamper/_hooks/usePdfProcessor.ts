"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { hexToRgb, getPageIndices, calculateDrawPosition } from '../_lib/pdf-utils';
import type { StampConfig, PdfState } from '../_lib/types';
import { PDF_DIMENSIONS } from '../_lib/types';

const DEBOUNCE_DELAY = 500;

interface UsePdfProcessorReturn {
  pdfState: PdfState;
  handleFileUpload: (file: File) => Promise<void>;
  handleRemoveFile: () => void;
  handleDownload: () => void;
  processPdf: () => Promise<void>;
}

export function usePdfProcessor(config: StampConfig): UsePdfProcessorReturn {
  const [pdfState, setPdfState] = useState<PdfState>({
    file: null,
    bytes: null,
    previewUrl: null,
    totalPages: 0,
    isProcessing: false,
    error: null,
  });

  // Store config in ref to avoid dependency issues with debounced effect
  const configRef = useRef(config);
  configRef.current = config;

  // Cleanup URL on unmount
  useEffect(() => {
    return () => {
      if (pdfState.previewUrl) {
        URL.revokeObjectURL(pdfState.previewUrl);
      }
    };
  }, [pdfState.previewUrl]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') {
      setPdfState((prev) => ({
        ...prev,
        error: 'Vui lòng chọn đúng định dạng file PDF.',
        file: null,
        bytes: null,
      }));
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const totalPages = pdfDoc.getPageCount();

      setPdfState((prev) => ({
        ...prev,
        file,
        bytes: arrayBuffer,
        totalPages,
        error: null,
      }));
    } catch {
      setPdfState((prev) => ({
        ...prev,
        error: 'Không thể đọc file PDF. Vui lòng kiểm tra file và thử lại.',
        file: null,
        bytes: null,
      }));
    }
  }, []);

  const handleRemoveFile = useCallback(() => {
    setPdfState((prev) => {
      if (prev.previewUrl) {
        URL.revokeObjectURL(prev.previewUrl);
      }
      return {
        file: null,
        bytes: null,
        previewUrl: null,
        totalPages: 0,
        isProcessing: false,
        error: null,
      };
    });
  }, []);

  const processPdf = useCallback(async () => {
    const { bytes } = pdfState;
    if (!bytes) return;

    const currentConfig = configRef.current;

    try {
      setPdfState((prev) => ({ ...prev, isProcessing: true, error: null }));

      const pdfDoc = await PDFDocument.load(bytes);
      // Enable Unicode-capable custom fonts (supports tiếng Việt, e.g. "ọ")
      pdfDoc.registerFontkit(fontkit);

      const totalPages = pdfDoc.getPageCount();
      const selectedIndices = getPageIndices(currentConfig.pageRange, totalPages);
      // Dùng font Noto Sans (chữ in chuẩn sách giáo khoa, hỗ trợ tiếng Việt)
      const fontBytes = await fetch('/fonts/Noto_Sans/NotoSans-Regular.ttf').then((res) =>
        res.arrayBuffer()
      );
      // Không subset để tránh mọi vấn đề với bảng ký tự tiếng Việt
      const font = await pdfDoc.embedFont(new Uint8Array(fontBytes));
      const pages = pdfDoc.getPages();
      const rgbColor = hexToRgb(currentConfig.color);

      pages.forEach((page, index) => {
        if (selectedIndices && !selectedIndices.has(index)) {
          return;
        }

        const { width, height } = page.getSize();
        const rotation = page.getRotation().angle;

        // Scale touchpad coordinates (based on PDF_DIMENSIONS) to actual page size
        const scaledX = (currentConfig.x / PDF_DIMENSIONS.WIDTH) * width;
        const scaledY = (currentConfig.y / PDF_DIMENSIONS.HEIGHT) * height;

        const { x: drawX, y: drawY, rotate: drawRotate } = calculateDrawPosition(
          scaledX,
          scaledY,
          width,
          height,
          rotation
        );

        const normalizedText = currentConfig.text.normalize('NFC');
        // Hỗ trợ placeholder trang: {page} = trang hiện tại (1-based), {pages} = tổng số trang
        const pageAwareText = normalizedText
          .replace(/\{page\}/gi, String(index + 1))
          .replace(/\{pages\}/gi, String(totalPages));

        page.drawText(pageAwareText, {
          x: drawX,
          y: drawY,
          size: currentConfig.fontSize,
          font,
          color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
          opacity: currentConfig.opacity,
          lineHeight: currentConfig.lineHeight,
          rotate: degrees(drawRotate),
        });
      });

      const pdfBytesOutput = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytesOutput)], { type: 'application/pdf' });
      const newUrl = URL.createObjectURL(blob);

      setPdfState((prev) => {
        if (prev.previewUrl) {
          URL.revokeObjectURL(prev.previewUrl);
        }
        return { ...prev, previewUrl: newUrl, isProcessing: false };
      });
    } catch (err) {
      console.error('Error processing PDF:', err);
      setPdfState((prev) => ({
        ...prev,
        error: 'Có lỗi xảy ra khi xử lý file PDF. Vui lòng thử lại.',
        isProcessing: false,
      }));
    }
  }, [pdfState.bytes]);

  // Auto-process with debounce when config changes
  useEffect(() => {
    if (!pdfState.bytes) return;

    const timer = setTimeout(() => {
      processPdf();
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [
    pdfState.bytes,
    config.text,
    config.pageRange,
    config.x,
    config.y,
    config.fontSize,
    config.color,
    config.opacity,
    config.lineHeight,
    processPdf,
  ]);

  const handleDownload = useCallback(() => {
    const { previewUrl, file } = pdfState;
    if (!previewUrl || !file) return;

    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = `edited_${file.name}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, [pdfState.previewUrl, pdfState.file]);

  return {
    pdfState,
    handleFileUpload,
    handleRemoveFile,
    handleDownload,
    processPdf,
  };
}

