import Hero from "../components/sections/Hero";
import HowItWorks from "../components/sections/HowItWorks";

export default function Index() {
  return (
    <div className="min-h-screen bg-mint font-body">
      <main>
        <Hero />
        <HowItWorks />
      </main>
    </div>
  );
}