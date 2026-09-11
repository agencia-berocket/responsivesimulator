/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  DeviceSpec,
  Orientation,
  ViewMode,
  SourceType,
} from './types';
import {
  POPULAR_MOBILE_DEVICES,
  POPULAR_DESKTOP_DEVICES,
  BREAKPOINT_PRESETS,
} from './data/devices';
import { BUILTIN_TEMPLATES } from './data/templates';
import { Header } from './components/Header';
import { NavigationRail, ActiveNavTab } from './components/NavigationRail';
import { DeviceFrame } from './components/DeviceFrame';
import { CodeEditor } from './components/CodeEditor';
import { ExportModal } from './components/ExportModal';
import { ProjectSourceInput } from './components/ProjectSourceInput';
import { RightDevicePanel } from './components/RightDevicePanel';
import { SuperFocusView } from './components/SuperFocusView';
import { parseLocalFiles, ParsedProject, ProjectFile } from './utils/localFolderParser';
import {
  captureSimulatorViewport,
  captureSimulatorFullScroll,
  downloadCanvas,
} from './utils/screenshot';
import {
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from './i18n/LanguageContext';

export default function App() {
  const { t } = useLanguage();

  // Device selections
  const [mobileDevice, setMobileDevice] = useState<DeviceSpec>(POPULAR_MOBILE_DEVICES[0]);
  const [desktopDevice, setDesktopDevice] = useState<DeviceSpec>(POPULAR_DESKTOP_DEVICES[0]);
  const [mobileOrientation, setMobileOrientation] = useState<Orientation>('portrait');
  const [desktopOrientation, setDesktopOrientation] = useState<Orientation>('landscape');

  // Scaling
  const [mobileScale, setMobileScale] = useState<number>(0.85);
  const [desktopScale, setDesktopScale] = useState<number>(0.55);

  // Settings
  const [showBezel, setShowBezel] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<ViewMode>('mobile-only');
  const [sourceType, setSourceType] = useState<SourceType>('local-project');
  const [activeNavTab, setActiveNavTab] = useState<ActiveNavTab>('simulator');
  const [projectTitle, setProjectTitle] = useState<string>('Meu Site Responsivo');
  const [isSuperFocus, setIsSuperFocus] = useState<boolean>(false);

  // Local Project (.Index / Folder) state
  const [localProject, setLocalProject] = useState<ParsedProject | null>(null);
  const [isLoadingLocal, setIsLoadingLocal] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Content state
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('ecommerce');
  const [editorCode, setEditorCode] = useState<string>(BUILTIN_TEMPLATES[0].html);
  const [urlInput, setUrlInput] = useState<string>('');
  const [activeUrl, setActiveUrl] = useState<string>('https://example.com');

  // Screenshot capture & export modal state
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [compositeCanvas, setCompositeCanvas] = useState<HTMLCanvasElement | null>(null);
  const [mobileCanvas, setMobileCanvas] = useState<HTMLCanvasElement | null>(null);
  const [desktopCanvas, setDesktopCanvas] = useState<HTMLCanvasElement | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Refs for element capture
  const mobileFrameRef = useRef<HTMLDivElement | null>(null);
  const desktopFrameRef = useRef<HTMLDivElement | null>(null);

  // Show temporary toast notification
  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Switch template
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tmpl = BUILTIN_TEMPLATES.find((t) => t.id === templateId);
    if (tmpl) {
      setEditorCode(tmpl.html);
      notify(t('app.templateLoaded', { name: tmpl.name }));
    }
  };

  const handleUrlSubmit = () => {
    let formatted = urlInput.trim();
    if (!formatted) {
      formatted = activeUrl || 'https://example.com';
    }
    if (!/^https?:\/\//i.test(formatted)) {
      formatted = 'https://' + formatted;
    }
    setActiveUrl(formatted);
    notify(t('app.urlLoading', { url: formatted }));
  };

  // Carregar arquivos de pasta local ou arquivo .index avulso
  const handleLoadLocalFiles = async (files: FileList | File[]) => {
    setIsLoadingLocal(true);
    setLocalError(null);
    try {
      const project = await parseLocalFiles(files);
      setLocalProject(project);
      setSourceType('local-project');
      if (project.folderName && project.folderName !== 'Pasta Local') {
        setProjectTitle(project.folderName);
      }
      notify(
        t('app.folderLoaded', { name: project.folderName, n: project.totalFiles })
      );
    } catch (err) {
      console.error('Erro ao processar pasta local:', err);
      const msg = err instanceof Error ? err.message : 'Falha ao processar arquivos da pasta.';
      setLocalError(msg);
      notify(t('app.folderError', { msg }));
    } finally {
      setIsLoadingLocal(false);
    }
  };

  // Alternar o arquivo principal de entrada caso a pasta tenha múltiplos arquivos HTML
  const handleSelectEntryFile = async (file: ProjectFile) => {
    if (!localProject) return;
    try {
      const htmlText = await file.file.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');

      const htmlBaseDir = file.relativePath.includes('/')
        ? file.relativePath.substring(0, file.relativePath.lastIndexOf('/'))
        : '';

      const pathToBlobUrlMap = new Map<string, string>();
      localProject.files.forEach((f) => {
        if (f.blobUrl) {
          pathToBlobUrlMap.set(f.relativePath, f.blobUrl);
          pathToBlobUrlMap.set('/' + f.relativePath, f.blobUrl);
          pathToBlobUrlMap.set('./' + f.relativePath, f.blobUrl);
          pathToBlobUrlMap.set(f.name, f.blobUrl);
        }
      });

      const resolveAttr = (attrVal: string | null) => {
        if (!attrVal) return null;
        const trimmed = attrVal.trim();
        if (
          trimmed.startsWith('http://') ||
          trimmed.startsWith('https://') ||
          trimmed.startsWith('data:') ||
          trimmed.startsWith('blob:') ||
          trimmed.startsWith('//') ||
          trimmed.startsWith('#')
        )
          return null;

        const target = htmlBaseDir
          ? `${htmlBaseDir}/${trimmed}`.replace(/\/+/g, '/')
          : trimmed;
        return (
          pathToBlobUrlMap.get(target) ||
          pathToBlobUrlMap.get(trimmed) ||
          pathToBlobUrlMap.get(trimmed.split('/').pop() || '') ||
          null
        );
      };

      doc.querySelectorAll('link[href]').forEach((el) => {
        const res = resolveAttr(el.getAttribute('href'));
        if (res) el.setAttribute('href', res);
      });
      doc.querySelectorAll('script[src]').forEach((el) => {
        const res = resolveAttr(el.getAttribute('src'));
        if (res) el.setAttribute('src', res);
      });
      doc.querySelectorAll('img[src]').forEach((el) => {
        const res = resolveAttr(el.getAttribute('src'));
        if (res) el.setAttribute('src', res);
      });
      doc.querySelectorAll('a[href]').forEach((el) => {
        const orig = el.getAttribute('href');
        if (orig) {
          const res = resolveAttr(orig);
          if (res) el.setAttribute('href', res);
        }
      });

      if (!doc.querySelector('meta[name="viewport"]')) {
        const meta = doc.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0';
        doc.head?.appendChild(meta);
      }

      // Injetar script de proteção para navegação local segura
      const guard = doc.createElement('script');
      guard.id = '__responsive_preview_guard__';
      guard.textContent = `
        (function() {
          try {
            window.location.reload = function() {
              console.log('[Preview] Reload interceptado.');
            };
          } catch(e) {}
          document.addEventListener('click', function(e) {
            var a = e.target && e.target.closest ? e.target.closest('a') : null;
            if (!a) return;
            var href = a.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
            if (href.startsWith('http://') || href.startsWith('https://')) {
              e.preventDefault();
              window.open(href, '_blank', 'noopener,noreferrer');
              return;
            }
            if (!href.startsWith('blob:')) {
              e.preventDefault();
              e.stopPropagation();
              try {
                window.parent.postMessage({ type: 'LOCAL_NAVIGATE', href: href }, '*');
              } catch(err) {}
            }
          }, true);
          document.addEventListener('submit', function(e) { e.preventDefault(); }, true);
        })();
      `;
      doc.head?.appendChild(guard);

      const finalHtml = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
      setLocalProject({
        ...localProject,
        entryFileName: file.name,
        entryHtmlFile: file,
        resolvedHtml: finalHtml,
      });
      notify(t('app.entryChanged', { name: file.name }));
    } catch (e) {
      console.error(e);
      notify(t('app.entryError', { err: String(e) }));
    }
  };

  // Tratar mensagens de navegação interna do iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'LOCAL_NAVIGATE' && localProject) {
        const rawHref = String(e.data.href || '');
        const cleanPath = rawHref.replace(/^(\.\/|\/)/, '').split('?')[0].split('#')[0];
        const match = localProject.files.find(
          (f) =>
            f.relativePath.toLowerCase() === cleanPath.toLowerCase() ||
            f.name.toLowerCase() === cleanPath.toLowerCase()
        );
        if (match && (match.extension === 'html' || match.extension === 'htm')) {
          handleSelectEntryFile(match);
        } else {
          notify(t('app.linkProtected', { href: rawHref }));
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [localProject]);

  // 1. Capturar Tela (Viewport Screen Capture PNG of exactly what appears on simulator)
  const handleCaptureScreenshot = async (overrideRef?: React.RefObject<HTMLDivElement | null>) => {
    const defaultRef = viewMode === 'mobile-only' ? mobileFrameRef : desktopFrameRef;
    const targetRef = overrideRef && overrideRef.current ? overrideRef : defaultRef;
    const device = viewMode === 'mobile-only' ? mobileDevice : desktopDevice;

    if (!targetRef.current) {
      notify(t('app.captureNotFound'));
      return;
    }
    setIsCapturing(true);

    if (sourceType === 'url') {
      notify('📸 Compartilhe sua aba quando solicitado pelo navegador…');
    } else {
      notify(t('app.capturing'));
    }

    try {
      const captured = await captureSimulatorViewport(targetRef.current, device, {
        scale: 2,
        showBezel,
        projectTitle,
        contentHtml: activeHtml,
        url: activeUrl,
      });
      if (captured) {
        setCompositeCanvas(captured);
        if (viewMode === 'mobile-only') {
          setMobileCanvas(captured);
        } else {
          setDesktopCanvas(captured);
        }
        const filename = `captura-tela-${device.name.toLowerCase().replace(/\s+/g, '-')}`;
        downloadCanvas(captured, filename, 'png');
        notify(t('app.captureSuccess', { name: device.name }));
      }
    } catch (error: any) {
      if (error?.code === 'USER_CANCELLED' || error?.message === 'USER_CANCELLED') {
        notify('Captura cancelada.');
      } else {
        console.error('Erro ao capturar tela:', error);
        notify(t('app.captureError'));
      }
    } finally {
      setIsCapturing(false);
    }
  };

  // 2. Exportar (Full Scroll PNG Export)
  const handleExportFullScroll = async (overrideRef?: React.RefObject<HTMLDivElement | null>) => {
    const defaultRef = viewMode === 'mobile-only' ? mobileFrameRef : desktopFrameRef;
    const targetRef = overrideRef && overrideRef.current ? overrideRef : defaultRef;
    const device = viewMode === 'mobile-only' ? mobileDevice : desktopDevice;

    if (!targetRef.current) {
      notify(t('app.exportNotFound'));
      return;
    }
    setIsCapturing(true);

    if (sourceType === 'url') {
      notify('📸 Compartilhe sua aba quando solicitado pelo navegador…');
    } else {
      notify(t('app.exporting'));
    }

    try {
      const { fullCanvas, contentCanvas } = await captureSimulatorFullScroll(
        targetRef.current,
        device,
        {
          scale: 2,
          showBezel,
          projectTitle,
          contentHtml: activeHtml,
          url: activeUrl,
        }
      );

      setCompositeCanvas(fullCanvas);
      if (viewMode === 'mobile-only') {
        setMobileCanvas(contentCanvas);
      } else {
        setDesktopCanvas(contentCanvas);
      }

      const filename = `exportacao-${device.name.toLowerCase().replace(/\s+/g, '-')}`;
      downloadCanvas(fullCanvas, filename, 'png');

      setIsExportModalOpen(true);
      notify(t('app.exportSuccess', { name: device.name }));
    } catch (error: any) {
      if (error?.code === 'USER_CANCELLED' || error?.message === 'USER_CANCELLED') {
        notify('Captura cancelada.');
      } else {
        console.error('Erro ao exportar full scroll:', error);
        notify(t('app.exportError'));
      }
    } finally {
      setIsCapturing(false);
    }
  };

  const activeHtml =
    sourceType === 'local-project'
      ? localProject?.resolvedHtml || editorCode
      : sourceType === 'template' || sourceType === 'editor'
      ? editorCode
      : ''; // URL mode: getDisplayMedia is used inside screenshot.ts

  return (
    <div className="min-h-screen bg-[#e5edf7] text-[#2b3674] flex items-center justify-center p-2 sm:p-4 lg:p-6 selection:bg-[#5b5de5] selection:text-white">
      {/* Toast Notification with Neumorphic styling */}
      {notification && (
        <div className="fixed top-8 right-8 z-50 neu-raised text-[#2b3674] text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="w-5 h-5 rounded-full bg-[#e6edf7] text-[#5b5de5] flex items-center justify-center shrink-0 shadow-xs neu-sunken">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <span>{notification}</span>
        </div>
      )}

      {/* Master Sculpted Dashboard Panel strictly matching the user's reference image */}
      <div className="neu-dashboard-panel w-full max-w-[1740px] min-h-[92vh] flex flex-col md:flex-row p-3 sm:p-4 gap-3 lg:gap-4 overflow-hidden">
        {/* 1. Left Lateral Navigation Rail with glossy indigo drop logo and soft 3D buttons */}
        <NavigationRail
          id="app-nav-rail"
          activeTab={activeNavTab}
          onSelectTab={(tab) => {
            setActiveNavTab(tab);
            if (tab === 'simulator') {
              // keep current active device view
            } else if (tab === 'source') {
              setSourceType((prev) => (prev === 'local-project' || prev === 'url' ? prev : 'local-project'));
            } else if (tab === 'editor') {
              setSourceType('editor');
            }
          }}
          sourceType={sourceType}
          onCaptureScreenshot={handleCaptureScreenshot}
          isCapturing={isCapturing}
          hasLocalProject={!!localProject}
          activeUrl={activeUrl}
          onResetZoom={() => {
            setMobileScale(0.85);
            setDesktopScale(0.55);
            notify(t('app.zoomReset'));
          }}
          onToggleSuperFocus={() => setIsSuperFocus(true)}
        />

        {/* 2. Center Workspace (Header + Main content + Responsive Frames) */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            id="app-header"
            sourceType={sourceType}
            onSourceTypeChange={(type) => {
              setSourceType(type);
              if (type === 'editor') {
                setActiveNavTab('editor');
              } else if (type === 'local-project' || type === 'url') {
                setActiveNavTab('source');
              }
            }}
            viewMode={viewMode}
            onViewModeChange={(mode) => {
              setViewMode(mode);
              setActiveNavTab('simulator');
            }}
            showBezel={showBezel}
            onToggleBezel={() => setShowBezel((prev) => !prev)}
            onCaptureScreenshot={handleCaptureScreenshot}
            isCapturing={isCapturing}
            onOpenExportModal={handleExportFullScroll}
            projectName={localProject?.folderName}
            entryFileName={localProject?.entryFileName}
            totalFiles={localProject?.totalFiles}
            activeUrl={activeUrl}
            onOpenSourcePanel={() => {
              setActiveNavTab('source');
              setSourceType(localProject ? 'local-project' : 'url');
            }}
            onToggleSuperFocus={() => setIsSuperFocus(true)}
          />

          <main className="flex-1 min-w-0 px-2 sm:px-4 py-2 flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-140px)] pr-2">
            {/* Quick Breakpoint Bar in Neumorphic Raised Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 neu-raised-sm rounded-2xl px-5 py-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-[#8fa0b5] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#5b5de5]" />
                  {t('bp.label')}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {BREAKPOINT_PRESETS.map((bp) => (
                    <button
                      key={bp.label}
                      type="button"
                      onClick={() => {
                        if (bp.width <= 480) {
                          setMobileDevice({
                            id: `custom-${bp.width}`,
                            name: bp.label,
                            category: 'mobile',
                            width: bp.width,
                            height: bp.height,
                            pixelRatio: 2,
                            platform: 'ios',
                            bezelStyle: 'none',
                          });
                          setViewMode('mobile-only');
                          notify(t('app.bpMobile', { w: bp.width, label: bp.label }));
                        } else {
                          setDesktopDevice({
                            id: `custom-${bp.width}`,
                            name: bp.label,
                            category: bp.width <= 1024 ? 'tablet' : 'desktop',
                            width: bp.width,
                            height: bp.height,
                            pixelRatio: 1,
                            platform: 'windows',
                            bezelStyle: 'none',
                          });
                          setViewMode('desktop-only');
                          notify(t('app.bpDesktop', { w: bp.width, label: bp.label }));
                        }
                      }}
                      className="px-3 py-1 text-[#2b3674] hover:text-[#5b5de5] rounded-full text-[11px] font-mono font-bold neu-raised-sm hover:scale-105 active:scale-95 transition-all"
                    >
                      {bp.width}px
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 text-[#8fa0b5] text-[11px] font-semibold">
                <span className="hidden sm:inline">
                  {t('bp.scale')}{' '}
                  <strong className="text-[#5b5de5] font-mono">
                    {Math.round((viewMode === 'mobile-only' ? mobileScale : desktopScale) * 100)}%
                  </strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMobileScale(0.85);
                    setDesktopScale(0.55);
                    notify(t('app.zoomReset'));
                  }}
                  className="text-[#5b5de5] hover:text-[#2b3674] font-bold transition-colors underline"
                >
                  {t('bp.resetZoom')}
                </button>
              </div>
            </div>

            {/* Mode: Local Project / Real Web URL Input Field */}
            {(sourceType === 'local-project' || sourceType === 'url') && (
              <ProjectSourceInput
                id="project-source-input-panel"
                sourceType={sourceType}
                onSourceTypeChange={setSourceType}
                localProject={localProject}
                onLoadLocalFiles={handleLoadLocalFiles}
                onSelectEntryFile={handleSelectEntryFile}
                isLoadingLocal={isLoadingLocal}
                localError={localError}
                urlInput={urlInput}
                activeUrl={activeUrl}
                onUrlChange={setUrlInput}
                onUrlSubmit={handleUrlSubmit}
              />
            )}

            {/* Mode: Code Editor (if selected) */}
            {sourceType === 'editor' && (
              <CodeEditor
                id="code-editor-panel"
                code={editorCode}
                onChange={setEditorCode}
                onSelectTemplate={handleSelectTemplate}
                selectedTemplateId={selectedTemplateId}
              />
            )}

            {/* Responsive Device Stage: Centered Active Device (Mobile or Desktop) */}
            <div className="w-full flex items-start justify-center py-4 min-h-[500px]">
              {viewMode === 'mobile-only' ? (
                <div className="flex flex-col items-center">
                  <DeviceFrame
                    id="mobile-device-frame"
                    device={mobileDevice}
                    orientation={mobileOrientation}
                    onOrientationToggle={() =>
                      setMobileOrientation((prev) => (prev === 'portrait' ? 'landscape' : 'portrait'))
                    }
                    onDeviceChange={setMobileDevice}
                    availableDevices={POPULAR_MOBILE_DEVICES}
                    showBezel={showBezel}
                    scale={mobileScale}
                    onScaleChange={setMobileScale}
                    sourceType={sourceType === 'url' ? 'url' : sourceType === 'local-project' ? 'local-project' : 'template'}
                    contentHtml={activeHtml}
                    url={activeUrl}
                    frameRef={mobileFrameRef}
                    label={t('view.mobile')}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <DeviceFrame
                    id="desktop-device-frame"
                    device={desktopDevice}
                    orientation={desktopOrientation}
                    onOrientationToggle={() =>
                      setDesktopOrientation((prev) => (prev === 'portrait' ? 'landscape' : 'portrait'))
                    }
                    onDeviceChange={setDesktopDevice}
                    availableDevices={POPULAR_DESKTOP_DEVICES}
                    showBezel={showBezel}
                    scale={desktopScale}
                    onScaleChange={setDesktopScale}
                    sourceType={sourceType === 'url' ? 'url' : sourceType === 'local-project' ? 'local-project' : 'template'}
                    contentHtml={activeHtml}
                    url={activeUrl}
                    frameRef={desktopFrameRef}
                    label={t('view.desktop')}
                  />
                </div>
              )}
            </div>
          </main>
        </div>

        {/* 3. Right Devices Watchlist Panel matching the reference image */}
        <RightDevicePanel
          id="right-device-panel"
          activeMobileDevice={mobileDevice}
          activeDesktopDevice={desktopDevice}
          onSelectMobileDevice={(dev) => {
            setMobileDevice(dev);
            setViewMode('mobile-only');
            notify(t('app.deviceMobile', { name: dev.name }));
          }}
          onSelectDesktopDevice={(dev) => {
            setDesktopDevice(dev);
            setViewMode('desktop-only');
            notify(t('app.deviceDesktop', { name: dev.name }));
          }}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showBezel={showBezel}
          onToggleBezel={() => setShowBezel((prev) => !prev)}
        />
      </div>

      {/* Super Focus Maximized Stage */}
      <SuperFocusView
        id="super-focus-view"
        isOpen={isSuperFocus}
        onClose={() => setIsSuperFocus(false)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeMobileDevice={mobileDevice}
        activeDesktopDevice={desktopDevice}
        onSelectMobileDevice={(dev) => {
          setMobileDevice(dev);
          notify(t('app.sfDevice', { name: dev.name }));
        }}
        onSelectDesktopDevice={(dev) => {
          setDesktopDevice(dev);
          notify(t('app.sfDevice', { name: dev.name }));
        }}
        mobileOrientation={mobileOrientation}
        desktopOrientation={desktopOrientation}
        onToggleMobileOrientation={() =>
          setMobileOrientation((prev) => (prev === 'portrait' ? 'landscape' : 'portrait'))
        }
        onToggleDesktopOrientation={() =>
          setDesktopOrientation((prev) => (prev === 'portrait' ? 'landscape' : 'portrait'))
        }
        showBezel={showBezel}
        onToggleBezel={() => setShowBezel((prev) => !prev)}
        sourceType={sourceType === 'url' ? 'url' : sourceType === 'local-project' ? 'local-project' : 'template'}
        contentHtml={activeHtml}
        url={activeUrl}
        onCaptureScreenshot={handleCaptureScreenshot}
        isCapturing={isCapturing}
        onOpenExportModal={handleExportFullScroll}
      />

      {/* Export Modal with PNG/JPG formats, quality controls, and download */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        compositeCanvas={compositeCanvas}
        mobileCanvas={mobileCanvas}
        desktopCanvas={desktopCanvas}
        mobileDevice={mobileDevice}
        desktopDevice={desktopDevice}
        projectTitle={projectTitle}
        onProjectTitleChange={setProjectTitle}
      />
    </div>
  );
}
