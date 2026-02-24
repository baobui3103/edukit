"use client";

import { ImageGuidePage, type ImageGuideTab } from "@/components/tools/image-guide-page";

const IMAGE_FILES = [
  "01 dòng - 02 ô.png",
  "01 dòng - 03 ô.png",
  "01 dòng - 04 ô.png",
  "01 dòng - 05 ô.png",
  "01 dòng - 06 ô.png",
  "01 dòng - 08 ô.png",
  "01 dòng - 09 ô.png",
  "01 dòng - 15 ô.png",
  "01 dòng - 17 ô.png",
  "02 dòng - 05 ô.png",
  "02 dòng - 15 ô.png",
  "02 dòng - 17 ô.png",
  "03 dòng - 03 ô.png",
  "03 dòng - 08 ô.png",
  "03 dòng - 10 ô.png",
  "03 dòng - 15 ô.png",
  "03 dòng - 16 ô.png",
  "03 dòng - 17 ô.png",
  "04 dòng - 08 ô.png",
  "04 dòng - 15 ô.png",
  "04 dòng - 17 ô.png",
  "05 dòng - 04.png",
  "05 dòng - 05 ô.png",
  "05 dòng - 08 ô.png",
  "05 dòng - 15 ô.png",
  "05 dòng - 17 ô.png",
  "06 dòng - 08 ô.png",
  "06 dòng - 10 ô.png",
  "06 dòng - 15 ô.png",
  "06 dòng - 17 ô.png",
  "07 dòng - 15 ô.png",
  "07 dòng - 17 ô.png",
  "08 dòng - 10 ô.png",
  "08 dòng - 11 ô.png",
  "08 dòng - 15 ô.png",
  "08 dòng - 17 ô.png",
  "09 dòng - 15 ô.png",
  "10 dòng - 15 ô.png",
  "10 dòng - 17 ô.png",
  "11 dòng - 15 ô.png",
  "12 dòng - 15 ô.png",
  "13 dòng - 15 ô.png",
  "14 dòng - 15 ô.png",
  "15 dòng - 15 ô.png",
  "16 dòng - 15 ô.png",
  "17 dòng - 15 ô.png",
  "18 dòng - 15 ô.png",
  "19 dòng - 15 ô.png",
  "20 dòng - 15 ô.png",
] as const;

const TOAN_TABS: readonly ImageGuideTab[] = [
  {
    id: "toan-ke-dong",
    label: "Mẫu kẻ dòng môn Toán",
    basePath: "/download/anh-ke-dong-cho-mon-toan",
    files: IMAGE_FILES,
  },
] as const;

export default function AnhKeDongChoMonToanPage() {
  return (
    <ImageGuidePage
      title="Mẫu kẻ dòng cho môn Toán"
      intro="Bộ ảnh kẻ dòng dùng cho vở, phiếu bài tập môn Toán. Chọn mẫu phù hợp với số dòng và số ô, sau đó tải về để chèn vào tài liệu Word hoặc in trực tiếp."
      fullZipHref="/download/anh-ke-dong-cho-mon-toan.zip"
      tabs={TOAN_TABS}
    />
  );
}

