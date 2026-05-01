import Hero from "../components/sections/Hero.tsx";
import HowItWorks from "../components/sections/HowItWorks.tsx";
import ScenarioPreview from "../components/sections/ScenarioPreview.tsx";
import CTAStrip from "../components/sections/CTAStrip.tsx";

export default function Index() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <ScenarioPreview />
      <CTAStrip />
    </main>
  );
}
