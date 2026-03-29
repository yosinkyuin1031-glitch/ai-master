import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "治療家AIマスター | ClinicApps",
  description: "症状分析・施術提案・経営相談に対応するAIアシスタント。治療家のための専門AI",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "治療家AIマスター",
    description: "症状分析・施術提案・経営相談に対応するAIアシスタント。治療家のための専門AI",
    siteName: "治療家AIマスター",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "治療家AIマスター",
    description: "症状分析・施術提案・経営相談に対応するAIアシスタント。治療家のための専門AI",
  },
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
