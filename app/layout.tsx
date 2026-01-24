import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/layout/sidebar-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EduKit",
  description: "Trợ lý ảo hỗ trợ giáo viên soạn thảo giáo án",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/icon.ico", type: "image/x-icon" },
    ],
    shortcut: "/icon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <div className="flex h-screen overflow-hidden">
              {/* Desktop Sidebar */}
              <div className="hidden md:block">
                <Sidebar />
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                  {children}
                </main>
              </div>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
