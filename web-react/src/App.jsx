import React, { useMemo, useState } from "react";

const API_BASE = "http://localhost:8000";

const hashToHue = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
};

const labelToColor = (label) => {
  const hue = hashToHue(label);
  return {
    background: `hsl(${hue} 55% 22%)`,
    color: `hsl(${hue} 85% 80%)`,
    border: `1px solid hsl(${hue} 60% 35%)`
  };
};

export default function App() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState("text");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const canAnalyze = useMemo(() => {
    return (text && text.trim().length > 0) || file;
  }, [text, file]);

  const handleAnalyzeText = async () => {
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/predict-text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      if (!res.ok) throw new Error("Erreur API");
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError("Impossible de se connecter à l'API. Vérifiez que l'API est démarrée sur http://localhost:8000");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeFile = async () => {
    if (!file) return;
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_BASE}/predict-file`, {
        method: "POST",
        body: formData
      });
      if (!res.ok) throw new Error("Erreur API");
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError("Impossible de traiter le fichier. Vérifiez le format (PDF, DOCX, TXT) et l'API.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = () => {
    if (activeTab === "upload") {
      handleAnalyzeFile();
    } else {
      handleAnalyzeText();
    }
  };

  const detectedTypes = useMemo(() => {
    if (!result?.labels) return [];
    const types = new Set();
    result.labels.forEach((label) => {
      if (label && label !== "O") {
        types.add(label.replace("B-", "").replace("I-", ""));
      }
    });
    return Array.from(types).sort();
  }, [result]);

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Détection d'Entités Nommées</h1>
          <p className="subtitle">Analyse NER en français avec un modèle CRF</p>
        </div>
        <div className="badge">NER</div>
      </header>

      <section className="panel">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "text" ? "active" : ""}`}
            onClick={() => setActiveTab("text")}
          >
            Saisie texte
          </button>
          <button
            className={`tab ${activeTab === "upload" ? "active" : ""}`}
            onClick={() => setActiveTab("upload")}
          >
            Importer un document
          </button>
        </div>

        {activeTab === "text" && (
          <div className="tab-panel">
            <h2>Entrée texte</h2>
            <p className="hint">Saisissez un texte en français pour extraire les entités nommées.</p>
            <textarea
              placeholder="Exemple : Emmanuel Macron est président de la France. Il a rencontré Angela Merkel à Berlin."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={7}
            />
          </div>
        )}

        {activeTab === "upload" && (
          <div className="tab-panel">
            <h2>Importer un document</h2>
            <p className="hint">Formats acceptés : PDF, DOCX, TXT</p>

            <label className={`dropzone ${file ? "has-file" : ""}`}>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div className="dropzone-content">
                <div className="dropzone-title">Déposer un fichier ou cliquer pour parcourir</div>
                <div className="dropzone-subtitle">Taille recommandée : moins de 10 MB</div>
              </div>
              <div className="dropzone-action">Parcourir</div>
            </label>

            {file && (
              <div className="file-card">
                <div className="file-card-info">
                  <strong>{file.name}</strong>
                  <span>{(file.size / 1024).toFixed(1)} KB</span>
                </div>
                <button className="ghost" onClick={() => setFile(null)}>
                  Retirer
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="actions">
        <button disabled={!canAnalyze || loading} onClick={handleAnalyze}>
          {loading ? "Analyse en cours..." : "Lancer l'analyse"}
        </button>
        <button
          className="secondary"
          onClick={() => {
            setText("");
            setFile(null);
            setResult(null);
            setError("");
          }}
        >
          Réinitialiser
        </button>
      </section>

      <section className="panel">
        <h2>Résultats</h2>
        {!result && !error && <p className="hint">Les entités détectées apparaîtront ici.</p>}
        {error && <div className="error">{error}</div>}
        {result && (
          <div className="result">
            {result.tokens.map((token, idx) => {
              const label = result.labels[idx] || "O";
              if (label === "O") {
                return <span key={`${token}-${idx}`} className="token">{token} </span>;
              }
              const cleanLabel = label.replace("B-", "").replace("I-", "");
              return (
                <span
                  key={`${token}-${idx}`}
                  className="entity"
                  style={labelToColor(cleanLabel)}
                  title={label}
                >
                  {token} 
                </span>
              );
            })}
          </div>
        )}
      </section>

      <section className="legend">
        {detectedTypes.length === 0 ? (
          <div className="legend-empty">Aucun type détecté pour l'instant.</div>
        ) : (
          detectedTypes.map((type) => (
            <div className="legend-item" key={type}>
              <span className="entity" style={labelToColor(type)}>{type}</span>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
