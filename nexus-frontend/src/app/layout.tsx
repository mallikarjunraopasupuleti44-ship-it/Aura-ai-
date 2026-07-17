import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aura AI | Your AI Workforce for Business Growth",
  description: "Upload your business once. Aura AI understands everything. Your AI employees plan, market, automate, analyse, create documents, send emails, manage customers, build websites, and help grow your company while you stay in control.",
};

import { GlobalMouseGlow } from "@/components/ui/MouseGlow";

import { AuthProvider } from "@/components/providers/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col selection:bg-[#4F7CFF]/20 selection:text-[#4F7CFF]">
        <GlobalMouseGlow />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
