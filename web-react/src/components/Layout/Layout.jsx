import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaBrain, FaBars, FaTimes, FaHome, FaSearch, FaHistory, FaDownload, FaBook } from 'react-icons/fa'
import './Layout.css'

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { path: '/', name: 'Accueil', icon: <FaHome /> },
    { path: '/analyze', name: 'Analyse', icon: <FaSearch /> },
    { path: '/history', name: 'Historique', icon: <FaHistory /> },
  ]

  const docs = [
    { name: 'Guide d\'utilisation', icon: <FaBook />, url: '/docs/guide.pdf' },
    { name: 'Documentation technique', icon: <FaDownload />, url: '/docs/tech.pdf' },
  ]

  return (
    <div className="layout">
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <button 
            className="menu-toggle" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <Link to="/" className="brand">
            <FaBrain className="logo" />
            <span className="brand-name">NER Analyzer</span>
          </Link>
        </div>
        
        <div className="navbar-center">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="navbar-right">
          <a href="/docs/guide.pdf" className="btn-outline" target="_blank" rel="noreferrer">
            <FaDownload /> Guide
          </a>
        </div>
      </nav>

      {/* Sidebar pour mobile */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <FaBrain className="sidebar-logo" />
          <h3>NER Analyzer</h3>
        </div>
        
        <div className="sidebar-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="sidebar-docs">
          <h4>Documentation</h4>
          {docs.map((doc, idx) => (
            <a key={idx} href={doc.url} className="sidebar-doc" target="_blank" rel="noreferrer">
              {doc.icon}
              <span>{doc.name}</span>
            </a>
          ))}
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="main-content">
        {children}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>NER Analyzer</h4>
            <p>Détection d'entités nommées en français avec modèle CRF</p>
          </div>
          
          <div className="footer-section">
            <h4>Liens rapides</h4>
            <Link to="/">Accueil</Link>
            <Link to="/analyze">Analyse</Link>
            <Link to="/history">Historique</Link>
          </div>
          
          <div className="footer-section">
            <h4>Documentation</h4>
            <a href="/docs/guide.pdf">Guide d'utilisation</a>
            <a href="/docs/tech.pdf">Documentation technique</a>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2024 NER Analyzer - Projet NLP</p>
        </div>
      </footer>
    </div>
  )
}