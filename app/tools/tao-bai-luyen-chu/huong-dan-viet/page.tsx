"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

type TabId = "chu-hoa" | "chu-thuong" | "chu-so" | "viet-net";

const TABS: { id: TabId; label: string }[] = [
  {
    id: "chu-hoa",
    label: "Chữ hoa",
  },
  {
    id: "chu-thuong",
    label: "Chữ thường",
  },
  {
    id: "chu-so",
    label: "Chữ số",
  },
  {
    id: "viet-net",
    label: "Viết nét",
  },
];

export default function HuongDanVietPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("chu-hoa");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadImages() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/huong-dan-images?tab=${activeTab}`);
        const data = await res.json();
        if (!res.ok) {
          if (!cancelled) {
            setError(data?.error || "Không tải được danh sách hình.");
            setImages([]);
          }
          return;
        }
        if (!cancelled) {
          setImages(Array.isArray(data.images) ? data.images : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Không tải được danh sách hình.");
          setImages([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadImages();

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  const openLightbox = (src: string) => {
    setLightboxImage(src);
    setZoom(1);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const zoomIn = () => setZoom((z) => Math.min(3, z + 0.25));
  const zoomOut = () => setZoom((z) => Math.max(0.5, z - 0.25));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-accent text-sm"
          >
            <ArrowLeft size={16} />
            Quay lại
          </button>
          <h1 className="text-base sm:text-lg font-semibold text-center flex-1">
            Hướng dẫn viết chữ tiểu học
          </h1>
          <a
            href="/download/huong-dan.zip"
            download
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90"
          >
            <Download size={16} />
            Tải full hướng dẫn
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <section className="bg-muted/60 border border-border rounded-xl p-3 sm:p-4">
          <p className="text-sm text-muted-foreground">
            Chọn từng tab để xem trước hình ảnh hướng dẫn. Bạn có thể phóng to,
            thu nhỏ, tải từng hình hoặc tải toàn bộ tài liệu ở góc trên bên
            phải.
          </p>
        </section>

        <section className="space-y-4">
          <div className="inline-flex flex-wrap gap-2 border border-border rounded-lg p-1 bg-muted/50">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-background/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {isLoading && (
            <div className="text-sm text-muted-foreground">
              Đang tải hình hướng dẫn...
            </div>
          )}

          {error && !isLoading && (
            <div className="text-sm text-red-500">{error}</div>
          )}

          {!isLoading && !error && images.length === 0 && (
            <div className="text-sm text-muted-foreground">
              Chưa có hình hướng dẫn cho mục này.
            </div>
          )}

          {!isLoading && !error && images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((src, index) => {
                const tab = TABS.find((t) => t.id === activeTab)!;
                const alt = `${tab.label} ${index + 1}`;
                return (
                  <div
                    key={src}
                    className="border border-border rounded-lg overflow-hidden bg-card flex flex-col"
                  >
                    <button
                      type="button"
                      onClick={() => openLightbox(src)}
                      className="relative aspect-[3/4] overflow-hidden bg-muted hover:bg-muted/80"
                    >
                      <img
                        src={src}
                        alt={alt}
                        className="w-full h-full object-contain transition-transform duration-200 hover:scale-[1.03]"
                      />
                      <div className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-background/80 backdrop-blur px-2 py-1 text-[11px] text-muted-foreground">
                        <Maximize2 size={12} />
                        Xem lớn
                      </div>
                    </button>
                    <div className="px-3 py-2 flex items-center justify-between gap-2 border-t border-border bg-muted/60">
                      <span className="text-xs text-muted-foreground truncate">
                        {alt}
                      </span>
                      <a
                        href={src}
                        download
                        className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-background hover:bg-accent border border-border"
                      >
                        <Download size={12} />
                        Tải
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/80 backdrop-blur">
            <span className="text-sm font-medium text-foreground">
              Xem hình lớn
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={zoomOut}
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-2 py-1 text-xs hover:bg-accent"
              >
                <ZoomOut size={14} />
              </button>
              <button
                type="button"
                onClick={zoomIn}
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-2 py-1 text-xs hover:bg-accent"
              >
                <ZoomIn size={14} />
              </button>
              <button
                type="button"
                onClick={closeLightbox}
                className="ml-1 inline-flex items-center justify-center rounded-md border border-border bg-background px-2 py-1 text-xs hover:bg-accent"
              >
                Đóng
              </button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center overflow-auto p-4">
            <div
              className="inline-block"
              style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
            >
              <img
                src={lightboxImage}
                alt="Hướng dẫn viết"
                className="max-h-[80vh] max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

