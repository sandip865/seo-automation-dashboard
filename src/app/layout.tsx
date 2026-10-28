import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Edgelink Technology | SEO Automation Dashboard",
  description: "Automated SEO analysis using headless crawling, BullMQ job queue, Claude AI engine, and dual-portal interface.",
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
