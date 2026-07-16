import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/home/hero";
import { AIEmployees } from "@/components/home/ai-employees";
import { Workflow } from "@/components/home/workflow";
import { Features } from "@/components/home/features";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col w-full bg-[#FCFDFF] relative overflow-hidden">
      <div className="absolute inset-0 bg-[#FCFDFF] opacity-30 mix-blend-multiply pointer-events-none" />
      <div className="relative z-10 flex flex-col w-full">
        <Navbar />
        <Hero />
        <Workflow />
        <AIEmployees />
        <Features />
      </div>
    </main>
  );
}
