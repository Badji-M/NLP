import React, { useState } from 'react';

export default function ExportPanel({ text, entities, statistics }) {
  const [exporting, setExporting] = useState(false);

  const exportJSON = () => {
    const data = {
      text,
      entities,
      statistics,
      timestamp: new Date().toISOString(),
      model: "CRF NER French Model"
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ner-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportPDF = async () => {
    setExporting(true);
    try {
      const response = await fetch('http://localhost:8000/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          entities,
          statistics,
          entities_by_type: statistics.by_type || []
        })
      });

      if (!response.ok) throw new Error('Erreur lors de la génération du PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport-ner-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur export PDF:', error);
      alert('Erreur lors de l\'export PDF');
    } finally {
      setExporting(false);
    }
  };

  const exportCSV = () => {
    const csvContent = [
      ['Texte', 'Type', 'Position', 'Longueur'],
      ...entities.map(e => [e.text, e.label, `${e.start}-${e.end}`, e.text.length])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `entites-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="export-panel">
      <h3>📤 Export des résultats</h3>
      <div className="export-buttons">
        <button onClick={exportJSON} disabled={!entities.length}>
          📥 Télécharger JSON
        </button>
        <button onClick={exportPDF} disabled={!entities.length || exporting}>
          {exporting ? 'Génération...' : '📊 Générer PDF'}
        </button>
        <button onClick={exportCSV} disabled={!entities.length}>
          📈 Télécharger CSV
        </button>
      </div>
      
      <div className="export-preview">
        <h4>Aperçu des données :</h4>
        <div className="preview-cards">
          <div className="preview-card">
            <strong>Format JSON</strong>
            <code>{JSON.stringify({ total_entities: entities.length, types: statistics.by_type?.length || 0 }, null, 2)}</code>
          </div>
          <div className="preview-card">
            <strong>Contenu PDF</strong>
            <p>Texte analysé + Statistiques + Tableaux</p>
          </div>
        </div>
      </div>
    </div>
  );
}