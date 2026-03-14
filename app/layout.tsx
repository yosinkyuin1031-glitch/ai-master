import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "治療家AIマスター | 治療院経営を支えるAIアシスタント",
  description: "症状分析・施術提案・経営アドバイス。治療家のためのAIパートナー。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
