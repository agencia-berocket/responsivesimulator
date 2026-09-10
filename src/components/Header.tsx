import React from 'react';
import { ViewMode, SourceType } from '../types';
import {
  Smartphone,
  Monitor,
  Camera,
  FolderArchive,
  Globe,
  Sparkles,
  Download,
  Maximize2,
} from 'lucide-react';

interface HeaderProps {
  id?: string;
  sourceType: SourceType;
  onSourceTypeChange: (type: SourceType) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showBezel: boolean;
  onToggleBezel: () => void;
  onCaptureScreenshot: () => void;
  isCapturing: boolean;
  onOpenExportModal?: () => void;
  hasCompositeToExport?: boolean;
  projectName?: string;
  entryFileName?: string;
  totalFiles?: number;
  activeUrl?: string;
  onOpenSourcePanel?: () => void;
  onToggleSuperFocus?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  id,
  sourceType,
  onSourceTypeChange,
  viewMode,
  onViewModeChange,
  showBezel,
  onToggleBezel,
  onCaptureScreenshot,
  isCapturing,
  onOpenExportModal,
  projectName,
  entryFileName,
  totalFiles,
  activeUrl,
  onOpenSourcePanel,
  onToggleSuperFocus,
}) => {
  return (
    <header
      id={id}
      className="w-full pt-4 pb-2 px-6 flex flex-col gap-4 select-none"
    >
      {/* Top Row: Project Source Pill + Action Controls */}
      <div className="flex items-center justify-between gap-4">
        {/* Project Source Pill */}

        {/* Right side: Project Source Pill (matching the embossed @alicia.vikander user pill in ref) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSourcePanel}
            className="flex items-center gap-2.5 neu-raised-sm px-3.5 py-1.5 rounded-full hover:scale-105 active:scale-95 transition-all text-left"
            title="Alterar pasta .Index ou URL do projeto"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#5b5de5] to-[#7f81f8] text-white flex items-center justify-center text-[11px] font-bold shadow-xs">
              {sourceType === 'local-project' ? (
                <FolderArchive className="w-3.5 h-3.5" />
              ) : (
                <Globe className="w-3.5 h-3.5" />
              )}
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-extrabold text-[#2b3674] leading-tight">
                {sourceType === 'local-project' && projectName
                  ? `@${projectName.toLowerCase().replace(/\s+/g, '-')}`
                  : sourceType === 'url' && activeUrl
                  ? `@${activeUrl.replace(/^https?:\/\//, '').split('/')[0]}`
                  : '@projeto.local'}
              </span>
              <span className="text-[10px] text-[#8fa0b5] font-semibold">
                {sourceType === 'local-project'
                  ? `${totalFiles || 0} arquivos (.index)`
                  : 'URL Web Ativa'}
              </span>
            </div>

            <div className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse ml-1" />
          </button>

          {/* Super Focus Button */}
          {onToggleSuperFocus && (
            <button
              type="button"
              onClick={onToggleSuperFocus}
              className="flex items-center gap-1.5 neu-raised-sm hover:scale-105 active:scale-95 px-3.5 py-2 rounded-2xl text-xs font-black text-[#5b5de5] hover:text-[#4344be] transition-all bg-[#edf2fa]"
              title="Super Foco: Ampliar a tela e ocultar menus"
            >
              <Maximize2 className="w-4 h-4 text-[#5b5de5]" />
              <span className="hidden sm:inline">Super Foco</span>
            </button>
          )}

          {/* Quick Capture Button with soft 3D raised style */}
          <button
            type="button"
            onClick={onCaptureScreenshot}
            disabled={isCapturing}
            className="hidden sm:flex items-center gap-2 neu-raised-sm hover:scale-105 active:scale-95 px-4 py-2 rounded-2xl text-xs font-bold text-[#2b3674] transition-all disabled:opacity-50"
            title="Capturar tela do dispositivo ativo em alta resolução"
          >
            <Camera className={`w-4 h-4 text-[#5b5de5] ${isCapturing ? 'animate-spin' : ''}`} />
            <span>Capturar Tela</span>
          </button>

          {/* Export Button */}
          {onOpenExportModal && (
            <button
              type="button"
              onClick={onOpenExportModal}
              className="flex items-center gap-1.5 neu-raised-sm hover:scale-105 active:scale-95 px-3.5 py-2 rounded-2xl text-xs font-bold text-[#5b5de5] transition-all"
              title="Exportar em PNG ou JPG"
            >
              <Download className="w-4 h-4 text-[#5b5de5]" />
              <span className="hidden md:inline">Exportar</span>
            </button>
          )}
        </div>
      </div>

      {/* Second Row: Big Headline Metric + View Mode Segmented Pill Track (strictly Mobile vs Desktop) */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        {/* Left: Big Metric with percentage pill */}
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl font-black text-[#2b3674] tracking-tight font-mono">
            {viewMode === 'mobile-only' ? 'Mobile' : 'Desktop'}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 neu-raised-sm px-2.5 py-1 rounded-full">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            <span>Retina 2x</span>
          </span>
        </div>

        {/* Right: Segmented Pill Track with only Mobile and Desktop */}
        <div className="flex items-center neu-sunken p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => onViewModeChange('mobile-only')}
            className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              viewMode === 'mobile-only'
                ? 'neu-pill-active'
                : 'text-[#8fa0b5] hover:text-[#2b3674]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange('desktop-only')}
            className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              viewMode === 'desktop-only'
                ? 'neu-pill-active'
                : 'text-[#8fa0b5] hover:text-[#2b3674]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
        </div>
      </div>
    </header>
  );
};
