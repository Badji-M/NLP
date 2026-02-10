import React from 'react'

export default function HistoryItem({ item }) {
  return (
    <div className="history-item">
      <h3>{item.title || 'Analyse'}</h3>
      <p>{item.text}</p>
      <small>{new Date(item.timestamp).toLocaleString()}</small>
    </div>
  )
}
