import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ReadingProgress from "@/components/ReadingProgress";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Agent 学习路线",
  description: "从零开始学习 AI Agent 开发 - 系统化学习路线",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <ReadingProgress />
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Header />
              <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
