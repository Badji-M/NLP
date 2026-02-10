import React from 'react'
import { FaBolt, FaLock, FaClock } from 'react-icons/fa'

export default function Features() {
  const features = [
    {
      icon: <FaBolt />,
      title: 'Rapide',
      description: 'Analyse instantanée de vos textes'
    },
    {
      icon: <FaLock />,
      title: 'Sécurisé',
      description: 'Vos données restent confidentielles'
    },
    {
      icon: <FaClock />,
      title: 'Précis',
      description: 'Modèles ML avancés pour une meilleure détection'
    }
  ]

  return (
    <div className="features-grid">
      {features.map((feature, idx) => (
        <div key={idx} className="feature-card">
          <div className="feature-icon">{feature.icon}</div>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </div>
      ))}
    </div>
  )
}
