import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaChartBar, FaFileUpload, FaDownload, FaQuestionCircle } from 'react-icons/fa'
import Hero from '../components/Home/Hero'
import Features from '../components/Home/Features'
import Guide from '../components/Home/Guide'
import Download from '../components/Home/Download'
import './HomePage.css'

export default function HomePage() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Hero />
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Features />
      </section>

      {/* Guide Section */}
      <section className="guide-section">
        <Guide />
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Prêt à commencer ?</h2>
          <p>Analysez vos textes avec notre outil NER avancé</p>
          <Link to="/analyze" className="cta-button">
            <FaArrowRight /> Accéder à l'analyse
          </Link>
        </div>
      </section>

      {/* Download Section */}
      <section className="download-section">
        <Download />
      </section>
    </div>
  )
}
