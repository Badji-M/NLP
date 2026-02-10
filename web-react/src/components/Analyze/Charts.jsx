import React from 'react'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

export default function Charts({ results }) {
  if (!results || !results.statistics) {
    return null
  }

  const stats = results.statistics
  const colors = ['#4361ee', '#7209b7', '#f72585', '#4cc9f0', '#f8961e']

  // Données pour le graphique des entités par type
  const entityData = (stats.by_type || []).map((item, idx) => ({
    name: item.label,
    value: item.count,
    color: colors[idx % colors.length]
  }))

  // Données pour le graphique en barres
  const typeData = (stats.by_type || []).map(item => ({
    label: item.label,
    count: item.count,
    percentage: item.percentage
  }))

  return (
    <div className="charts-section">
      <h2>Visualisations</h2>
      
      <div className="charts-grid">
        {/* Graphique en camembert */}
        {entityData.length > 0 && (
          <div className="chart-container">
            <h3>Distribution des entités</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={entityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {entityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} entité(s)`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Graphique en barres */}
        {typeData.length > 0 && (
          <div className="chart-container">
            <h3>Compte par type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4361ee" name="Nombre" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Statistiques synthétiques */}
      <div className="stats-summary">
        <div className="summary-card">
          <span className="summary-label">Entités trouvées</span>
          <span className="summary-value">{stats.total_entities}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Tokens totaux</span>
          <span className="summary-value">{stats.total_tokens}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Densité</span>
          <span className="summary-value">{stats.entity_density?.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  )
}
