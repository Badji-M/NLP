import React from 'react'
import { FaDownload } from 'react-icons/fa'

export default function Download() {
  return (
    <div className="download-content">
      <h2>Téléchargez le modèle</h2>
      <p>Utilisez notre modèle NER pré-entraîné</p>
      <button className="download-btn">
        <FaDownload /> Télécharger le modèle
      </button>
    </div>
  )
}
