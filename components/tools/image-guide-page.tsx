"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Copy,
  Check,
} from "lucide-react";

export type ImageGuideTab = {
  id: string;
  label: string;
  basePath: string;
  files: readonly string[];
};

interface ImageGuidePageProps {
  title: string;
  intro: string;
  fullZipHref?: string;
  tabs: readonly ImageGuideTab[];
}

export function ImageGuidePage({
  title,
  intro,
  fullZipHref,
  tabs,
}: ImageGuidePageProps) {
  const router = useRouter();
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0]?.id ?? "");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [copiedSrc, setCopiedSrc] = useState<string | null>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];
  const images = activeTab?.files ?? [];
  const basePath = activeTab?.basePath ?? "";

  const openLightbox = (src: string) => {
    setLightboxImage(src);
    setZoom(1);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const zoomIn = () => setZoom((z) => Math.min(3, z + 0.25));
  const zoomOut = () => setZoom((z) => Math.max(0.5, z - 0.25));

  const handleCopyImage = async (src: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(
          typeof window !== "undefined" ? window.location.origin + src : src
        );
        setCopiedSrc(src);
        setTimeout(() => {
          setCopiedSrc((current) => (current === src ? null : current));
        }, 1500);
      }
    } catch {
      // ignore
    }
  };

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
            {title}
          </h1>
          {fullZipHref ? (
            <a
              href={fullZipHref}
              download
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90"
            >
              <Download size={16} />
              Tải full
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground">
              &nbsp;
            </span>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <section className="bg-muted/60 border border-border rounded-xl p-3 sm:p-4">
          <p className="text-sm text-muted-foreground">{intro}</p>
        </section>

        <section className="space-y-4">
          {tabs.length > 1 && (
            <div className="inline-flex flex-wrap gap-2 border border-border rounded-lg p-1 bg-muted/50">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    activeTabId === tab.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-background/60"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {images.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              Chưa có hình cho mục này.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {images.map((fileName) => {
                const src = `${basePath}/${encodeURI(fileName)}`;
                const filename = fileName.split("/").pop() ?? fileName;
                const label = filename.replace(/\.[^/.]+$/, "");
                return (
                  <div
                    key={fileName}
                    className="border border-border rounded-lg overflow-hidden bg-card flex flex-col"
                  >
                    <button
                      type="button"
                      onClick={() => openLightbox(src)}
                      className="relative aspect-[3/4] overflow-hidden bg-muted hover:bg-muted/80"
                    >
                      <img
                        src={src}
                        alt={label}
                        className="w-full h-full object-contain transition-transform duration-200 hover:scale-[1.03]"
                      />
                      <div className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-background/80 backdrop-blur px-2 py-1 text-[11px] text-muted-foreground">
                        <Maximize2 size={12} />
                        Xem lớn
                      </div>
                    </button>
                    <div className="px-3 py-2 flex items-center justify-between gap-2 border-t border-border bg-muted/60">
                      <span className="text-xs text-muted-foreground truncate">
                        {label}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyImage(src)}
                          className="inline-flex items-center justify-center text-xs h-7 w-7 rounded-md bg-background hover:bg-accent border border-border"
                          title="Copy đường dẫn hình ảnh"
                        >
                          {copiedSrc === src ? (
                            <Check size={12} />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                        <a
                          href={src}
                          download
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-background hover:bg-accent border border-border"
                        >
                          <Download size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex flex-col"
          onClick={closeLightbox}
        >
          <div
            className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/80 backdrop-blur"
            onClick={(e) => e.stopPropagation()}
          >
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
          <div
            className="flex-1 flex items-center justify-center overflow-auto p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="inline-block"
              style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
            >
              <img
                src={lightboxImage}
                alt={title}
                className="max-h-[80vh] max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

