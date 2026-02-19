import { Header } from "@/components/header"
import { HeroSection } from "@/components/landing/hero-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { UseCasesSection } from "@/components/landing/use-cases-section"
import { CtaSection } from "@/components/landing/cta-section"
import { RoadmapSection } from "@/components/landing/roadmap-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <UseCasesSection />
        <RoadmapSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
