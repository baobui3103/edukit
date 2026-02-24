import { Download, FileText, Type, BookOpen, Ruler } from "lucide-react";

type DownloadItem = {
  href: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  download?: boolean;
};

const DOWNLOADS: readonly DownloadItem[] = [
  {
    href: "/download/file-luyen-chu-mau-4-hang-net-1-o-ly.docx",
    label: "File Word mẫu",
    description: "Mẫu luyện chữ 4 hàng nét 1 ô ly",
    icon: FileText,
  },
  {
    href: "/download/font-chu-tieu-hoc.zip",
    label: "Font chữ",
    description: "Bộ font HP001 tiểu học 4 hàng / 5 hàng chuẩn bộ giáo dục",
    icon: Type,
    download: true,
  },
  {
    href: "/tools/tao-bai-luyen-chu/huong-dan-viet",
    label: "Hướng dẫn viết",
    description: "Xem trước và tải tài liệu hướng dẫn viết chữ",
    icon: BookOpen,
    download: false as const,
  },
  {
    href: "/tools/tao-bai-luyen-chu/anh-ke-dong-cho-mon-toan",
    label: "Mẫu kẻ dòng Toán",
    description: "Bộ ảnh kẻ dòng cho vở, phiếu bài tập môn Toán",
    icon: Ruler,
    download: false as const,
  },
] as const;

export function DownloadSection() {
  return (
    <div className="bg-muted/50 border border-border rounded-xl p-4 mb-8">
      <p className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Download size={18} />
        Tải tài liệu
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {DOWNLOADS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            {...(item.download === false ? {} : { download: true })}
            className="flex items-start gap-2 px-4 py-3 rounded-lg bg-card border border-border hover:bg-accent hover:border-accent transition-colors text-sm"
          >
            <item.icon size={18} className="text-primary shrink-0" />
            <div className="text-left space-y-0.5">
              <span className="font-medium block leading-snug">
                {item.label}
              </span>
              <span className="text-muted-foreground text-xs leading-snug block">
                {item.description}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
