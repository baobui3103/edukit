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
  const cppPath = path.join(
    process.cwd(),
    "SourceCode",
    "HoTroFont4HangLuyenVietChuDlg.cpp"
  );

  let cppSource: string;
  try {
    cppSource = fs.readFileSync(cppPath, "utf8");
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

