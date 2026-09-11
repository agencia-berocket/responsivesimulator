import React, { useState } from 'react';
import {
  Smartphone,
  Laptop,
} from 'lucide-react';
import { DeviceSpec, ViewMode } from '../types';
import { POPULAR_MOBILE_DEVICES, POPULAR_DESKTOP_DEVICES } from '../data/devices';
import { useLanguage } from '../i18n/LanguageContext';

interface RightDevicePanelProps {
  id?: string;
  activeMobileDevice: DeviceSpec;
  activeDesktopDevice: DeviceSpec;
  onSelectMobileDevice: (device: DeviceSpec) => void;
  onSelectDesktopDevice: (device: DeviceSpec) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showBezel: boolean;
  onToggleBezel: () => void;
}

export const RightDevicePanel: React.FC<RightDevicePanelProps> = ({
  id,
  activeMobileDevice,
  activeDesktopDevice,
  onSelectMobileDevice,
  onSelectDesktopDevice,
  viewMode,
  onViewModeChange,
  showBezel,
  onToggleBezel,
}) => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'mobile' | 'desktop'>('all');

  const allDevices = [
    {
      ...POPULAR_MOBILE_DEVICES[0], // iPhone 16 Pro
      brand: 'Apple',
      trend: 'Retina 3x',
      isDesktop: false,
    },
    {
      ...POPULAR_MOBILE_DEVICES[1], // iPhone SE
      brand: 'Compact',
      trend: '375 × 667',
      isDesktop: false,
    },
    {
      ...POPULAR_MOBILE_DEVICES[2], // Samsung Galaxy S24
      brand: 'Samsung',
      trend: 'AMOLED',
      isDesktop: false,
    },
    {
      ...POPULAR_MOBILE_DEVICES[3], // Google Pixel 9
      brand: 'Google',
      trend: 'Android 15',
      isDesktop: false,
    },
    {
      ...POPULAR_MOBILE_DEVICES[4], // iPad Pro
      brand: 'Tablet',
      trend: '1024 × 1366',
      isDesktop: false,
    },
    {
      ...POPULAR_DESKTOP_DEVICES[0], // MacBook Pro 16
      brand: 'MacBook',
      trend: 'Liquid Retina',
      isDesktop: true,
    },
    {
      ...POPULAR_DESKTOP_DEVICES[1], // Desktop Full HD
      brand: 'FHD 1080p',
      trend: '1920 × 1080',
      isDesktop: true,
    },
    {
      ...POPULAR_DESKTOP_DEVICES[2], // Laptop 1366
      brand: 'Notebook',
      trend: '1366 × 768',
      isDesktop: true,
    },
  ];

  const filteredDevices = allDevices.filter((dev) => {
    if (filter === 'mobile') return !dev.isDesktop;
    if (filter === 'desktop') return dev.isDesktop;
    return true;
  });

  return (
    <div
      id={id}
      className="hidden xl:flex flex-col w-[310px] neu-raised p-5 rounded-[32px] shrink-0 select-none my-4 mr-2"
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-extrabold text-[#2b3674] tracking-tight">
          {t('device.title')}
        </h2>
      </div>

      {/* Filter Tabs in Sunken Track */}
      <div className="flex items-center neu-sunken p-1 mb-4 text-[11px]">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`flex-1 py-1 text-center rounded-full transition-all font-bold ${
            filter === 'all' ? 'neu-pill-active' : 'text-[#8fa0b5] hover:text-[#2b3674]'
          }`}
        >
          {t('device.all')}
        </button>
        <button
          type="button"
          onClick={() => setFilter('mobile')}
          className={`flex-1 py-1 text-center rounded-full transition-all font-bold ${
            filter === 'mobile' ? 'neu-pill-active' : 'text-[#8fa0b5] hover:text-[#2b3674]'
          }`}
        >
          {t('device.mobile')}
        </button>
        <button
          type="button"
          onClick={() => setFilter('desktop')}
          className={`flex-1 py-1 text-center rounded-full transition-all font-bold ${
            filter === 'desktop' ? 'neu-pill-active' : 'text-[#8fa0b5] hover:text-[#2b3674]'
          }`}
        >
          {t('device.desktop')}
        </button>
      </div>

      {/* Device List items styled exactly like the Watchlist items in reference */}
      <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
        {filteredDevices.map((device) => {
          const isSelected = device.isDesktop
            ? activeDesktopDevice.id === device.id
            : activeMobileDevice.id === device.id;
          const isActive = isSelected && (device.isDesktop ? viewMode === 'desktop-only' : viewMode === 'mobile-only');

          const handleActivate = () => {
            if (device.isDesktop) {
              onSelectDesktopDevice(device);
              onViewModeChange('desktop-only');
            } else {
              onSelectMobileDevice(device);
              onViewModeChange('mobile-only');
            }
          };

          return (
            <div
              key={device.id}
              onClick={handleActivate}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleActivate();
                }
              }}
              className={`flex items-center justify-between p-2.5 rounded-2xl transition-all cursor-pointer select-none group ${
                isActive
                  ? 'neu-sunken border border-[#5b5de5]/40 ring-1 ring-[#5b5de5]/30 bg-[#e0e9f6]'
                  : 'neu-raised-sm hover:scale-[1.02] active:scale-[0.98] hover:bg-[#ebf2fb]'
              }`}
              title={t('device.simulateTip', { name: device.name, w: device.width, h: device.height })}
            >
              {/* Left: Device brand icon + Name & Resolution */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-[10px] transition-colors ${
                    isActive
                      ? 'bg-[#5b5de5] text-white shadow-xs'
                      : 'neu-sunken text-[#5b5de5] group-hover:text-[#4344be]'
                  }`}
                >
                  {device.isDesktop ? (
                    <Laptop className="w-4 h-4" />
                  ) : (
                    <Smartphone className="w-4 h-4" />
                  )}
                </div>

                <div className="flex flex-col min-w-0">
                  <span
                    className={`text-xs font-extrabold truncate transition-colors ${
                      isActive ? 'text-[#5b5de5]' : 'text-[#2b3674] group-hover:text-[#5b5de5]'
                    }`}
                  >
                    {device.name}
                  </span>
                  <span className="text-[10px] text-[#8fa0b5] font-mono font-medium">
                    {device.width} × {device.height}
                  </span>
                </div>
              </div>

              {/* Right: Trend badge + Tactile Neumorphic Switch ON / OFF */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-bold text-[#5b5de5] hidden 2xl:inline">
                  {device.trend}
                </span>

                <div
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                    isActive
                      ? 'neu-switch-on text-[#5b5de5] bg-[#e6edf7] font-black'
                      : 'neu-raised-sm text-[#8fa0b5] group-hover:text-[#2b3674]'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full transition-colors ${
                      isActive ? 'bg-[#5b5de5] shadow-[0_0_6px_rgba(91,93,229,0.8)]' : 'bg-[#a3b1c2]'
                    }`}
                  />
                  <span>{isActive ? t('device.active') : t('device.view')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Quick Controls in Neumorphic Card */}
      <div className="mt-4 pt-3 border-t border-white/60 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={onToggleBezel}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[11px] transition-all ${
            showBezel ? 'neu-switch-on text-[#5b5de5]' : 'neu-raised-sm text-[#8fa0b5]'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${showBezel ? 'bg-[#5b5de5]' : 'bg-[#a3b1c2]'}`} />
          <span>{t('device.frames')}</span>
        </button>

        <span className="text-[11px] text-[#8fa0b5] font-semibold">
          {t('device.retina')}
        </span>
      </div>
    </div>
  );
};
