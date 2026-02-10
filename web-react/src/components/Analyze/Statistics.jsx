import React from 'react'

export default function Statistics({ results }) {
  if (!results || !results.statistics) {
    return <div className="statistics-placeholder">Les statistiques apparaîtront ici</div>
  }

  const stats = results.statistics

  return (
    <div className="statistics-container">
      <h3>Statistiques</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Entités totales</div>
          <div className="stat-value">{stats.total_entities || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Tokens totaux</div>
          <div className="stat-value">{stats.total_tokens || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Densité d'entités</div>
          <div className="stat-value">{stats.entity_density || 0}%</div>
        </div>
      </div>

      {stats.by_type && (
        <div className="entities-by-type">
          <h4>Entités par type</h4>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Compte</th>
                <th>Pourcentage</th>
              </tr>
            </thead>
            <tbody>
              {stats.by_type.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.label}</td>
                  <td>{item.count}</td>
                  <td>{item.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
