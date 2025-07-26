"use-client"

import { HeroSection } from "@/components/hero-section"
import { Navbar } from "@/components/navbar"
import {Footer} from "@/components/footer"
import PricingPlans from "@/components/pricing-table"
import {FounderTalk} from "@/components/foundertalk"
import { Features } from "@/components/features"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <Features/>
        <PricingPlans/>
        <FounderTalk/>
        <Footer/>
      </main>
    </div>
  )
}

