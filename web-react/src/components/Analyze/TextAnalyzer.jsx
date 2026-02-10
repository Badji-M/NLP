import React from 'react'
import { FaPaperPlane } from 'react-icons/fa'

export default function TextAnalyzer({ text, setText, onAnalyze, loading }) {
  return (
    <div className="text-analyzer">
      <h3>Analysez du texte</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Saisissez votre texte ici..."
        rows="10"
        className="text-input"
      />
      <button
        onClick={onAnalyze}
        disabled={loading || !text.trim()}
        className="analyze-btn"
      >
        <FaPaperPlane /> {loading ? 'Analyse en cours...' : 'Analyser'}
      </button>
    </div>
  )
}
