import React, { useState, useEffect } from 'react'
import { FaTrash, FaDownload, FaEye, FaTimes } from 'react-icons/fa'
import './HistoryPage.css'

export default function HistoryPage() {
  const [history, setHistory] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    // Charger l'historique depuis localStorage
    const savedHistory = localStorage.getItem('ner_history')
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error('Erreur lors du chargement de l\'historique:', e)
      }
    }
  }, [])

  const deleteItem = (id) => {
    const newHistory = history.filter(item => item.id !== id)
    setHistory(newHistory)
    localStorage.setItem('ner_history', JSON.stringify(newHistory))
    if (selectedItem?.id === id) {
      setSelectedItem(null)
    }
  }

  const clearHistory = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer tout l\'historique?')) {
      setHistory([])
      localStorage.removeItem('ner_history')
      setSelectedItem(null)
    }
  }

  const downloadItem = (item) => {
    const data = {
      text: item.text,
      results: item.results,
      date: item.date
    }
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2)))
    element.setAttribute('download', `ner_${item.id}.json`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="history-page">
      <div className="page-header">
        <h1>Historique des Analyses</h1>
        <p>Consultez et gérez vos analyses précédentes</p>
      </div>

      <div className="history-container">
        {history.length === 0 ? (
          <div className="empty-history">
            <div className="empty-icon">📋</div>
            <h2>Aucun historique</h2>
            <p>Vos analyses précédentes apparaîtront ici</p>
          </div>
        ) : (
          <div className="history-layout">
            {/* Liste des éléments */}
            <div className="history-list">
              <div className="list-header">
                <h3>Analyses ({history.length})</h3>
                {history.length > 0 && (
                  <button className="btn-clear" onClick={clearHistory}>
                    Tout supprimer
                  </button>
                )}
              </div>
              <div className="items-container">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className={`history-item ${selectedItem?.id === item.id ? 'active' : ''}`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="item-content">
                      <div className="item-title">{item.text.substring(0, 50)}...</div>
                      <div className="item-meta">
                        <span className="item-date">{new Date(item.date).toLocaleString('fr-FR')}</span>
                        <span className="item-count">{item.results.tokens.length} tokens</span>
                      </div>
                    </div>
                    <button
                      className="btn-delete"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteItem(item.id)
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Détails */}
            {selectedItem && (
              <div className="history-details">
                <div className="details-header">
                  <h3>Détails de l'analyse</h3>
                  <button className="btn-close" onClick={() => setSelectedItem(null)}>
                    <FaTimes />
                  </button>
                </div>

                <div className="details-content">
                  <div className="detail-section">
                    <h4>Texte original</h4>
                    <p className="detail-text">{selectedItem.text}</p>
                  </div>

                  <div className="detail-section">
                    <h4>Résultats</h4>
                    <div className="entities-visual">
                      {selectedItem.results.tokens.map((token, idx) => {
                        const label = selectedItem.results.labels?.[idx] || 'O'
                        const labelClass = label.toLowerCase().replace('-', '-')
                        return (
                          <span key={idx} className={`entity ${labelClass}`} title={label}>
                            {token}
                          </span>
                        )
                      })}
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Statistiques</h4>
                    {selectedItem.results.statistics && (
                      <div className="stats-grid">
                        <div className="stat-card">
                          <div className="stat-label">Entités trouvées</div>
                          <div className="stat-value">{selectedItem.results.statistics.total_entities}</div>
                        </div>
                        <div className="stat-card">
                          <div className="stat-label">Tokens totaux</div>
                          <div className="stat-value">{selectedItem.results.statistics.total_tokens}</div>
                        </div>
                        <div className="stat-card">
                          <div className="stat-label">Densité</div>
                          <div className="stat-value">{selectedItem.results.statistics.entity_density}%</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="detail-actions">
                    <button
                      className="btn-primary"
                      onClick={() => downloadItem(selectedItem)}
                    >
                      <FaDownload /> Télécharger
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => deleteItem(selectedItem.id)}
                    >
                      <FaTrash /> Supprimer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}