import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function StatisticsPanel({ statistics, entities }) {
  if (!statistics || !entities.length) {
    return (
      <div className="statistics-panel">
        <h3>📊 Statistiques</h3>
        <p className="hint">Aucune donnée à afficher.</p>
      </div>
    );
  }

  const typeData = statistics.by_type || [];
  const entityList = entities.map((entity, idx) => ({
    id: idx,
    text: entity.text,
    label: entity.label,
    length: entity.text.length,
    tokenCount: entity.tokens ? entity.tokens.length : 1
  }));

  return (
    <div className="statistics-panel">
      <h3>📊 Statistiques détaillées</h3>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{statistics.total_tokens}</div>
          <div className="stat-label">Tokens analysés</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{statistics.total_entities}</div>
          <div className="stat-label">Entités détectées</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{statistics.entity_density}%</div>
          <div className="stat-label">Densité</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{typeData.length}</div>
          <div className="stat-label">Types différents</div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-container">
          <h4>Distribution par type</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ label, percentage }) => `${label}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Nombre']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h4>Répartition quantitative</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Nombre" />
              <Bar dataKey="percentage" fill="#82ca9d" name="Pourcentage" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="entities-table">
        <h4>📋 Liste des entités ({entities.length})</h4>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Entité</th>
              <th>Type</th>
              <th>Longueur</th>
              <th>Tokens</th>
            </tr>
          </thead>
          <tbody>
            {entityList.map((entity, index) => (
              <tr key={entity.id}>
                <td>{index + 1}</td>
                <td className="entity-cell">{entity.text}</td>
                <td>
                  <span className="entity-badge" style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                    {entity.label}
                  </span>
                </td>
                <td>{entity.length} caractères</td>
                <td>{entity.tokenCount} token(s)</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}