import React from 'react'

export default function Results({ results }) {
  if (!results) {
    return <div className="results-placeholder">Aucun résultat</div>
  }

  if (!results.tokens) {
    return <div className="results-placeholder">Format de résultat invalide</div>
  }

  return (
    <div className="entities-visual">
      {results.tokens.map((token, idx) => {
        const label = results.labels?.[idx] || 'O'
        const labelClass = label.toLowerCase().replace('-', '-')
        return (
          <span key={idx} className={`entity ${labelClass}`} title={label}>
            {token}
          </span>
        )
      })}
    </div>
  )
}
