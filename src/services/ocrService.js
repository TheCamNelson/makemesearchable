import * as Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Set the PDF.js worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const processPDF = async (pdfFile, progressCallback = () => {}) => {
  try {
    // Load the PDF file
    const fileReader = new FileReader();
    const pdfData = await new Promise((resolve) => {
      fileReader.onload = (e) => resolve(new Uint8Array(e.target.result));
      fileReader.readAsArrayBuffer(pdfFile);
    });

    // Load the PDF document
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    const numPages = pdf.numPages;
    let fullText = '';

    progressCallback({ status: 'loading', progress: 0, message: 'Loading PDF...' });

    // Process each page
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      progressCallback({ 
        status: 'processing', 
        progress: (pageNum - 1) / numPages * 100, 
        message: `Processing page ${pageNum} of ${numPages}...` 
      });

      // Get the page
      const page = await pdf.getPage(pageNum);
      
      // Render the page to a canvas
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      // Convert the canvas to an image data URL
      const imageData = canvas.toDataURL('image/png');
      
      // Process the image with Tesseract
      const result = await Tesseract.recognize(
        imageData,
        'eng', // Language - English
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              progressCallback({ 
                status: 'recognizing', 
                progress: (pageNum - 1 + m.progress) / numPages * 100, 
                message: `Recognizing text on page ${pageNum}: ${Math.round(m.progress * 100)}%` 
              });
            }
          }
        }
      );

      fullText += result.data.text + '\n\n';
    }

    progressCallback({ status: 'complete', progress: 100, message: 'Processing complete!' });
    
    return {
      text: fullText,
      numPages
    };
  } catch (error) {
    console.error('Error processing PDF:', error);
    progressCallback({ status: 'error', message: 'Error processing PDF' });
    throw error;
  }
}; 