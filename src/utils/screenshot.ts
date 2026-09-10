import html2canvas from 'html2canvas';
import { DeviceSpec } from '../types';

export interface CompositeOptions {
  title?: string;
  mobileDevice?: DeviceSpec;
  desktopDevice?: DeviceSpec;
  backgroundColor?: 'dark' | 'slate' | 'light' | 'transparent';
  format?: 'png' | 'jpeg';
  quality?: number; // 0.1 to 1.0
  includeHeader?: boolean;
}

export interface CaptureOptions {
  scale?: number;
  showBezel?: boolean;
  projectTitle?: string;
  contentHtml?: string;
  url?: string;
}

/**
 * Downloads a canvas as a file using dataURL and Blob fallback for maximum reliability
 */
export function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  format: 'png' | 'jpeg' = 'png',
  quality = 0.92
): void {
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const extension = format === 'jpeg' ? 'jpg' : 'png';

  try {
    const dataUrl = canvas.toDataURL(mimeType, quality);
    const link = document.createElement('a');
    link.download = `${filename}.${extension}`;
    link.href = dataUrl;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    }, 300);
  } catch (err) {
    console.warn('toDataURL falhou, tentando blob:', err);
    try {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error('Falha ao gerar blob do canvas');
            return;
          }
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `${filename}.${extension}`;
          link.href = url;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            if (document.body.contains(link)) {
              document.body.removeChild(link);
            }
            URL.revokeObjectURL(url);
          }, 2000);
        },
        mimeType,
        quality
      );
    } catch (blobErr) {
      console.error('Erro fatal ao exportar canvas:', blobErr);
    }
  }
}

/**
 * Copies canvas image to system clipboard
 */
export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  try {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/png')
    );
    if (!blob) return false;
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob }),
    ]);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}

/**
 * Formats bytes into human readable string
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Checks if a canvas is completely blank or transparent
 */
function isCanvasBlank(canvas: HTMLCanvasElement): boolean {
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) return true;
    const width = Math.min(canvas.width, 100);
    const height = Math.min(canvas.height, 100);
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3];
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // Check if pixel is non-white and non-transparent
      if (alpha > 0 && (r !== 255 || g !== 255 || b !== 255)) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Renders HTML string directly to Canvas using SVG foreignObject
 */
