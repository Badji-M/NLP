import React, { useState, useEffect } from 'react'
import { FaSync, FaDownload, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa'
import Results from '../components/Analyze/Results'
import Statistics from '../components/Analyze/Statistics'
import Charts from '../components/Analyze/Charts'
import { analyzeText, analyzeFile } from '../utiles/api'
import './AnalyzePage.css'

export default function AnalyzePage() {
  const [activeTab, setActiveTab] = useState('text')
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [viewMode, setViewMode] = useState('visual')
  const [isDragging, setIsDragging] = useState(false)
  const [message, setMessage] = useState(null) // { type: 'success|error', text: '...' }

  const examples = [
    {
      title: "Politique",
      text: "Emmanuel Macron, président de la République française, se rendra à Berlin pour rencontrer le chancelier Olaf Scholz."
    },
    {
      title: "Entreprise",
      text: "Apple Inc. a annoncé ses résultats. Le siège à Cupertino accueillera une conférence avec Tim Cook."
    },
    {
      title: "Littérature",
      text: "Victor Hugo, auteur des Misérables, est né à Besançon. Son roman se déroule à Paris."
    }
  ]

  // Lire le contenu du fichier
  const readFileContent = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  // Gérer l'importation de fichier (TXT, PDF, DOCX)
  const handleFileSelect = async (selectedFile) => {
    const fileExt = selectedFile.name.toLowerCase().split('.').pop()
    
    // Valider le format
    if (!['txt', 'pdf', 'docx'].includes(fileExt)) {
      setMessage({ type: 'error', text: 'Format non supporté. Utilisez TXT, PDF ou DOCX.' })
      setTimeout(() => setMessage(null), 5000)
      return
    }

    // Valider la taille (max 50 MB)
    if (selectedFile.size > 50_000_000) {
      setMessage({ type: 'error', text: 'Fichier trop volumineux (> 50 MB)' })
      setTimeout(() => setMessage(null), 5000)
      return
    }

    setFile(selectedFile)
    setFileName(selectedFile.name)
    setMessage({ type: 'success', text: `Fichier chargé: ${selectedFile.name}` })
    setTimeout(() => setMessage(null), 3000)
    setActiveTab('file')
  }

  // Handlers pour drag-drop
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles[0])
    }
  }

  // Analyser le texte
  const handleAnalyze = async () => {
    let dataToAnalyze = null
    
    // Si on a un fichier PDF/DOCX, l'envoyer à l'API
    if (file && ['pdf', 'docx'].includes(file.name.toLowerCase().split('.').pop())) {
      dataToAnalyze = { type: 'file', data: file }
    } else if (text.trim()) {
      dataToAnalyze = { type: 'text', data: text }
    } else {
      setMessage({ type: 'error', text: 'Veuillez entrer du texte ou importer un fichier' })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    setLoading(true)
    setMessage(null)
    try {
      let result
      if (dataToAnalyze.type === 'file') {
        result = await analyzeFile(dataToAnalyze.data)
      } else {
        result = await analyzeText(dataToAnalyze.data)
      }
      
      setResults(result)
      setMessage({ type: 'success', text: 'Analyse réussie ! 🎉' })
      setTimeout(() => setMessage(null), 3000)
      
      // Sauvegarder dans l'historique
      const history = JSON.parse(localStorage.getItem('ner_history') || '[]')
      const newItem = {
        id: Date.now().toString(),
        text: dataToAnalyze.type === 'file' ? `[Fichier: ${file.name}]` : dataToAnalyze.data,
        results: result,
        date: new Date().toISOString()
      }
      history.unshift(newItem)
      if (history.length > 50) history.pop()
      localStorage.setItem('ner_history', JSON.stringify(history))
    } catch (error) {
      console.error('Erreur d\'analyse:', error)
      const errorMsg = error.message.includes('API error') 
        ? 'Erreur API. Vérifiez que le serveur est accessible.'
        : error.message
      setMessage({ type: 'error', text: `Erreur: ${errorMsg}` })
    } finally {
      setLoading(false)
    }
  }

  // Charger un exemple
  const loadExample = (exampleText) => {
    setText(exampleText)
    setActiveTab('text')
    setFile(null)
    setFileName('')
  }

  // Réinitialiser
  const resetAnalysis = () => {
    setText('')
    setFile(null)
    setFileName('')
    setResults(null)
    setViewMode('visual')
  }

  // Exporter en JSON
  const exportJSON = () => {
    if (!results) return
    const data = {
      text: text,
      results: results,
      timestamp: new Date().toISOString()
    }
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2)))
    element.setAttribute('download', 'resultat_ner.json')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  // Exporter en CSV
  const exportCSV = () => {
    if (!results || !results.tokens) return
    let csv = 'Token,Label\n'
    results.tokens.forEach((token, idx) => {
      const label = results.labels?.[idx] || 'O'
      csv += `"${token}","${label}"\n`
    })
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv))
    element.setAttribute('download', 'resultat_ner.csv')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  // Télécharger le guide
  const downloadGuide = () => {
    const guideContent = `GUIDE D'UTILISATION - NER (Named Entity Recognition)

Bienvenue! Ce guide vous aide à utiliser l'application de reconnaissance d'entités nommées.

FONCTIONNALITÉS PRINCIPALES:

1. ANALYSE DE TEXTE
   - Entrez du texte libre dans la zone d'entrée
   - Cliquez sur "Lancer l'analyse"
   - Les entités détectées s'affichent avec des couleurs

2. IMPORT DE FICHIERS
   - Cliquez sur la zone de fichier
   - Sélectionnez un fichier (.txt, .pdf, .docx)
   - Le contenu sera automatiquement chargé

3. EXEMPLES RAPIDES
   - Utilisez les exemples pour tester rapidement
   - Parfait pour comprendre le fonctionnement

4. RÉSULTATS
   - Affichage visuel avec coloration des entités
   - Statistiques détaillées
   - Tableau complet des résultats
   - Options d'exportation (JSON, CSV)

TYPES D'ENTITÉS RECONNUES:
- Politician: Noms de politiciens
- HumanSettlement: Noms de lieux
- Organization: Noms d'organisations

CONSEILS D'UTILISATION:
- Le modèle fonctionne mieux avec des textes français bien structurés
- Les textes plus longs donnent généralement de meilleurs résultats
- Vérifiez les résultats pour des cas spécialisés

CONTACT ET SUPPORT:
Pour toute question, consultez la documentation complète.`
    
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(guideContent))
    element.setAttribute('download', 'guide_ner.txt')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  // Télécharger le modèle
  const downloadModel = () => {
    window.location.href = 'https://nlp-4g9u.onrender.com/models/ner_model.joblib'
  }

  return (
    <div className="analyze-page">
      {/* Toast Messages */}
      {message && (
        <div className={`toast-message ${message.type}`}>
          {message.type === 'error' && <FaExclamationCircle />}
          {message.type === 'success' && <FaCheckCircle />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <h1>Analyse de Texte NER</h1>
        <p>Détectez les entités nommées dans vos textes</p>
      </div>

      {/* Layout principal: Entrée + Résultats */}
      <div className="main-layout">
        {/* Colonne Gauche: Entrée */}
        <div className="input-section">
          {/* Zone de saisie */}
          <div className="input-card">
            <div className="card-header">
              <h3>Entrée</h3>
              <div className="input-tabs">
                <button 
                  className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
                  onClick={() => setActiveTab('text')}
                >
                  Texte
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'file' ? 'active' : ''}`}
                  onClick={() => setActiveTab('file')}
                >
                  Fichier
                </button>
              </div>
            </div>

            <div className="card-body">
              {activeTab === 'text' && (
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Entrez votre texte en français..."
                  className="text-input"
                  rows="10"
                />
              )}

              {activeTab === 'file' && (
                <div className="file-section">
                  <div 
                    className={`file-upload-zone ${isDragging ? 'dragging' : ''}`}
                    onClick={() => document.getElementById('file-input').click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <p>Cliquez ou glissez un fichier</p>
                    <small>Formats: .txt, .pdf, .docx (max 50 MB)</small>
                    {fileName && <p className="file-name">✓ {fileName}</p>}
                  </div>
                  <input
                    id="file-input"
                    type="file"
                    accept=".txt,.pdf,.docx"
                    onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                </div>
              )}

              {/* Boutons d'action */}
              <div className="action-buttons">
                <button 
                  className="btn-primary"
                  onClick={handleAnalyze}
                  disabled={loading || !text.trim()}
                >
                  {loading ? (
                    <>
                      <FaSync className="spinner" /> Analyse...
                    </>
                  ) : (
                    'Lancer l\'analyse'
                  )}
                </button>
                <button 
                  className="btn-secondary"
                  onClick={resetAnalysis}
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>

          {/* Exemples rapides */}
          <div className="examples-card">
            <h4>Exemples rapides</h4>
            <div className="examples-grid">
              {examples.map((example, idx) => (
                <button
                  key={idx}
                  className="example-btn"
                  onClick={() => loadExample(example.text)}
                  title={example.text}
                >
                  <strong>{example.title}</strong>
                  <small>{example.text.substring(0, 40)}...</small>
                </button>
              ))}
            </div>
          </div>

          {/* Ressources */}
          <div className="resources-card">
            <h4>Ressources</h4>
            <button className="resource-btn" onClick={downloadGuide}>
              <FaDownload /> Guide d'utilisation
            </button>
            <button className="resource-btn" onClick={downloadModel}>
              <FaDownload /> Télécharger le modèle
            </button>
          </div>
        </div>

        {/* Colonne Droite: Résultats */}
        <div className="results-section">
          {!results ? (
            <div className="empty-results">
              <div className="empty-icon"></div>
              <h3>Aucun résultat</h3>
              <p>Lancez une analyse pour voir les résultats ici</p>
            </div>
          ) : (
            <div className="results-card">
              <div className="results-tabs">
                <button 
                  className={`tab ${viewMode === 'visual' ? 'active' : ''}`}
                  onClick={() => setViewMode('visual')}
                >
                  Visuel
                </button>
                <button 
                  className={`tab ${viewMode === 'stats' ? 'active' : ''}`}
                  onClick={() => setViewMode('stats')}
                >
                  Stats
                </button>
                <button 
                  className={`tab ${viewMode === 'table' ? 'active' : ''}`}
                  onClick={() => setViewMode('table')}
                >
                  Tableau
                </button>
              </div>

              <div className="results-content">
                {viewMode === 'visual' && <Results results={results} />}
                {viewMode === 'stats' && <Statistics results={results} />}
                {viewMode === 'table' && (
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Token</th>
                        <th>Étiquette</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.tokens?.map((token, idx) => (
                        <tr key={idx}>
                          <td>{token}</td>
                          <td className={`label ${(results.labels?.[idx] || 'O').toLowerCase()}`}>
                            {results.labels?.[idx] || 'O'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Boutons d'export */}
              <div className="export-buttons">
                <button className="export-btn" onClick={exportJSON}>
                  <FaDownload /> JSON
                </button>
                <button className="export-btn" onClick={exportCSV}>
                  <FaDownload /> CSV
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section graphiques (en bas) */}
      {results && <Charts results={results} />}
    </div>
  )
}