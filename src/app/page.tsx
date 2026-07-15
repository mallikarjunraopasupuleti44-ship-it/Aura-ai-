import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/home/hero";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Navbar />
      <Hero />
      {/* Additional landing page sections will go here */}
    </main>
  );
}
