import React from 'react'
import Navbar from '../components/Navbar'
import Herosection from '../components/Herosection'
import Workflow from '../components/Workflow'
import Features from '../components/Features'
import UseCases from '../components/UseCases'
import Pricing from '../components/Pricing'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import CTA from '../components/CTA'
import Footer from '../components/Footer'

const Index = () => {
  return (
    <>
      <Navbar />
      <Herosection />
      <Workflow />
      <Features />
      <UseCases />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </>
  )
}

export default Index
