import React from 'react';
import './App.css';
import PDFOcr from './components/PDFOcr';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>PDF OCR Application</h1>
      </header>
      <main>
        <PDFOcr />
      </main>
      <footer>
        <p>Powered by Tesseract OCR</p>
      </footer>
    </div>
  );
}

export default App; 