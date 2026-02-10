import React from 'react'

export default function Guide() {
  const steps = [
    {
      number: 1,
      title: 'Saisissez votre texte',
      description: 'Tapez ou collez le texte à analyser'
    },
    {
      number: 2,
      title: 'Importez un document',
      description: 'Ou téléchargez un fichier (PDF, DOCX, TXT)'
    },
    {
      number: 3,
      title: 'Obtenez les résultats',
      description: 'Visualisez les entités détectées'
    }
  ]

  return (
    <div className="guide-steps">
      <h2>Comment ça marche ?</h2>
      <div className="steps-container">
        {steps.map((step) => (
          <div key={step.number} className="step">
            <div className="step-number">{step.number}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