export async function renderHtmlToCanvas(
  html: string,
  width: number,
  height: number,
  scale = 2
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  let cleanHtml = html.trim();
  if (!cleanHtml.toLowerCase().includes('<body')) {
    cleanHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>html,body{margin:0;padding:0;width:100%;height:100%;font-family:sans-serif;background:#ffffff;}</style></head><body>${cleanHtml}</body></html>`;
  }

  // Remove scripts to avoid execution during SVG load
  const sanitizedContent = cleanHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  const svgData = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width:${width}px;height:${height}px;background:#ffffff;overflow:hidden;">
          ${sanitizedContent}
        </div>
      </foreignObject>
    </svg>
  `;

  return new Promise((resolve) => {
    const img = new Image();
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      resolve(canvas);
    };

    img.src = url;
  });
}

/**
 * Builds a vector Device Bezel wrapper around contentCanvas
 */
export function buildDeviceBezelCanvas(
  contentCanvas: HTMLCanvasElement,
  device: DeviceSpec,
  options?: {
    scale?: number;
    showBezel?: boolean;
    projectTitle?: string;
  }
): HTMLCanvasElement {
  const scale = options?.scale ?? 2;
  const showBezel = options?.showBezel ?? true;
  const projectTitle = options?.projectTitle || 'Simulador Responsivo';

  const contentW = contentCanvas.width;
  const contentH = contentCanvas.height;

  if (!showBezel) {
    return contentCanvas;
  }

  const isDesktop = device.category === 'desktop';
  const isMobile = device.category === 'mobile';

  const headerBarH = isDesktop ? 36 : 44;
  const footerBarH = isMobile ? 24 : 0;
  const borderWidth = isMobile ? 16 : 8;

  const totalW = contentW + borderWidth * 2 * scale;
  const totalH = (headerBarH + footerBarH + borderWidth * 2) * scale + contentH;

  const canvas = document.createElement('canvas');
  canvas.width = totalW;
  canvas.height = totalH;
  const ctx = canvas.getContext('2d');

  if (!ctx) return contentCanvas;

  // Background frame
  ctx.fillStyle = '#111827';
  ctx.beginPath();
  ctx.roundRect(0, 0, totalW, totalH, 24 * scale);
  ctx.fill();

  if (isDesktop) {
    // Window header bar
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, totalW, headerBarH * scale);

    // Title bar dots
    const dotY = (headerBarH / 2) * scale;
    const dotR = 5 * scale;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(16 * scale, dotY, dotR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(32 * scale, dotY, dotR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(48 * scale, dotY, dotR, 0, Math.PI * 2);
    ctx.fill();

    // Title Text
    ctx.fillStyle = '#9ca3af';
    ctx.font = `bold ${12 * scale}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`${projectTitle} - ${device.name}`, totalW / 2, dotY + 4 * scale);
  } else {
    // Mobile status bar
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, totalW, headerBarH * scale);

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${11 * scale}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText('09:41', 20 * scale, 26 * scale);

    ctx.textAlign = 'right';
    ctx.fillText(`${device.name}`, totalW - 20 * scale, 26 * scale);
  }

  // Draw webpage content canvas inside screen frame
  const contentX = borderWidth * scale;
  const contentY = (headerBarH + borderWidth) * scale;
  ctx.drawImage(contentCanvas, contentX, contentY);

  // Mobile Bottom Home Bar
  if (isMobile) {
    const bottomY = contentY + contentH;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, bottomY, totalW, (footerBarH + borderWidth) * scale);

    // Home indicator pill
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(totalW / 2 - 60 * scale, bottomY + 8 * scale, 120 * scale, 4 * scale, 2 * scale);
    ctx.fill();
  }

  return canvas;
}

/**
 * Captures the exact current Viewport view of the simulator device frame
 */
export async function captureSimulatorViewport(
  frameElement: HTMLElement,
  device: DeviceSpec,
  options?: CaptureOptions
): Promise<HTMLCanvasElement> {
  const scale = options?.scale ?? 2;
  const showBezel = options?.showBezel ?? true;
  const projectTitle = options?.projectTitle || 'Simulador Responsivo';

  const iframe = frameElement.querySelector('iframe');
  let contentCanvas: HTMLCanvasElement | null = null;

  if (iframe) {
    try {
      const iframeWin = iframe.contentWindow;
      const iframeDoc = iframe.contentDocument || iframeWin?.document;

      if (iframeDoc && (iframeDoc.body || iframeDoc.documentElement)) {
        const targetEl = iframeDoc.body || iframeDoc.documentElement;
        const scrollY = iframeWin?.scrollY || iframeWin?.pageYOffset || 0;
        const scrollX = iframeWin?.scrollX || iframeWin?.pageXOffset || 0;
        const width = iframe.clientWidth || device.width;
        const height = iframe.clientHeight || device.height;

        contentCanvas = await html2canvas(targetEl, {
          scale,
          width,
          height,
          windowWidth: width,
          windowHeight: height,
          x: scrollX,
          y: scrollY,
          window: iframeWin as Window,
          document: iframeDoc as Document,
          useCORS: true,
          allowTaint: false,
          logging: false,
          backgroundColor: '#ffffff',
        } as any);
      }
    } catch (err) {
      console.warn('Captura do iframe via html2canvas falhou:', err);
    }
  }

  // Fallback 1: If html2canvas returned a blank or null canvas, try SVG foreignObject on contentHtml
  if ((!contentCanvas || isCanvasBlank(contentCanvas)) && options?.contentHtml) {
    try {
      contentCanvas = await renderHtmlToCanvas(options.contentHtml, device.width, device.height, scale);
    } catch (svgErr) {
      console.warn('SVG foreignObject render falhou:', svgErr);
    }
  }

  // Fallback 2: Capture frameElement directly
  if (!contentCanvas || isCanvasBlank(contentCanvas)) {
    try {
      const origTransform = frameElement.style.transform;
      frameElement.style.transform = 'none';
      contentCanvas = await html2canvas(frameElement, {
        scale,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#ffffff',
      });
      frameElement.style.transform = origTransform;
    } catch (err) {
      console.warn('Fallback html2canvas no frameElement falhou:', err);
    }
  }

  // Fallback 3: Create a clean base canvas if all capture methods returned empty
  if (!contentCanvas) {
    contentCanvas = document.createElement('canvas');
    contentCanvas.width = device.width * scale;
    contentCanvas.height = device.height * scale;
    const ctx = contentCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, contentCanvas.width, contentCanvas.height);
    }
  }

  return buildDeviceBezelCanvas(contentCanvas, device, { scale, showBezel, projectTitle });
}

