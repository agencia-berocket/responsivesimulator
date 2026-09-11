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
 * Strategy 1 (best quality for local-project / editor mode):
 * Creates a hidden, non-sandboxed iframe, writes HTML into it,
 * waits for it to load, then runs html2canvas on its body.
 */
async function captureHtmlInOffscreenIframe(
  html: string,
  width: number,
  height: number,
  scale: number,
  fullScroll = false
): Promise<HTMLCanvasElement | null> {
  return new Promise((resolve) => {
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
        if (!iDoc) return cleanup(null);

        const body = iDoc.body || iDoc.documentElement;

        // Give scripts a moment to execute
        await new Promise((r) => setTimeout(r, 350));

        const captureW = fullScroll
          ? Math.max(body.scrollWidth, body.offsetWidth, width)
          : width;
        const captureH = fullScroll
          ? Math.max(
              body.scrollHeight,
              body.offsetHeight,
              iDoc.documentElement.scrollHeight,
              height
            )
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
 * Strategy 2 (fallback): SVG foreignObject render — no external resources
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

/**
 * Strategy 3 (URL mode): Uses Screen Capture API (getDisplayMedia) to capture
 * exactly what's visible in the iframe — works for ANY URL, bypasses CORS.
 * The user will see a browser permission dialog to share their tab.
 */
async function captureViaDisplayMedia(
  frameElement: HTMLElement,
  device: DeviceSpec,
  scale: number
): Promise<HTMLCanvasElement | null> {
  const iframe = frameElement.querySelector('iframe');
  if (!iframe) return null;

  let stream: MediaStream | null = null;

  try {
    stream = await (navigator.mediaDevices as any).getDisplayMedia({
      video: {
        displaySurface: 'browser',
        width: { ideal: window.screen.width * (window.devicePixelRatio || 1) },
        height: { ideal: window.screen.height * (window.devicePixelRatio || 1) },
        frameRate: { ideal: 30 },
      },
      audio: false,
      // Chrome 94+ hint: pre-select current tab
      preferCurrentTab: true,
    } as any);
  } catch (err: any) {
    // NotAllowedError = user cancelled the dialog
    const name = err?.name || '';
    if (name === 'NotAllowedError' || name === 'AbortError') {
      throw Object.assign(new Error('USER_CANCELLED'), { code: 'USER_CANCELLED' });
    }
    console.warn('[screenshot] getDisplayMedia failed:', err);
    return null;
  }

  try {
    const video = document.createElement('video');
    video.muted = true;
    video.autoplay = true;
    video.srcObject = stream;

    await new Promise<void>((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('video timeout')), 8000);
      video.onloadedmetadata = () => { clearTimeout(t); resolve(); };
      video.onerror = () => { clearTimeout(t); reject(new Error('video error')); };
    });

    await video.play();

    // Wait 2 animation frames for pixel data to be available
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

    // Draw full captured screen to canvas
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = video.videoWidth;
    screenCanvas.height = video.videoHeight;
    const screenCtx = screenCanvas.getContext('2d')!;
    screenCtx.drawImage(video, 0, 0);

    // Stop the stream
    stream.getTracks().forEach((t) => t.stop());

    // Get iframe's visual bounding rect in viewport space
    const iframeRect = iframe.getBoundingClientRect();

    if (iframeRect.width < 4 || iframeRect.height < 4) {
      console.warn('[screenshot] iframe rect too small:', iframeRect);
      return null;
    }

    // Map viewport coordinates to captured video coordinates
    const vpW = window.innerWidth;
    const vpH = window.innerHeight;
    const capW = video.videoWidth;
    const capH = video.videoHeight;

    const rxScale = capW / vpW;
    const ryScale = capH / vpH;

    const cropX = iframeRect.left * rxScale;
    const cropY = iframeRect.top * ryScale;
    const cropW = iframeRect.width * rxScale;
    const cropH = iframeRect.height * ryScale;

    // Output at device resolution × scale (high quality)
    const isLandscape = device.category === 'desktop';
    const minDim = Math.min(device.width, device.height);
    const maxDim = Math.max(device.width, device.height);
    const outW = Math.round((isLandscape ? maxDim : minDim) * scale);
    const outH = Math.round((isLandscape ? minDim : maxDim) * scale);

    const outCanvas = document.createElement('canvas');
    outCanvas.width = outW;
    outCanvas.height = outH;
    const outCtx = outCanvas.getContext('2d')!;
    outCtx.imageSmoothingEnabled = true;
    outCtx.imageSmoothingQuality = 'high';
    outCtx.drawImage(screenCanvas, cropX, cropY, cropW, cropH, 0, 0, outW, outH);

    return outCanvas;
  } catch (err) {
    stream?.getTracks().forEach((t) => t.stop());
    console.warn('[screenshot] displayMedia processing failed:', err);
    return null;
  }
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
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, totalW, headerH * scale);

    const dotY = (headerH / 2) * scale;
    const dotR = 5 * scale;
    ([['#ef4444', 16], ['#f59e0b', 32], ['#10b981', 48]] as [string, number][]).forEach(
      ([color, x]) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x * scale, dotY, dotR, 0, Math.PI * 2);
        ctx.fill();
      }
    );

    ctx.fillStyle = '#9ca3af';
    ctx.font = `bold ${12 * scale}px -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`${projectTitle} — ${device.name}`, totalW / 2, dotY + 4 * scale);
  } else {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, totalW, headerH * scale);
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${11 * scale}px -apple-system, sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText('09:41', 20 * scale, 28 * scale);
    ctx.textAlign = 'right';
    ctx.fillText(device.name, totalW - 20 * scale, 28 * scale);
  }

  ctx.drawImage(contentCanvas, border * scale, (headerH + border) * scale);

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
 * Captures the current viewport of the simulator device frame.
 *
 * Strategy order:
 *  1. If HTML content is available (local-project / editor): offscreen iframe → html2canvas
 *  2. If HTML available but step 1 fails: SVG foreignObject fallback
 *  3. If URL mode (no HTML): Screen Capture API (getDisplayMedia) — crops to the iframe area
 *  4. If all fail: white blank canvas
 */
export async function captureSimulatorViewport(
  frameElement: HTMLElement,
  device: DeviceSpec,
  options?: CaptureOptions
): Promise<HTMLCanvasElement> {
  const scale = options?.scale ?? 2;
  const showBezel = options?.showBezel ?? true;
  const projectTitle = options?.projectTitle || 'Simulador Responsivo';
  const html = options?.contentHtml || '';

  const isLandscape = device.category === 'desktop';
  const minDim = Math.min(device.width, device.height);
  const maxDim = Math.max(device.width, device.height);
  const targetW = isLandscape ? maxDim : minDim;
  const targetH = isLandscape ? minDim : maxDim;

  let contentCanvas: HTMLCanvasElement | null = null;

  if (html) {
    // Local-project / editor / template mode
    contentCanvas = await captureHtmlInOffscreenIframe(
      html, targetW, targetH, scale, false
    );

    if (!contentCanvas || isCanvasBlank(contentCanvas)) {
      try {
        contentCanvas = await renderHtmlFallback(html, targetW, targetH, scale);
      } catch {}
    }
  } else {
    // URL mode: use Screen Capture API
    // NOTE: This may throw { code: 'USER_CANCELLED' } if user dismisses the dialog
    contentCanvas = await captureViaDisplayMedia(frameElement, device, scale);
  }

  // Fallback: blank white canvas
  if (!contentCanvas) {
    contentCanvas = document.createElement('canvas');
    contentCanvas.width = targetW * scale;
    contentCanvas.height = targetH * scale;
    const ctx = contentCanvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, contentCanvas.width, contentCanvas.height);
  }

  return buildDeviceBezelCanvas(contentCanvas, device, { scale, showBezel, projectTitle });
}

/**
 * Captures the full scrollable page inside the simulator.
 * For URL mode, falls back to viewport capture (full scroll requires DOM access).
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

  const isLandscape = device.category === 'desktop';
  const minDim = Math.min(device.width, device.height);
  const maxDim = Math.max(device.width, device.height);
  const targetW = isLandscape ? maxDim : minDim;
  const targetH = isLandscape ? minDim : maxDim;

  let contentCanvas: HTMLCanvasElement | null = null;

  if (html) {
    contentCanvas = await captureHtmlInOffscreenIframe(
      html, targetW, targetH, scale, true
    );

    if (!contentCanvas || isCanvasBlank(contentCanvas)) {
      contentCanvas = await captureSimulatorViewport(frameElement, device, {
        ...options,
        showBezel: false,
      });
    }
  } else {
    // URL mode: use Screen Capture API (viewport only — full scroll not possible for cross-origin)
    contentCanvas = await captureViaDisplayMedia(frameElement, device, scale);
    if (!contentCanvas) {
      contentCanvas = document.createElement('canvas');
      contentCanvas.width = targetW * scale;
      contentCanvas.height = targetH * scale;
      const ctx = contentCanvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, contentCanvas.width, contentCanvas.height);
    }
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
