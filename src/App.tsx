import React from 'react';
import { useState } from 'react';
import { Search, Upload, Download, FileSearch, Glasses as MagnifyingGlass } from 'lucide-react';
import { useDropzone, FileRejection } from 'react-dropzone';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedFile, setProcessedFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFileName(acceptedFiles[0].name);
        setIsProcessing(true);
        setProgress(0);
        
        // Simulate processing with progress
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              setIsProcessing(false);
              setProcessedFile(URL.createObjectURL(acceptedFiles[0]));
              return 100;
            }
            return prev + 10;
          });
        }, 500);
      }
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(40deg,rgba(59,130,246,0.1)_0%,rgba(59,130,246,0)_40%,rgba(59,130,246,0.1)_60%)]" />
      <div className="absolute top-0 left-0 w-full h-16 glass shadow-sm">
        <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-6 h-6 text-blue-600 animate-float" />
            <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              MakeMeSearchable.io
            </span>
          </div>
        </div>
      </div>
      <div className="max-w-xl w-full">
        <div className="text-center mb-12 relative">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-200 rounded-full blur-xl opacity-20 animate-pulse" />
              <MagnifyingGlass className="w-16 h-16 text-blue-600 relative animate-float" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Make Your PDFs Searchable
          </h1>
          <p className="text-gray-600 text-lg">
            Turn your PDFs into searchable documents in seconds
          </p>
        </div>

        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-xl p-8 transition-all duration-300 ease-in-out glass glass-hover
            ${isDragActive ? 'border-blue-500 bg-blue-50/50' : 'border-gray-300'}
            ${isProcessing ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:border-blue-500'}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center text-center">
            <FileSearch className={`w-16 h-16 mb-4 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drag & drop your PDF
            </p>
            <p className="text-sm text-gray-500 mb-4">
              or click below to upload your file
            </p>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200" />
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const input = document.querySelector('input[type="file"]');
                  if (input) {
                    input.click();
                  }
                }}
                className="relative bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload PDF
              </button>
            </div>
          </div>
        </div>

        {isProcessing && (
          <div className="mt-8 glass rounded-xl p-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Processing...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {processedFile && !isProcessing && (
          <div className="mt-8 glass glass-hover rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileSearch className="w-6 h-6 text-blue-600" />
                <span className="text-gray-900 font-medium">{fileName}</span>
              </div>
              <a
                href={processedFile}
                download={`searchable-${fileName}`}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200" />
                <button className="relative bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
