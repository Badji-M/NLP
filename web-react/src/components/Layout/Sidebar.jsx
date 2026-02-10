import React from 'react'

export default function Sidebar({ isOpen }) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <ul className="sidebar-menu">
        <li>
          <a href="/">Accueil</a>
        </li>
        <li>
          <a href="/analyze">Analyser</a>
        </li>
        <li>
          <a href="/history">Historique</a>
        </li>
      </ul>
    </aside>
  )
}
