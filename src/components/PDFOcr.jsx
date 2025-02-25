import React, { useState } from 'react';
import { processPDF } from '../services/ocrService';
import './PDFOcr.css';

const PDFOcr = () => {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setResult(null);
    } else {
      alert('Please select a valid PDF file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a PDF file first');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setStatusMessage('Starting OCR process...');
    setResult(null);

    try {
      const ocrResult = await processPDF(file, (progressData) => {
        setProgress(progressData.progress);
        setStatusMessage(progressData.message);
      });

      setResult(ocrResult);
    } catch (error) {
      console.error('OCR processing failed:', error);
      setStatusMessage('OCR processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const downloadText = () => {
    if (!result) return;
    
    const blob = new Blob([result.text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace('.pdf', '')}_ocr.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pdf-ocr-container">
      <h2>PDF OCR Processor</h2>
      <p>Upload a PDF to extract searchable text using Tesseract OCR</p>
      
      <form onSubmit={handleSubmit}>
        <div className="file-input-container">
          <input 
            type="file" 
            accept=".pdf" 
            onChange={handleFileChange} 
            disabled={processing}
          />
          {file && <p>Selected file: {file.name}</p>}
        </div>
        
        <button 
          type="submit" 
          disabled={!file || processing}
          className="submit-button"
        >
          {processing ? 'Processing...' : 'Extract Text'}
        </button>
      </form>
      
      {processing && (
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="status-message">{statusMessage}</p>
        </div>
      )}
      
      {result && (
        <div className="result-container">
          <div className="result-header">
            <h3>Extracted Text ({result.numPages} pages)</h3>
            <button onClick={downloadText} className="download-button">
              Download Text
            </button>
          </div>
          <div className="text-preview">
            <pre>{result.text.substring(0, 1000)}...</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFOcr; 