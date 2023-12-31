import * as pdfjs from 'pdfjs-dist';


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

async function loadPdf(pdfPath: string) {
  return pdfjs.getDocument({ url: pdfPath }).promise;
}

async function getPdfThumbnail(pdfPath: string) {
  const pdfDocument = await loadPdf(pdfPath);

  const pdfPage = await pdfDocument.getPage(1);

  const canvasWidth = 294;
  const canvasHeight = 360;

  const viewport = pdfPage.getViewport({ scale: 1 });

  const scale = Math.min(canvasWidth / viewport.width, canvasHeight / viewport.height);

  const canvas = document.createElement('canvas');
  canvas.width = viewport.width * scale;
  canvas.height = viewport.height * scale;

  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  await pdfPage.render({ canvasContext: context, viewport, intent: 'display', transform: [scale, 0, 0, scale, 0, 0] }).promise;

  const dataURL = canvas.toDataURL('image/png');

  return dataURL;
}

export default getPdfThumbnail;
