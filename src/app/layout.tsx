import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TOEFL Grammar Practice - Latihan Grammar TOEFL EPT",
  description:
    "Aplikasi latihan grammar TOEFL EPT dengan 10 topik utama dan AI-powered question generation. Persiapkan dirimu untuk tes TOEFL!",
  keywords: [
    "TOEFL",
    "Grammar",
    "EPT",
    "Latihan",
    "English",
    "Bahasa Inggris",
    "AI",
    "Practice",
  ],
  authors: [{ name: "Mohammad Faris Al Fatih" }],
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
