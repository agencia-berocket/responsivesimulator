import React, { useRef, useState, useEffect } from 'react';
import { DeviceSpec, Orientation } from '../types';
import { RotateCw, Maximize2, ExternalLink, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';

interface DeviceFrameProps {
  id?: string;
  device: DeviceSpec;
  orientation: Orientation;
  onOrientationToggle?: () => void;
  onDeviceChange?: (device: DeviceSpec) => void;
  availableDevices?: DeviceSpec[];
  showBezel: boolean;
  scale: number;
  onScaleChange?: (newScale: number) => void;
  sourceType: 'template' | 'editor' | 'url' | 'local-project';
  contentHtml?: string;
  url?: string;
  onScroll?: (scrollTop: number, scrollHeight: number) => void;
  syncScrollTop?: number;
  frameRef: React.RefObject<HTMLDivElement | null>;
  label?: string;
  hideToolbar?: boolean;
  onReload?: () => void;
  isLiveConnected?: boolean;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  id,
  device,
  orientation,
  onOrientationToggle,
  onDeviceChange,
  availableDevices = [],
  showBezel,
  scale,
  onScaleChange,
  sourceType,
  contentHtml = '',
  url = '',
  onScroll,
  syncScrollTop,
  frameRef,
  label,
  hideToolbar = false,
  onReload,
  isLiveConnected = false,
}) => {
  const isLandscape = orientation === 'landscape';
  const width = isLandscape ? device.height : device.width;
  const height = isLandscape ? device.width : device.height;

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  // Sync scroll if requested
  useEffect(() => {
    if (syncScrollTop !== undefined && iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.scrollTo({
          top: syncScrollTop,
          behavior: 'auto',
        });
      } catch {
        // Cross-origin iframe may block scrollTo
      }
    }
  }, [syncScrollTop]);

  const handleRefresh = () => {
    if (onReload) {
      onReload();
    }
    setIframeKey((prev) => prev + 1);
  };

  const handleOpenExternal = () => {
    if (sourceType === 'url' && url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div id={id} className="flex flex-col items-center select-none">
      {/* Device Toolbar / Specs Header in Neumorphic styling */}
      {!hideToolbar && (
        <div className="w-full mb-3 flex items-center justify-between gap-2 px-1 text-xs text-[#2b3674]">
          <div className="flex items-center gap-2 overflow-hidden">
            {label && (
              <span className="bg-[#e6edf7] text-[#5b5de5] font-extrabold px-3 py-1 rounded-full text-[11px] uppercase tracking-wide neu-sunken">
                {label}
              </span>
            )}
            {availableDevices.length > 0 && onDeviceChange ? (
              <select
                value={device.id}
                onChange={(e) => {
                  const found = availableDevices.find((d) => d.id === e.target.value);
                  if (found) onDeviceChange(found);
                }}
                className="neu-raised-sm text-[#2b3674] rounded-full px-3 py-1 text-xs font-bold focus:outline-hidden truncate cursor-pointer"
              >
                {availableDevices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.width}×{d.height})
                  </option>
                ))}
              </select>
            ) : (
              <span className="font-extrabold text-[#2b3674] truncate">{device.name}</span>
            )}
            <span className="text-[#8fa0b5] text-[11px] font-mono whitespace-nowrap neu-raised-sm px-2.5 py-0.5 rounded-full font-bold">
              {width} × {height} px
            </span>
          </div>

          {/* Toolbar Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            {onScaleChange && (
              <div className="flex items-center neu-sunken px-1.5 py-0.5 rounded-full">
                <button
                  type="button"
                  onClick={() => onScaleChange(Math.max(0.3, +(scale - 0.1).toFixed(1)))}
                  title="Diminuir Zoom"
                  className="p-1 text-[#8fa0b5] hover:text-[#2b3674] rounded-full transition-colors"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 text-[11px] font-mono font-bold text-[#2b3674]">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => onScaleChange(Math.min(1.2, +(scale + 0.1).toFixed(1)))}
                  title="Aumentar Zoom"
                  className="p-1 text-[#8fa0b5] hover:text-[#2b3674] rounded-full transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {onOrientationToggle && (
              <button
                type="button"
                onClick={onOrientationToggle}
                title={`Alternar para ${isLandscape ? 'Retrato' : 'Paisagem'}`}
                className="p-1.5 neu-raised-sm text-[#8fa0b5] hover:text-[#2b3674] rounded-xl transition-all"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={handleRefresh}
              title={isLiveConnected ? "Recarregar do disco ao vivo (F5 / Ctrl+R)" : "Recarregar tela (F5 / Ctrl+R)"}
              className="relative p-1.5 neu-raised-sm text-[#8fa0b5] hover:text-[#5b5de5] rounded-xl transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {isLiveConnected && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>

            {sourceType === 'url' && url && (
              <button
                type="button"
                onClick={handleOpenExternal}
                title="Abrir URL em nova aba"
                className="p-1.5 neu-raised-sm text-[#8fa0b5] hover:text-[#2b3674] rounded-xl transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Frame Container with Scale Transform */}
      <div
        style={{
          width: `${width * scale}px`,
          height: `${height * scale}px`,
          position: 'relative',
        }}
        className="transition-all duration-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          ref={frameRef}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
          className={`relative bg-neutral-900 overflow-hidden shadow-2xl transition-all duration-150 ${
            showBezel
              ? device.category === 'mobile'
                ? 'rounded-[44px] border-[10px] border-neutral-900 ring-1 ring-neutral-700'
                : device.category === 'tablet'
                ? 'rounded-[28px] border-[12px] border-neutral-900 ring-1 ring-neutral-700'
                : 'rounded-xl border-[6px] border-neutral-800 ring-1 ring-neutral-700'
              : 'rounded-lg border border-neutral-700 ring-1 ring-neutral-800'
          }`}
        >
          {/* Bezel Notch / Dynamic Island for Mobile */}
          {showBezel && device.category === 'mobile' && !isLandscape && (
            <>
              {device.bezelStyle === 'dynamic-island' && (
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-between px-3 pointer-events-none shadow-md">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 ring-1 ring-neutral-800"></div>
                  <div className="w-2 h-2 rounded-full bg-neutral-900/90"></div>
                </div>
              )}
              {device.bezelStyle === 'notch' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-5 bg-neutral-950 rounded-b-2xl z-30 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-1 bg-neutral-800 rounded-full"></div>
                </div>
              )}
              {device.bezelStyle === 'hole-punch' && (
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full z-30 pointer-events-none ring-1 ring-neutral-800"></div>
              )}

              {/* Status Bar info */}
              <div className="absolute top-0 left-0 right-0 h-9 px-6 flex items-center justify-between text-[10px] font-semibold text-neutral-800 z-20 pointer-events-none">
                <span>09:41</span>
                <div className="flex items-center gap-1.5 text-neutral-800">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>
            </>
          )}

          {/* Desktop Window Title Bar when Bezel is active */}
          {showBezel && device.category === 'desktop' && (
            <div className="h-7 bg-neutral-800 border-b border-neutral-700 px-3 flex items-center justify-between text-neutral-400 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
              </div>
              <span className="text-[11px] font-medium text-neutral-300 truncate max-w-xs">
                {sourceType === 'url'
                  ? url || 'Navegador Web'
                  : sourceType === 'local-project'
                  ? 'Projeto Local (.index)'
                  : device.name}
              </span>
              <div className="w-10"></div>
            </div>
          )}

          {/* Content Iframe */}
          <div
            className={`w-full bg-white relative ${
              showBezel && device.category === 'desktop'
                ? 'h-[calc(100%-28px)]'
                : 'h-full'
            }`}
          >
            {sourceType === 'url' ? (
              <iframe
                key={`iframe-${device.id}-${orientation}-${sourceType}-${iframeKey}`}
                ref={iframeRef}
                src={url || 'about:blank'}
                title={`Preview ${device.name}`}
                className="w-full h-full border-none bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                loading="lazy"
              />
            ) : (
              <iframe
                key={`iframe-${device.id}-${orientation}-${sourceType}-${iframeKey}`}
                ref={iframeRef}
                srcDoc={contentHtml}
                title={`Preview ${device.name}`}
                className="w-full h-full border-none bg-white"
                sandbox="allow-scripts allow-same-origin"
              />
            )}
          </div>

          {/* iOS Home Indicator Bar */}
          {showBezel && device.category === 'mobile' && device.hasHomeBar && !isLandscape && (
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-neutral-900/70 rounded-full z-30 pointer-events-none"></div>
          )}
        </div>
      </div>
    </div>
  );
};
