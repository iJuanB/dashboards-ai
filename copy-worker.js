const fs = require('fs');
const path = require('path');

// Ruta al worker en node_modules
const workerPath = path.join(
  __dirname,
  'node_modules',
  'pdfjs-dist',
  'build',
  'pdf.worker.min.js'
);

// Ruta de destino en la carpeta public
const destPath = path.join(__dirname, 'public', 'pdf.worker.min.js');

// Copiar el archivo
fs.copyFileSync(workerPath, destPath);

console.log('Worker copiado exitosamente a public/pdf.worker.min.js'); 