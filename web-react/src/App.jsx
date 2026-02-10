// Main application component
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage'
import AnalyzePage from './pages/AnalyzePage'
import HistoryPage from './pages/HistoryPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analyze" element={<AnalyzePage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </Layout>
  )
}