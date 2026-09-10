import html2canvas from 'html2canvas';
import { DeviceSpec } from '../types';

export interface CompositeOptions {
  title?: string;
  mobileDevice?: DeviceSpec;
  desktopDevice?: DeviceSpec;
  backgroundColor?: 'dark' | 'slate' | 'light' | 'transparent';
  format?: 'png' | 'jpeg';
  quality?: number;
  includeHeader?: boolean;
}

export interface CaptureOptions {
  scale?: number;
  showBezel?: boolean;
  projectTitle?: string;
  contentHtml?: string;
  url?: string;
}

// ---------------------------------------------------------------------------
// Download helpers
// ---------------------------------------------------------------------------

export function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  format: 'png' | 'jpeg' = 'png',
  quality = 0.92
): void {
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const extension = format === 'jpeg' ? 'jpg' : 'png';

  const tryBlob = () => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.download = `${filename}.${extension}`;
        a.href = url;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.contains(a) && document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 2000);
      },
      mimeType,
      quality
    );
  };

  try {
    const dataUrl = canvas.toDataURL(mimeType, quality);
    const a = document.createElement('a');
    a.download = `${filename}.${extension}`;
    a.href = dataUrl;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.contains(a) && document.body.removeChild(a);
    }, 300);
  } catch {
    tryBlob();
  }
}

export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  try {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/png')
    );
    if (!blob) return false;
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    return true;
  } catch {
    return false;
  }
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals < 0 ? 0 : decimals)) + ' ' + sizes[i];
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function isCanvasBlank(canvas: HTMLCanvasElement): boolean {
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) return true;
    const w = Math.min(canvas.width, 200);
    const h = Math.min(canvas.height, 200);
    const data = ctx.getImageData(0, 0, w, h).data;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0 && (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255)) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Creates a temporary, non-sandboxed hidden iframe, writes HTML into it,
 * waits for it to load, and then runs html2canvas on its body.
 * This is the only reliable method to capture HTML content.
 */
async function captureHtmlInOffscreenIframe(
  html: string,
  width: number,
  height: number,
  scale: number,
  fullScroll = false
): Promise<HTMLCanvasElement | null> {
  return new Promise((resolve) => {
    // Create hidden iframe with NO sandbox restriction so html2canvas can access contentDocument
    const iframe = document.createElement('iframe');
    iframe.style.cssText = [
      'position:fixed',
      'top:-9999px',
      'left:-9999px',
      `width:${width}px`,
      `height:${fullScroll ? Math.max(height, 3000) : height}px`,
      'border:none',
      'visibility:hidden',
      'pointer-events:none',
      'z-index:-1',
    ].join(';');

    document.body.appendChild(iframe);

    const cleanup = (result: HTMLCanvasElement | null) => {
      try {
        document.body.contains(iframe) && document.body.removeChild(iframe);
      } catch {}
      resolve(result);
    };

    const timeout = setTimeout(() => cleanup(null), 12000);

    iframe.onload = async () => {
      clearTimeout(timeout);
      try {
        const iDoc = iframe.contentDocument;
        const iWin = iframe.contentWindow;
        if (!iDoc || !iWin) return cleanup(null);

        const body = iDoc.body || iDoc.documentElement;

        // Give scripts a tiny moment to execute
        await new Promise((r) => setTimeout(r, 300));

        const captureW = fullScroll
          ? Math.max(body.scrollWidth, body.offsetWidth, width)
          : width;
        const captureH = fullScroll
          ? Math.max(body.scrollHeight, body.offsetHeight, iDoc.documentElement.scrollHeight, height)
          : height;

        const canvas = await html2canvas(body, {
          scale,
          width: captureW,
          height: captureH,
          windowWidth: captureW,
          windowHeight: captureH,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff',
        } as any);

        cleanup(!isCanvasBlank(canvas) ? canvas : null);
      } catch (err) {
        console.warn('[screenshot] offscreen iframe html2canvas failed:', err);
        cleanup(null);
      }
    };

    iframe.onerror = () => {
      clearTimeout(timeout);
      cleanup(null);
    };

    // Write the html into the iframe - srcdoc preserves everything including styles
    try {
      iframe.srcdoc = html;
    } catch {
      try {
        const iDoc = iframe.contentDocument!;
        iDoc.open();
        iDoc.write(html);
        iDoc.close();
      } catch {
        clearTimeout(timeout);
        cleanup(null);
      }
    }
  });
}

/**
 * Renders HTML string to canvas via SVG foreignObject (fallback, no external resources)
 */
