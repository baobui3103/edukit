import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const TAB_DIR_MAP = {
  "chu-hoa-kieu-1": "huong-dan-chu-hoa-kieu-1",
  "chu-hoa-kieu-2": "huong-dan-chu-hoa-kieu-2",
  "chu-thuong": "huong-dan-chu-thuong",
  "chu-so": "huong-dan-chu-so",
  "viet-net": "huong-dan-viet-net",
} as const;

type TabKey = keyof typeof TAB_DIR_MAP;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tab = searchParams.get("tab") as TabKey | null;

  if (!tab || !(tab in TAB_DIR_MAP)) {
    return NextResponse.json(
      { error: "Tab không hợp lệ.", images: [] },
      { status: 400 }
    );
  }

  try {
    const dir = path.join(
      process.cwd(),
      "public",
      "download",
      TAB_DIR_MAP[tab]
    );

    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
      return NextResponse.json(
        {
          error: "Không tìm thấy thư mục hình hướng dẫn.",
          images: [],
        },
        { status: 404 }
      );
    }

    const files = fs.readdirSync(dir);

    const imageFiles = files
      .filter((file) => /\.(jpe?g|png)$/i.test(file))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const images = imageFiles.map(
      (file) => `/download/${TAB_DIR_MAP[tab]}/${file}`
    );

    return NextResponse.json({ images });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Lỗi khi đọc danh sách hình hướng dẫn.",
        detail: error instanceof Error ? error.message : String(error),
        images: [],
      },
      { status: 500 }
    );
  }
}

