import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { ExpertiseSection } from "@/components/expertise-section";
import { PiliersSection } from "@/components/piliers-section";
import { ServicesSection } from "@/components/services-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ExpertiseSection />
      <ServicesSection />
      <PiliersSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