/**
 * Captures full scrollable height of the page inside the simulator
 */
export async function captureSimulatorFullScroll(
  frameElement: HTMLElement,
  device: DeviceSpec,
  options?: CaptureOptions
): Promise<{ fullCanvas: HTMLCanvasElement; contentCanvas: HTMLCanvasElement }> {
  const scale = options?.scale ?? 2;
  const showBezel = options?.showBezel ?? true;
  const projectTitle = options?.projectTitle || 'Simulador Responsivo';

  const iframe = frameElement.querySelector('iframe');
  let contentCanvas: HTMLCanvasElement | null = null;

  if (iframe) {
    try {
      const iframeWin = iframe.contentWindow;
      const iframeDoc = iframe.contentDocument || iframeWin?.document;

      if (iframeDoc && (iframeDoc.body || iframeDoc.documentElement)) {
        const body = iframeDoc.body;
        const html = iframeDoc.documentElement;

        const deviceW = device.width;
        const fullW = Math.max(
          body ? body.scrollWidth : 0,
          body ? body.offsetWidth : 0,
          html ? html.clientWidth : 0,
          html ? html.scrollWidth : 0,
          html ? html.offsetWidth : 0,
          deviceW
        );

        const fullH = Math.max(
          body ? body.scrollHeight : 0,
          body ? body.offsetHeight : 0,
          html ? html.clientHeight : 0,
          html ? html.scrollHeight : 0,
          html ? html.offsetHeight : 0,
          device.height
        );

        contentCanvas = await html2canvas(body || html, {
          scale,
          width: fullW,
          height: fullH,
          windowWidth: fullW,
          windowHeight: fullH,
          x: 0,
          y: 0,
          window: iframeWin as Window,
          document: iframeDoc as Document,
          useCORS: true,
          allowTaint: false,
          logging: false,
          backgroundColor: '#ffffff',
        } as any);
      }
    } catch (err) {
      console.warn('Captura Full Scroll do iframe falhou, usando viewport:', err);
    }
  }

  if ((!contentCanvas || isCanvasBlank(contentCanvas)) && options?.contentHtml) {
    try {
      contentCanvas = await renderHtmlToCanvas(options.contentHtml, device.width, device.height, scale);
    } catch (svgErr) {
      console.warn('SVG foreignObject Full Scroll render falhou:', svgErr);
    }
  }

  if (!contentCanvas) {
    contentCanvas = await captureSimulatorViewport(frameElement, device, { ...options, showBezel: false });
  }

  const fullCanvas = buildDeviceBezelCanvas(contentCanvas, device, { scale, showBezel, projectTitle });
  return { fullCanvas, contentCanvas };
}

/**
 * Legacy wrapper for compatibility
 */
export async function captureElementToCanvas(
  element: HTMLElement,
  options?: { scale?: number; backgroundColor?: string | null }
): Promise<HTMLCanvasElement> {
  return await captureSimulatorViewport(element, {
    id: 'custom',
    name: 'Dispositivo',
    category: 'desktop',
    width: element.clientWidth || 1280,
    height: element.clientHeight || 800,
    pixelRatio: 2,
    platform: 'windows',
    bezelStyle: 'none',
  }, options);
}
