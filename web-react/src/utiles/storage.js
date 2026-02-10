const HISTORY_KEY = 'ner_analysis_history';

export const saveToHistory = (text, results) => {
  const history = getHistory();
  const newItem = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    text: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
    fullText: text,
    results: results,
    entitiesCount: results.entities?.length || 0
  };
  
  history.unshift(newItem);
  
  // Garder seulement les 50 dernières analyses
  if (history.length > 50) {
    history.pop();
  }
  
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

export const getHistory = () => {
  const history = localStorage.getItem(HISTORY_KEY);
  return history ? JSON.parse(history) : [];
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};

export const deleteFromHistory = (id) => {
  const history = getHistory();
  const newHistory = history.filter(item => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
};