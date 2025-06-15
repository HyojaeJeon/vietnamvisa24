'use client'
import React from 'react'
import Header from '../src/components/header'
import Footer from '../src/components/footer'
import HeroSection from './_components/HeroSection'
import StatsSection from './_components/StatsSection'
import OurStorySection from './_components/OurStorySection'
import PromisesSection from './_components/PromisesSection'
import TeamSection from './_components/TeamSection'
import OfficeLocationSection from './_components/OfficeLocationSection'
import CTASection from './_components/CTASection'

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <HeroSection />
        <StatsSection />
        <OurStorySection />
        <PromisesSection />
        <TeamSection />
        <OfficeLocationSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
