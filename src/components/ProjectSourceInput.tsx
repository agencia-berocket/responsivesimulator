import React, { useState, useRef } from 'react';
import {
  FolderArchive,
  FileCode,
  Globe,
  Upload,
  CheckCircle2,
  FolderOpen,
  FileText,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { ParsedProject, ProjectFile, formatBytes } from '../utils/localFolderParser';
import { useLanguage } from '../i18n/LanguageContext';

interface ProjectSourceInputProps {
  id?: string;
  sourceType: 'local-project' | 'url' | 'template' | 'editor' | 'image-compare';
  onSourceTypeChange: (type: 'local-project' | 'url' | 'template' | 'editor' | 'image-compare') => void;
  localProject: ParsedProject | null;
  onLoadLocalFiles: (files: FileList | File[]) => Promise<void>;
  onSelectEntryFile?: (file: ProjectFile) => void;
  isLoadingLocal: boolean;
  localError: string | null;
  urlInput: string;
  activeUrl: string;
  onUrlChange: (url: string) => void;
  onUrlSubmit: () => void;
}

export const ProjectSourceInput: React.FC<ProjectSourceInputProps> = ({
  id,
  sourceType,
  onSourceTypeChange,
  localProject,
  onLoadLocalFiles,
  onSelectEntryFile,
  isLoadingLocal,
  localError,
  urlInput,
  activeUrl,
  onUrlChange,
  onUrlSubmit,
}) => {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [showFileList, setShowFileList] = useState(false);

  const folderInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await onLoadLocalFiles(e.dataTransfer.files);
      onSourceTypeChange('local-project');
    }
  };

  const handleFolderSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await onLoadLocalFiles(e.target.files);
      onSourceTypeChange('local-project');
      e.target.value = '';
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await onLoadLocalFiles(e.target.files);
      onSourceTypeChange('local-project');
      e.target.value = '';
    }
  };

  const handleShortcutUrl = (url: string) => {
    onUrlChange(url);
    onSourceTypeChange('url');
    setTimeout(() => {
      onUrlSubmit();
    }, 50);
  };

  const isLocalActive = sourceType === 'local-project';
  const isUrlActive = sourceType === 'url';

  return (
    <div
      id={id}
      className="w-full neu-raised p-6 sm:p-7 select-none transition-all"
    >
      {/* Hidden native inputs for directory and single/multiple files */}
      <input
        type="file"
        ref={folderInputRef}
        onChange={handleFolderSelect}
        {...({ webkitdirectory: '', directory: '' } as React.InputHTMLAttributes<HTMLInputElement>)}
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".html,.htm,.index"
        multiple
        className="hidden"
      />

      {/* Main Tabs Selector in Neumorphic Sunken Track */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/60 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <div className="flex items-center neu-sunken p-1">
            <button
              type="button"
              onClick={() => onSourceTypeChange('local-project')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                isLocalActive
                  ? 'neu-pill-active'
                  : 'text-[#8fa0b5] hover:text-[#2b3674]'
              }`}
            >
              <FolderArchive className={`w-4 h-4 ${isLocalActive ? 'text-[#5b5de5]' : ''}`} />
              <span>{t('source.localTab')}</span>
              {localProject && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onSourceTypeChange('url')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                isUrlActive
                  ? 'neu-pill-active'
                  : 'text-[#8fa0b5] hover:text-[#2b3674]'
              }`}
            >
              <Globe className={`w-4 h-4 ${isUrlActive ? 'text-[#5b5de5]' : ''}`} />
              <span>{t('source.urlTab')}</span>
              {isUrlActive && activeUrl && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
          </div>
        </div>

        <div className="text-xs text-[#8fa0b5] font-medium">
          {isLocalActive ? (
            <span className="hidden sm:inline">
              {t('source.localHint')}
            </span>
          ) : isUrlActive ? (
            <span className="hidden sm:inline">
              {t('source.urlHint')}
            </span>
          ) : null}
        </div>
      </div>

      {/* VIEW 1: LOCAL PROJECT (.INDEX / PASTA LOCAL) */}
      {isLocalActive && (
        <div>
          {isLoadingLocal ? (
            <div className="p-8 neu-sunken-box flex flex-col items-center justify-center text-center gap-3">
              <RefreshCw className="w-8 h-8 text-[#5b5de5] animate-spin" />
              <p className="text-sm font-bold text-[#2b3674]">
                {t('source.loading')}
              </p>
              <p className="text-xs text-[#8fa0b5]">
                {t('source.loadingDetail')}
              </p>
            </div>
          ) : localProject ? (
            /* Card de projeto carregado */
            <div className="space-y-4">
              <div className="p-5 rounded-2xl neu-raised-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl neu-sunken flex items-center justify-center text-[#5b5de5] shrink-0 shadow-xs">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-black text-[#2b3674]">
                        {localProject.folderName}
                      </span>
                      <span className="bg-[#e6edf7] text-[#5b5de5] text-[10px] font-bold px-2 py-0.5 rounded-full neu-sunken">
                        {t('header.filesCount', { n: localProject.totalFiles })}
                      </span>
                      <span className="text-xs text-[#8fa0b5] font-mono">
                        {formatBytes(localProject.totalBytes)}
                      </span>
                    </div>
                    <p className="text-xs text-[#8fa0b5] mt-1 flex items-center gap-1.5 flex-wrap font-semibold">
                      <span>{t('source.entryPoint')}</span>
                      <span className="font-mono text-[#2b3674] bg-[#e6edf7] px-2 py-0.5 rounded font-bold">
                        {localProject.entryFileName}
                      </span>
                      <span className="text-[#a3b1c2]">•</span>
                      <span>{localProject.cssCount} CSS</span>
                      <span className="text-[#a3b1c2]">•</span>
                      <span>{t('source.scripts', { n: localProject.jsCount })}</span>
                      <span className="text-[#a3b1c2]">•</span>
                      <span>{t('source.images', { n: localProject.imageCount })}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setShowFileList((prev) => !prev)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#2b3674] neu-raised-sm px-3.5 py-2 rounded-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    <span>{t('source.structure')}</span>
                    {showFileList ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => folderInputRef.current?.click()}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#5b5de5] neu-raised-sm px-4 py-2 rounded-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    <FolderOpen className="w-4 h-4" />
                    <span>{t('source.changeFolder')}</span>
                  </button>
                </div>
              </div>

              {/* Collapsible File Explorer */}
              {showFileList && (
                <div className="neu-sunken-box p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#2b3674]">
                      {t('source.loadedFiles')}
                    </span>
                    <span className="text-[11px] text-[#8fa0b5]">
                      {t('source.clickHtmlTip')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                    {localProject.files.map((file) => {
                      const isEntry = file.path === localProject.entryFileName;
                      const isHtml = file.type === 'html';

                      return (
                        <button
                          key={file.path}
                          type="button"
                          onClick={() => {
                            if (isHtml && onSelectEntryFile) {
                              onSelectEntryFile(file);
                            }
                          }}
                          disabled={!isHtml}
                          className={`flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                            isEntry
                              ? 'neu-pill-active'
                              : isHtml
                              ? 'neu-raised-sm hover:scale-[1.02] cursor-pointer'
                              : 'opacity-60 bg-[#f0f4fa]/50 text-[#8fa0b5]'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {isHtml ? (
                              <FileCode className={`w-3.5 h-3.5 shrink-0 ${isEntry ? 'text-[#5b5de5]' : 'text-[#8fa0b5]'}`} />
                            ) : (
                              <FileText className="w-3.5 h-3.5 text-[#a3b1c2] shrink-0" />
                            )}
                            <span className="text-xs font-mono truncate">{file.path}</span>
                          </div>
                          <span className="text-[10px] text-[#8fa0b5] shrink-0 font-mono ml-2">
                            {formatBytes(file.size)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Drag and Drop Zone in Neumorphic Embossed Sunken Box */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`neu-sunken-box p-8 sm:p-10 border-2 border-dashed transition-all duration-200 text-center flex flex-col items-center justify-center gap-4 ${
                isDragging
                  ? 'border-[#5b5de5] bg-[#eaf0f8]'
                  : 'border-[#a3b1c2]/50 hover:border-[#5b5de5]/70'
              }`}
            >
              <div className="w-16 h-16 rounded-3xl neu-raised flex items-center justify-center text-[#5b5de5]">
                <FolderArchive className="w-8 h-8 stroke-[1.75]" />
              </div>

              <div className="max-w-md">
                <h3 className="text-base font-extrabold text-[#2b3674] tracking-tight">
                  {t('source.dragTitle')}
                </h3>
                <p className="text-xs text-[#8fa0b5] mt-1 font-semibold leading-relaxed">
                  {t('source.dragDesc')}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => folderInputRef.current?.click()}
                  className="flex items-center gap-2 neu-raised-sm hover:scale-105 active:scale-95 text-[#2b3674] font-bold px-5 py-2.5 rounded-2xl text-xs transition-all"
                >
                  <FolderOpen className="w-4 h-4 text-[#5b5de5]" />
                  <span>{t('source.selectFolder')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 neu-raised-sm hover:scale-105 active:scale-95 text-[#8fa0b5] hover:text-[#2b3674] font-bold px-4 py-2.5 rounded-2xl text-xs transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>{t('source.selectFile')}</span>
                </button>
              </div>
            </div>
          )}

          {localError && (
            <div className="mt-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 font-semibold">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{localError}</span>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: REAL URL */}
      {isUrlActive && (
        <div className="space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onUrlSubmit();
            }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#8fa0b5]">
                <Globe className="w-4 h-4 text-[#5b5de5]" />
              </div>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => onUrlChange(e.target.value)}
                placeholder={t('source.urlPlaceholder')}
                className="w-full neu-sunken-box pl-11 pr-4 py-3.5 text-xs font-mono font-bold text-[#2b3674] focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 neu-raised-sm hover:scale-105 active:scale-95 px-6 py-3.5 rounded-2xl text-xs font-black text-[#5b5de5] transition-all shrink-0"
            >
              <span>{t('source.loadBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Presets / Suggestions in Neumorphic Pills */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[#8fa0b5] font-bold text-[11px]">{t('source.quickExamples')}</span>
            {[
              { label: 'Example.com', url: 'https://example.com' },
              { label: 'Localhost:3000', url: 'http://localhost:3000' },
              { label: 'Localhost:5173 (Vite)', url: 'http://localhost:5173' },
              { label: 'Wikipedia.org', url: 'https://wikipedia.org' },
            ].map((shortcut) => (
              <button
                key={shortcut.label}
                type="button"
                onClick={() => handleShortcutUrl(shortcut.url)}
                className="px-3 py-1 rounded-full text-[11px] font-bold text-[#2b3674] neu-raised-sm hover:text-[#5b5de5] transition-all"
              >
                {shortcut.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
