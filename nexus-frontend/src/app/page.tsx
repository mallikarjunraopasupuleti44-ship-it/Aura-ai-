import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/home/hero";
import { AIEmployees } from "@/components/home/ai-employees";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full">
      <Navbar />
      <Hero />
      <AIEmployees />
    </main>
  );
}
