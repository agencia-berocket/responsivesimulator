import React, { useState, useEffect, useRef } from 'react';
import {
  DeviceSpec,
  Orientation,
  ViewMode,
} from '../types';
import {
  POPULAR_MOBILE_DEVICES,
  POPULAR_DESKTOP_DEVICES,
} from '../data/devices';
import { DeviceFrame } from './DeviceFrame';
import {
  Minimize2,
  Smartphone,
  Laptop,
  RotateCw,
  RefreshCw,
  Camera,
  Download,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  Check,
  EyeOff,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';

interface SuperFocusViewProps {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  activeMobileDevice: DeviceSpec;
  activeDesktopDevice: DeviceSpec;
  onSelectMobileDevice: (device: DeviceSpec) => void;
  onSelectDesktopDevice: (device: DeviceSpec) => void;
  mobileOrientation: Orientation;
  desktopOrientation: Orientation;
  onToggleMobileOrientation: () => void;
  onToggleDesktopOrientation: () => void;
  showBezel: boolean;
  onToggleBezel: () => void;
  sourceType: 'local-project' | 'url' | 'template';
  contentHtml: string;
  url: string;
  onCaptureScreenshot: (overrideRef?: React.RefObject<HTMLDivElement | null>) => void;
  isCapturing: boolean;
  onOpenExportModal?: (overrideRef?: React.RefObject<HTMLDivElement | null>) => void;
  onReload?: () => void;
  isLiveConnected?: boolean;
  isAutoReloadActive?: boolean;
  onToggleAutoReload?: () => void;
}

export const SuperFocusView: React.FC<SuperFocusViewProps> = ({
  id,
  isOpen,
  onClose,
  viewMode,
  onViewModeChange,
  activeMobileDevice,
  activeDesktopDevice,
  onSelectMobileDevice,
  onSelectDesktopDevice,
  mobileOrientation,
  desktopOrientation,
  onToggleMobileOrientation,
  onToggleDesktopOrientation,
  showBezel,
  onToggleBezel,
  sourceType,
  contentHtml,
  url,
  onCaptureScreenshot,
  isCapturing,
  onOpenExportModal,
  onReload,
  isLiveConnected = false,
  isAutoReloadActive = false,
  onToggleAutoReload,
}) => {
  // Scale state for super focus: comfortable default fitting typical screens
  const [scale, setScale] = useState<number>(() => (viewMode === 'mobile-only' ? 1.0 : 0.65));
  const [isDeviceDropdownOpen, setIsDeviceDropdownOpen] = useState<boolean>(false);
  const [isBarHidden, setIsBarHidden] = useState<boolean>(false);
  const frameRef = useRef<HTMLDivElement | null>(null);

  // Synchronize default scale when mode changes
  useEffect(() => {
    if (viewMode === 'mobile-only') {
      setScale(1.0);
    } else {
      setScale(0.65);
    }
  }, [viewMode]);

  // Handle ESC key to exit Super Focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isMobile = viewMode === 'mobile-only';
  const currentDevice = isMobile ? activeMobileDevice : activeDesktopDevice;
  const currentOrientation = isMobile ? mobileOrientation : desktopOrientation;
  const toggleOrientation = isMobile ? onToggleMobileOrientation : onToggleDesktopOrientation;
  const deviceList = isMobile ? POPULAR_MOBILE_DEVICES : POPULAR_DESKTOP_DEVICES;

  const handleZoomIn = () => setScale((s) => Math.min(1.5, +(s + 0.1).toFixed(2)));
  const handleZoomOut = () => setScale((s) => Math.max(0.3, +(s - 0.1).toFixed(2)));
  const handleResetZoom = () => setScale(isMobile ? 1.0 : 0.65);

  return (
    <div
      id={id}
      className="fixed inset-0 z-50 bg-[#e5edf7] flex flex-col overflow-hidden animate-in fade-in duration-200"
    >
      {/* 1. DOCKED TOP BAR (Clean, compact 52px height, strictly docked so it NEVER overlaps the canvas) */}
      {!isBarHidden ? (
        <header className="shrink-0 w-full h-[52px] bg-[#f0f4fa]/95 backdrop-blur-md border-b border-[#d0dbe8] px-4 flex items-center justify-between gap-3 shadow-xs select-none z-30 transition-all">
          {/* Left: Mobile / Desktop pill switch + Device Selector dropdown */}
          <div className="flex items-center gap-2.5">
            {/* View Mode Switcher */}
            <div className="flex items-center neu-sunken p-0.5 text-xs font-bold rounded-full">
              <button
                type="button"
                onClick={() => {
                  onViewModeChange('mobile-only');
                  setIsDeviceDropdownOpen(false);
                }}
                className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 text-xs ${
                  isMobile ? 'neu-pill-active font-black' : 'text-[#8fa0b5] hover:text-[#2b3674]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onViewModeChange('desktop-only');
                  setIsDeviceDropdownOpen(false);
                }}
                className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 text-xs ${
                  !isMobile ? 'neu-pill-active font-black' : 'text-[#8fa0b5] hover:text-[#2b3674]'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
            </div>

            {/* Device Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDeviceDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 neu-raised-sm hover:scale-105 active:scale-95 px-3 py-1.5 rounded-xl text-xs font-extrabold text-[#2b3674] transition-all"
                title="Clique para trocar o dispositivo"
              >
                <span className="text-[#5b5de5]">{currentDevice.name}</span>
                <span className="text-[10px] text-[#8fa0b5] font-mono hidden sm:inline">
                  ({currentDevice.width}×{currentDevice.height})
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#8fa0b5]" />
              </button>

              {/* Dropdown Menu */}
              {isDeviceDropdownOpen && (
                <div className="absolute top-10 left-0 w-64 max-h-80 overflow-y-auto neu-raised rounded-2xl p-2 flex flex-col gap-1 z-50 bg-[#f0f4fa] shadow-2xl border border-[#d2dde9] animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-2 py-1 text-[10px] font-black text-[#8fa0b5] uppercase tracking-wider">
                    Trocar para {isMobile ? 'Mobile' : 'Desktop'}
                  </div>
                  {deviceList.map((dev) => {
                    const isDevActive = dev.id === currentDevice.id;
                    return (
                      <button
                        key={dev.id}
                        type="button"
                        onClick={() => {
                          if (isMobile) {
                            onSelectMobileDevice(dev);
                          } else {
                            onSelectDesktopDevice(dev);
                          }
                          setIsDeviceDropdownOpen(false);
                        }}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold text-left transition-all ${
                          isDevActive
                            ? 'neu-sunken text-[#5b5de5] bg-[#e0e9f6] font-black'
                            : 'hover:bg-[#ebf2fb] text-[#2b3674]'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span>{dev.name}</span>
                          <span className="text-[10px] text-[#8fa0b5] font-mono">
                            {dev.width} × {dev.height}
                          </span>
                        </div>
                        {isDevActive && <Check className="w-3.5 h-3.5 text-[#5b5de5]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick popular devices chips */}
            <div className="hidden xl:flex items-center gap-1 pl-2 border-l border-[#d2dde9]">
              {deviceList.slice(0, 4).map((dev) => {
                const isDevActive = dev.id === currentDevice.id;
                return (
                  <button
                    key={dev.id}
                    type="button"
                    onClick={() => {
                      if (isMobile) {
                        onSelectMobileDevice(dev);
                      } else {
                        onSelectDesktopDevice(dev);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      isDevActive
                        ? 'neu-sunken text-[#5b5de5] bg-[#e0e9f6] font-black'
                        : 'neu-raised-sm hover:scale-105 active:scale-95 text-[#2b3674]'
                    }`}
                  >
                    {dev.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Quick Tools + Hide Bar + Exit */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Orientation */}
            <button
              type="button"
              onClick={toggleOrientation}
              className="hidden sm:flex items-center gap-1 neu-raised-sm hover:scale-105 active:scale-95 px-2.5 py-1 rounded-xl text-xs font-bold text-[#2b3674] transition-all"
              title="Girar Orientação (Retrato / Paisagem)"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#5b5de5]" />
              <span className="capitalize text-[11px]">{currentOrientation}</span>
            </button>

            {/* Moldura Bezel */}
            <button
              type="button"
              onClick={onToggleBezel}
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                showBezel
                  ? 'neu-switch-on text-[#5b5de5] bg-[#e6edf7]'
                  : 'neu-raised-sm text-[#8fa0b5] hover:text-[#2b3674]'
              }`}
              title="Moldura do dispositivo"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="text-[11px]">{showBezel ? 'Moldura ON' : 'Moldura OFF'}</span>
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center neu-sunken rounded-xl px-1.5 py-0.5 gap-1">
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-1 hover:text-[#5b5de5] text-[#8fa0b5] transition-colors"
                title="Diminuir Zoom"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="px-1 text-[11px] font-mono font-bold text-[#5b5de5] hover:underline"
                title="Resetar Zoom"
              >
                {Math.round(scale * 100)}%
              </button>
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-1 hover:text-[#5b5de5] text-[#8fa0b5] transition-colors"
                title="Aumentar Zoom"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
            </div>

            {/* Refresh / Reload Button */}
            {onReload && (
              <button
                type="button"
                onClick={onReload}
                className="flex items-center gap-1 neu-raised-sm hover:scale-105 active:scale-95 px-2.5 py-1 rounded-xl text-xs font-bold text-[#2b3674] hover:text-[#5b5de5] transition-all relative"
                title={
                  isLiveConnected
                    ? 'Recarregar alterações do disco (F5 / Ctrl+R)'
                    : 'Recarregar tela (F5 / Ctrl+R)'
                }
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#5b5de5]" />
                <span className="hidden md:inline text-[11px]">Atualizar</span>
                {isLiveConnected && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </button>
            )}

            {/* Auto Reload Toggle */}
            {onToggleAutoReload && isLiveConnected && (
              <button
                type="button"
                onClick={onToggleAutoReload}
                className={`hidden lg:flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-bold transition-all ${
                  isAutoReloadActive
                    ? 'neu-switch-on text-[#5b5de5] bg-[#e6edf7]'
                    : 'neu-raised-sm text-[#8fa0b5] hover:text-[#2b3674]'
                }`}
                title="Auto-recarregar ao salvar arquivos ou focar a janela"
              >
                <span className="text-[10px]">
                  {isAutoReloadActive ? '⚡ Auto-Sync ON' : 'Auto-Sync OFF'}
                </span>
              </button>
            )}

            {/* Screenshot */}
            <button
              type="button"
              onClick={() => onCaptureScreenshot(frameRef)}
              disabled={isCapturing}
              className="flex items-center gap-1 neu-raised-sm hover:scale-105 active:scale-95 px-2.5 py-1 rounded-xl text-xs font-bold text-[#2b3674] transition-all disabled:opacity-50"
              title="Capturar tela"
            >
              <Camera className={`w-3.5 h-3.5 text-[#5b5de5] ${isCapturing ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline text-[11px]">Capturar</span>
            </button>

            {/* Export */}
            {onOpenExportModal && (
              <button
                type="button"
                onClick={() => onOpenExportModal(frameRef)}
                disabled={isCapturing}
                className="flex items-center gap-1 neu-raised-sm hover:scale-105 active:scale-95 px-2.5 py-1 rounded-xl text-xs font-bold text-[#5b5de5] transition-all disabled:opacity-50"
                title="Exportar em PNG ou JPG"
              >
                <Download className="w-3.5 h-3.5 text-[#5b5de5]" />
                <span className="hidden md:inline text-[11px]">Exportar</span>
              </button>
            )}

            {/* Ocultar Barra (Hide Controls for 100% pure focus) */}
            <button
              type="button"
              onClick={() => setIsBarHidden(true)}
              className="flex items-center gap-1 neu-raised-sm hover:scale-105 active:scale-95 px-2.5 py-1 rounded-xl text-xs font-bold text-[#5b5de5] hover:text-[#4344be] transition-all"
              title="Ocultar esta barra para visualização 100% livre e limpa"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">Ocultar Barra</span>
            </button>

            {/* Sair do Super Foco */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 neu-raised hover:scale-105 active:scale-95 px-3 py-1.5 rounded-xl text-xs font-black text-[#e02424] hover:text-red-700 transition-all bg-[#fff2f2]"
              title="Sair do Super Foco (Esc)"
            >
              <Minimize2 className="w-3.5 h-3.5 text-red-600" />
              <span className="text-[11px]">Sair (Esc)</span>
            </button>
          </div>
        </header>
      ) : (
        /* MINIMAL FLOATING CAPSULE (When user chose to hide the bar) */
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 neu-raised px-3 py-1.5 rounded-full bg-[#f0f4fa]/90 backdrop-blur-md shadow-lg border border-[#d0dbe8] animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="text-xs font-extrabold text-[#5b5de5]">
            {currentDevice.name}
          </span>
          <span className="text-[10px] text-[#8fa0b5] font-mono">
            {Math.round(scale * 100)}%
          </span>

          {/* Quick switch between Mobile / Desktop */}
          <button
            type="button"
            onClick={() => onViewModeChange(isMobile ? 'desktop-only' : 'mobile-only')}
            className="neu-raised-sm px-2 py-0.5 rounded-full text-[10px] font-bold text-[#2b3674] hover:text-[#5b5de5] transition-colors"
            title="Alternar para o outro modo"
          >
            {isMobile ? 'Ver Desktop' : 'Ver Mobile'}
          </button>

          {/* Quick Reload in Capsule */}
          {onReload && (
            <button
              type="button"
              onClick={onReload}
              className="p-1 text-[#5b5de5] hover:text-[#4344be] transition-colors relative"
              title={
                isLiveConnected
                  ? 'Recarregar alterações do disco (F5 / Ctrl+R)'
                  : 'Recarregar tela (F5 / Ctrl+R)'
              }
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {isLiveConnected && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
          )}

          {/* Re-open full controls */}
          <button
            type="button"
            onClick={() => setIsBarHidden(false)}
            className="flex items-center gap-1 text-xs font-bold text-[#5b5de5] hover:text-[#4344be] px-2 py-0.5 rounded-full transition-colors"
            title="Mostrar barra de ferramentas completa"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="text-[10px]">Controles</span>
          </button>

          {/* Close Super Focus */}
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-red-500 hover:text-red-700 transition-colors"
            title="Sair do Super Foco (Esc)"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. CENTER MAXIMIZED DEVICE CANVAS (Strictly in flex-1 min-h-0 with clean padding, NEVER overlaps the header) */}
      <div
        className="flex-1 min-h-0 w-full overflow-auto flex flex-col items-center justify-start p-4 sm:p-8"
        onClick={() => setIsDeviceDropdownOpen(false)}
      >
        <div className="my-auto transition-transform duration-200 ease-out flex items-center justify-center">
          <DeviceFrame
            id="super-focus-device-frame"
            device={currentDevice}
            orientation={currentOrientation}
            onOrientationToggle={toggleOrientation}
            onDeviceChange={(dev) => {
              if (isMobile) {
                onSelectMobileDevice(dev);
              } else {
                onSelectDesktopDevice(dev);
              }
            }}
            availableDevices={deviceList}
            showBezel={showBezel}
            scale={scale}
            onScaleChange={setScale}
            sourceType={sourceType}
            contentHtml={contentHtml}
            url={url}
            frameRef={frameRef}
            hideToolbar={true}
            onReload={onReload}
            isLiveConnected={isLiveConnected}
          />
        </div>
      </div>
    </div>
  );
};
