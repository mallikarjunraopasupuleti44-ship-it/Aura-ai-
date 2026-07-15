import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aura AI | Your AI Workforce for Business Growth",
  description: "Upload your business once. Aura AI understands everything. Your AI employees plan, market, automate, analyse, create documents, send emails, manage customers, build websites, and help grow your company while you stay in control.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col selection:bg-purple-100 selection:text-purple-900">{children}</body>
    </html>
  );
}
