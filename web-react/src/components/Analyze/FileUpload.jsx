import React, { useRef } from 'react'
import { FaFileUpload } from 'react-icons/fa'

export default function FileUpload({ onFileSelect, loading }) {
  const fileInput = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <div className="file-upload">
      <h3>Importez un document</h3>
      <div
        className="upload-zone"
        onClick={() => fileInput.current?.click()}
      >
        <FaFileUpload size={40} />
        <p>Glissez un fichier ou cliquez pour sélectionner</p>
        <small>PDF, DOCX, TXT</small>
      </div>
      <input
        ref={fileInput}
        type="file"
        onChange={handleFileChange}
        accept=".pdf,.docx,.txt"
        style={{ display: 'none' }}
      />
    </div>
  )
}
