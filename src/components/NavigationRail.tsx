import React from 'react';
import {
  Monitor,
  FolderArchive,
  Code,
  SlidersHorizontal,
  Camera,
  Globe,
  RotateCcw,
  Maximize2,
} from 'lucide-react';
import { SourceType } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

export type ActiveNavTab = 'simulator' | 'source' | 'editor' | 'breakpoints';

interface NavigationRailProps {
  id?: string;
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  sourceType: SourceType;
  onCaptureScreenshot: () => void;
  isCapturing: boolean;
  hasLocalProject: boolean;
  activeUrl: string;
  onResetZoom?: () => void;
  onToggleSuperFocus?: () => void;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({
  id,
  activeTab,
  onSelectTab,
  sourceType,
  onCaptureScreenshot,
  isCapturing,
  hasLocalProject,
  activeUrl,
  onResetZoom,
  onToggleSuperFocus,
}) => {
  const { t } = useLanguage();

  const navItems = [
    {
      id: 'simulator' as ActiveNavTab,
      label: t('nav.simulator'),
      icon: Monitor,
    },
    {
      id: 'source' as ActiveNavTab,
      label: t('nav.source'),
      icon: hasLocalProject ? FolderArchive : Globe,
      pulse: hasLocalProject || !!activeUrl,
    },
    {
      id: 'editor' as ActiveNavTab,
      label: t('nav.editor'),
      icon: Code,
    },
    {
      id: 'breakpoints' as ActiveNavTab,
      label: t('nav.breakpoints'),
      icon: SlidersHorizontal,
    },
  ];

  return (
    <>
      {/* 1. Desktop Lateral Navigation Rail (visible only on md screens and larger) */}
      <aside
        id={id}
        className="hidden md:flex flex-col items-center justify-between w-[72px] py-7 shrink-0 select-none"
      >
        {/* Top: Mac Desktop Logo Button */}
        <div className="flex flex-col items-center gap-6">
          <button
            type="button"
            onClick={() => onSelectTab('simulator')}
            className="relative w-11 h-11 rounded-[18px] bg-gradient-to-br from-[#181954] via-[#2a2b7e] to-[#4344be] flex items-center justify-center transition-all duration-200 active:scale-95 shadow-[5px_5px_12px_rgba(166,180,202,0.5),-3px_-3px_8px_rgba(255,255,255,0.9)] hover:shadow-[6px_6px_14px_rgba(42,43,126,0.35),-4px_-4px_10px_rgba(255,255,255,1)] group"
            title={t('nav.logoTitle')}
          >
            {/* Mac Desktop Icon */}
            <svg
              className="w-5.5 h-5.5 text-white group-hover:scale-110 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#f0f4fa]" />
          </button>
        </div>

        {/* Middle: Vertical Stack of Neumorphic Embossed Buttons */}
        <nav className="flex flex-col items-center gap-3 w-full px-2 my-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                title={item.label}
                className={`relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 group ${
                  isActive ? 'neu-nav-active' : 'neu-nav-inactive'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${
                    isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'
                  }`}
                />

                {/* Status pulse dot for active source */}
                {item.pulse && !isActive && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#f0f4fa]" />
                )}

                {/* Soft tooltip on hover */}
                <div className="absolute left-16 px-3 py-1.5 neu-raised text-[#2b3674] text-xs font-bold rounded-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 z-50 shadow-md">
                  {item.label}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom: Super Foco, Quick Capture & Reset Zoom */}
        <div className="flex flex-col items-center gap-3">
          {/* Super Focus Button */}
          {onToggleSuperFocus && (
            <button
              type="button"
              onClick={onToggleSuperFocus}
              title={t('nav.superFocus')}
              className="relative w-10 h-10 rounded-2xl flex items-center justify-center text-[#5b5de5] hover:text-[#4344be] neu-raised-sm active:scale-95 group transition-all bg-[#edf2fa]"
            >
              <Maximize2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <div className="absolute left-16 px-3 py-1.5 neu-raised text-[#5b5de5] text-xs font-bold rounded-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 z-50 shadow-md">
                {t('nav.superFocus')}
              </div>
            </button>
          )}

          {/* Quick Screenshot button */}
          <button
            type="button"
            onClick={onCaptureScreenshot}
            disabled={isCapturing}
            title={t('nav.capture')}
            className="relative w-10 h-10 rounded-2xl flex items-center justify-center text-[#8fa0b5] hover:text-[#2b3674] neu-raised-sm active:scale-95 group transition-all"
          >
            <Camera
              className={`w-4 h-4 ${isCapturing ? 'animate-spin text-indigo-600' : 'group-hover:scale-105'} transition-transform`}
            />
          </button>

          {/* Reset scale button */}
          {onResetZoom && (
            <button
              type="button"
              onClick={onResetZoom}
              title={t('nav.resetZoom')}
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#8fa0b5] hover:text-[#2b3674] neu-raised-sm active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* 2. Mobile Bottom Navigation Bar (visible only on mobile viewports < md) */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#e5edf7]/95 backdrop-blur-lg border-t border-white/80 py-2 px-3 shadow-2xl items-center justify-around select-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 rounded-2xl transition-all ${
                isActive ? 'neu-pill-active text-[#5b5de5] scale-105 font-bold' : 'text-[#8fa0b5] active:scale-95'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
              <span className="text-[10px] font-bold mt-1 text-center truncate max-w-[75px]">
                {item.label.split('/')[0]}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
