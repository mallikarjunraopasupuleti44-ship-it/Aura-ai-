import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { AuroraBackground } from "@/components/ui/AuroraBackground";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <AuroraBackground />
      <Sidebar />
      <div className="pl-[312px] flex flex-col min-h-screen relative z-10">
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
