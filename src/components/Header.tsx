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
  Languages,
} from 'lucide-react';
import { useLanguage, detectBrowserLanguage } from '../i18n/LanguageContext';
import { Lang } from '../i18n/translations';

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
  const { t, lang, setLang, isAuto, setAutoLanguage } = useLanguage();

  return (
    <header
      id={id}
      className="w-full pt-4 pb-2 px-6 flex flex-col gap-4 select-none"
    >
      {/* Top Row: Project Source Pill + Action Controls */}
      <div className="flex items-center justify-between gap-4">
        {/* Right side: Project Source Pill (matching the embossed user pill in ref) */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={onOpenSourcePanel}
            className="flex items-center gap-2.5 neu-raised-sm px-3.5 py-1.5 rounded-full hover:scale-105 active:scale-95 transition-all text-left"
            title={t('header.sourcePanelTitle')}
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
                  ? t('header.filesCount', { n: totalFiles || 0 })
                  : t('header.urlActive')}
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
              title={t('header.superFocusTitle')}
            >
              <Maximize2 className="w-4 h-4 text-[#5b5de5]" />
              <span className="hidden sm:inline">{t('header.superFocus')}</span>
            </button>
          )}

          {/* Quick Capture Button */}
          <button
            type="button"
            onClick={onCaptureScreenshot}
            disabled={isCapturing}
            className="hidden sm:flex items-center gap-2 neu-raised-sm hover:scale-105 active:scale-95 px-4 py-2 rounded-2xl text-xs font-bold text-[#2b3674] transition-all disabled:opacity-50"
            title={t('header.captureTitle')}
          >
            <Camera className={`w-4 h-4 text-[#5b5de5] ${isCapturing ? 'animate-spin' : ''}`} />
            <span>{t('header.capture')}</span>
          </button>

          {/* Export Button */}
          {onOpenExportModal && (
            <button
              type="button"
              onClick={onOpenExportModal}
              className="flex items-center gap-1.5 neu-raised-sm hover:scale-105 active:scale-95 px-3.5 py-2 rounded-2xl text-xs font-bold text-[#5b5de5] transition-all"
              title={t('header.exportTitle')}
            >
              <Download className="w-4 h-4 text-[#5b5de5]" />
              <span className="hidden md:inline">{t('header.export')}</span>
            </button>
          )}

          {/* Language Selector Dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-1.5 neu-raised-sm px-3 py-2 rounded-2xl text-xs font-extrabold text-[#2b3674] hover:text-[#5b5de5] transition-all"
              title={isAuto ? `Idioma do Navegador (${lang.toUpperCase()})` : `Idioma: ${lang.toUpperCase()}`}
            >
              <Languages className="w-4 h-4 text-[#5b5de5]" />
              <span className="uppercase font-mono text-[11px] font-bold">{lang}</span>
              {isAuto && (
                <span className="text-[9px] bg-[#5b5de5]/15 text-[#5b5de5] px-1 py-0.5 rounded font-sans font-bold">
                  AUTO
                </span>
              )}
            </button>

            <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col bg-[#e6edf7] neu-raised p-2 rounded-2xl shadow-xl z-50 min-w-[150px] text-xs font-bold border border-white/60">
              <button
                type="button"
                onClick={setAutoLanguage}
                className={`px-3 py-2 text-left rounded-xl transition-all flex items-center justify-between ${
                  isAuto ? 'neu-pill-active text-[#5b5de5]' : 'hover:bg-[#f0f4fa] text-[#2b3674]'
                }`}
              >
                <span>Navegador (Auto)</span>
                <span className="text-[10px] font-mono text-[#8fa0b5]">
                  {detectBrowserLanguage().toUpperCase()}
                </span>
              </button>
              <div className="my-1 border-t border-slate-300/40" />
              {(['pt', 'en', 'es', 'fr'] as Lang[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`px-3 py-1.5 text-left rounded-xl transition-all flex items-center justify-between ${
                    !isAuto && lang === l ? 'neu-pill-active text-[#5b5de5]' : 'hover:bg-[#f0f4fa] text-[#2b3674]'
                  }`}
                >
                  <span>
                    {l === 'pt'
                      ? 'Português'
                      : l === 'en'
                      ? 'English'
                      : l === 'es'
                      ? 'Español'
                      : 'Français'}
                  </span>
                  <span className="text-[10px] font-mono text-[#8fa0b5]">{l.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Second Row: Big Headline Metric + View Mode Segmented Pill Track */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        {/* Left: Big Metric with percentage pill */}
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl font-black text-[#2b3674] tracking-tight font-mono">
            {viewMode === 'mobile-only' ? t('view.mobile') : t('view.desktop')}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 neu-raised-sm px-2.5 py-1 rounded-full">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            <span>{t('header.retina')}</span>
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
            <span>{t('view.mobile')}</span>
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
            <span>{t('view.desktop')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
