import NavBar from "../components/layout/Navbar.tsx";
import Footer from "../components/layout/Footer.tsx";
import Hero from "../components/sections/Hero.tsx";
import HowItWorks from "../components/sections/HowItWorks.tsx";

export default function Index() {
  return (
    <div>
      <NavBar />
      <main>
        <Hero />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
