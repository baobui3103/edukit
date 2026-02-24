import { Info } from "lucide-react";

export function GuideSection() {
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8 flex items-start gap-3">
      <Info className="shrink-0 mt-0.5 text-primary" size={20} />
      <div className="text-sm leading-relaxed">
        <p className="font-semibold mb-1">Hướng dẫn sử dụng:</p>
        <ol className="list-decimal list-inside space-y-1 ml-1">
          <li>Nhập hoặc dán văn bản vào ô <strong>Văn bản gốc</strong>.</li>
          <li>Công cụ xử lý nét nối chữ (ôi, ơi, ơu...) cho font luyện viết.</li>
          <li>Bấm <strong>Copy kết quả</strong> và dán vào Word.</li>
          <li>Cài font HP001 để hiển thị đúng trên Word.</li>
        </ol>
      </div>
    </div>
  );
}