async function renderHtmlFallback(
  html: string,
  width: number,
  height: number,
  scale: number
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d')!;

  // Strip scripts for safety in SVG
  const safe = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <foreignObject width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml" style="width:${width}px;height:${height}px;overflow:hidden;background:#fff;">
        ${safe}
      </div>
    </foreignObject>
  </svg>`;

  return new Promise((res) => {
    const img = new Image();
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      res(canvas);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      res(canvas);
    };
    img.src = url;
  });
}

// ---------------------------------------------------------------------------
// Device Bezel renderer
// ---------------------------------------------------------------------------

export function buildDeviceBezelCanvas(
  contentCanvas: HTMLCanvasElement,
  device: DeviceSpec,
  options?: { scale?: number; showBezel?: boolean; projectTitle?: string }
): HTMLCanvasElement {
  const scale = options?.scale ?? 2;
  const showBezel = options?.showBezel ?? true;
  const projectTitle = options?.projectTitle || 'Simulador Responsivo';

  if (!showBezel) return contentCanvas;

  const cW = contentCanvas.width;
  const cH = contentCanvas.height;

  const isDesktop = device.category === 'desktop';
  const isMobile = device.category === 'mobile';

  const headerH = isDesktop ? 36 : 44;
  const footerH = isMobile ? 24 : 0;
  const border = isMobile ? 16 : 8;

  const totalW = cW + border * 2 * scale;
  const totalH = (headerH + footerH + border * 2) * scale + cH;

  const out = document.createElement('canvas');
  out.width = totalW;
  out.height = totalH;
  const ctx = out.getContext('2d')!;

  // Frame body
  ctx.fillStyle = '#111827';
  ctx.beginPath();
  ctx.roundRect(0, 0, totalW, totalH, 24 * scale);
  ctx.fill();

  if (isDesktop) {
    // Header bar
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, totalW, headerH * scale);

    const dotY = (headerH / 2) * scale;
    const dotR = 5 * scale;
    [['#ef4444', 16], ['#f59e0b', 32], ['#10b981', 48]].forEach(([color, x]) => {
      ctx.fillStyle = color as string;
      ctx.beginPath();
      ctx.arc((x as number) * scale, dotY, dotR, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#9ca3af';
    ctx.font = `bold ${12 * scale}px -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`${projectTitle} — ${device.name}`, totalW / 2, dotY + 4 * scale);
  } else {
    // Mobile status bar
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, totalW, headerH * scale);
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${11 * scale}px -apple-system, sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText('09:41', 20 * scale, 28 * scale);
    ctx.textAlign = 'right';
    ctx.fillText(device.name, totalW - 20 * scale, 28 * scale);
  }

  // Content
  ctx.drawImage(contentCanvas, border * scale, (headerH + border) * scale);

  // Mobile home bar
  if (isMobile) {
    const barY = (headerH + border) * scale + cH;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, barY, totalW, (footerH + border) * scale);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    const pillW = 120 * scale;
    ctx.roundRect(totalW / 2 - pillW / 2, barY + 8 * scale, pillW, 4 * scale, 2 * scale);
    ctx.fill();
  }

  return out;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Captures current viewport of simulator.
 * Strategy: offscreen iframe (reliable) → SVG foreignObject (fallback) → blank
 */
export async function captureSimulatorViewport(
  _frameElement: HTMLElement,
  device: DeviceSpec,
  options?: CaptureOptions
): Promise<HTMLCanvasElement> {
  const scale = options?.scale ?? 2;
  const showBezel = options?.showBezel ?? true;
  const projectTitle = options?.projectTitle || 'Simulador Responsivo';
  const html = options?.contentHtml || '';

  let contentCanvas: HTMLCanvasElement | null = null;

  // Strategy 1: offscreen iframe → html2canvas (best quality, scripts run)
  if (html) {
    contentCanvas = await captureHtmlInOffscreenIframe(html, device.width, device.height, scale, false);
  }

  // Strategy 2: SVG foreignObject (no external resources, but still captures styles)
  if ((!contentCanvas || isCanvasBlank(contentCanvas)) && html) {
    try {
      contentCanvas = await renderHtmlFallback(html, device.width, device.height, scale);
    } catch {}
  }

  // Strategy 3: white blank canvas
  if (!contentCanvas) {
    contentCanvas = document.createElement('canvas');
    contentCanvas.width = device.width * scale;
    contentCanvas.height = device.height * scale;
    const ctx = contentCanvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, contentCanvas.width, contentCanvas.height);
  }

  return buildDeviceBezelCanvas(contentCanvas, device, { scale, showBezel, projectTitle });
}

/**
 * Captures full scrollable height of the page.
 */
export async function captureSimulatorFullScroll(
  frameElement: HTMLElement,
  device: DeviceSpec,
  options?: CaptureOptions
): Promise<{ fullCanvas: HTMLCanvasElement; contentCanvas: HTMLCanvasElement }> {
  const scale = options?.scale ?? 2;
  const showBezel = options?.showBezel ?? true;
  const projectTitle = options?.projectTitle || 'Simulador Responsivo';
  const html = options?.contentHtml || '';

  let contentCanvas: HTMLCanvasElement | null = null;

  // Strategy 1: offscreen iframe with full scroll dimensions
  if (html) {
    contentCanvas = await captureHtmlInOffscreenIframe(html, device.width, device.height, scale, true);
  }

  // Strategy 2: viewport capture
  if (!contentCanvas || isCanvasBlank(contentCanvas)) {
    contentCanvas = await captureSimulatorViewport(frameElement, device, { ...options, showBezel: false });
  }

  const fullCanvas = buildDeviceBezelCanvas(contentCanvas, device, { scale, showBezel, projectTitle });
  return { fullCanvas, contentCanvas };
}

/**
 * Legacy wrapper
 */
export async function captureElementToCanvas(
  element: HTMLElement,
  options?: { scale?: number; backgroundColor?: string | null }
): Promise<HTMLCanvasElement> {
  return captureSimulatorViewport(element, {
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
