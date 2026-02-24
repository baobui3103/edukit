import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

type ReplacementRule = readonly [from: string, to: string];

function extractHp001RulesFromCpp(cppSource: string): ReplacementRule[] {
  // Keep order: the original C++ applies Replace() sequentially.
  // Pattern example: inputText.Replace(L"ôi", L"ċ");
  const re = /inputText\.Replace\(L"([^"]*)",\s*L"([^"]*)"\);/g;

  const rules: ReplacementRule[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(cppSource))) {
    rules.push([match[1], match[2]]);
  }
  return rules;
}

export async function GET() {
  const CPP_PATHS = [
    path.join("app", "tools", "tao-bai-luyen-chu", "_source", "HoTroFont4HangLuyenVietChuDlg.cpp"),
    path.join("SourceCode", "HoTroFont4HangLuyenVietChuDlg.cpp"),
  ];

  let cppPath: string | null = null;
  for (const rel of CPP_PATHS) {
    const full = path.join(process.cwd(), rel);
    if (fs.existsSync(full)) {
      cppPath = full;
      break;
    }
  }

  if (!cppPath) {
    return NextResponse.json(
      {
        error: "Không tìm thấy HoTroFont4HangLuyenVietChuDlg.cpp",
        detail: `Đã tìm: ${CPP_PATHS.join(", ")}`,
      },
      { status: 500 }
    );
  }

  let cppSource: string;
  try {
    const buffer = fs.readFileSync(cppPath);
    if (buffer[0] === 0xff && buffer[1] === 0xfe) {
      cppSource = buffer.toString("utf16le");
    } else {
      cppSource = buffer.toString("utf8");
    }
  } catch (err) {
    return NextResponse.json(
      {
        error: "Không đọc được file source C++ cho bộ quy tắc HP001.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }

  const rules = extractHp001RulesFromCpp(cppSource);

  if (rules.length === 0) {
    return NextResponse.json(
      {
        error:
          "Không trích xuất được quy tắc Replace() từ source C++. Kiểm tra lại định dạng file.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ rules });
}

