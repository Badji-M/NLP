const API_BASE = "https://nlp-4g9u.onrender.com";

export const analyzeText = async (text) => {
  const response = await fetch(`${API_BASE}/predict-enhanced`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};

export const analyzeFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await fetch(`${API_BASE}/predict-file`, {
    method: "POST",
    body: formData
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};

export const exportPDF = async (data) => {
  const response = await fetch(`${API_BASE}/export-pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`PDF export error: ${response.status}`);
  }
  
  return response.blob();
};