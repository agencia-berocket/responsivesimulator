export type DeviceCategory = 'mobile' | 'tablet' | 'desktop' | 'custom';

export type Orientation = 'portrait' | 'landscape';

export interface DeviceSpec {
  id: string;
  name: string;
  category: DeviceCategory;
  width: number;
  height: number;
  pixelRatio: number;
  platform: 'ios' | 'android' | 'macos' | 'windows';
  bezelStyle?: 'notch' | 'dynamic-island' | 'hole-punch' | 'tablet' | 'laptop' | 'none';
  hasHomeBar?: boolean;
}

export type ViewMode = 'mobile-only' | 'desktop-only';

export type SourceType = 'local-project' | 'url' | 'template' | 'editor';

export interface ComparisonSettings {
  showDeviceBezel: boolean;
  syncScroll: boolean;
  scale: number; // 0.25 to 1.5, or auto
  autoScale: boolean;
  studioBackground: 'dark' | 'slate' | 'light' | 'grid' | 'transparent';
  exportFormat: 'png' | 'jpeg';
  jpegQuality: number; // 0.7 to 1.0
  includeMetadataHeader: boolean;
  projectTitle: string;
}

export interface CapturedSnapshot {
  id: string;
  title: string;
  timestamp: string;
  dataUrl: string;
  format: 'png' | 'jpeg';
  type: 'single-mobile' | 'single-desktop' | 'side-by-side' | 'slider-diff';
  devices: {
    mobile?: { name: string; width: number; height: number };
    desktop?: { name: string; width: number; height: number };
  };
  fileSizeEstimate?: string;
}

export interface TemplateSite {
  id: string;
  name: string;
  category: string;
  description: string;
  html: string;
}
