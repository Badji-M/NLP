import React from 'react'
import { FaBrain, FaChartLine, FaRocket } from 'react-icons/fa'

export default function Hero() {
  return (
    <div className="hero-content">
      <div className="hero-icon">
        <FaBrain size={80} />
      </div>
      <h1>NER - Named Entity Recognition</h1>
      <p>Détectez automatiquement les entités nommées dans vos textes</p>
      <p className="subtitle">Personnes • Organisations • Lieux • Et plus...</p>
    </div>
  )
}
