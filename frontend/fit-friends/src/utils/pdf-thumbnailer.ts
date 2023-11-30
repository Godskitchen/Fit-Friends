import * as pdfjs from 'pdfjs-dist';


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

// Загружаем файл с использованием pdfjs
async function loadPdf(pdfPath: string) {
  return pdfjs.getDocument({ url: pdfPath }).promise;
}

// Получаем Data URL изображения первой страницы
async function getPdfThumbnail(pdfPath: string) {
  const pdfDocument = await loadPdf(pdfPath);

  // Получаем первую страницу
  const pdfPage = await pdfDocument.getPage(1);

  // Устанавливаем размер canvas
  const canvasWidth = 294;
  const canvasHeight = 360;

  // Получаем размеры страницы
  const viewport = pdfPage.getViewport({ scale: 1 });

  // Вычисляем масштаб для изображения
  const scale = Math.min(canvasWidth / viewport.width, canvasHeight / viewport.height);

  // Устанавливаем размеры canvas с учетом масштаба
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width * scale;
  canvas.height = viewport.height * scale;

  // Рисуем содержимое страницы на canvas
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  await pdfPage.render({ canvasContext: context, viewport, intent: 'display', transform: [scale, 0, 0, scale, 0, 0] }).promise;

  // Получаем Data URL изображения
  const dataURL = canvas.toDataURL('image/png');

  return dataURL;
}

export default getPdfThumbnail;
