import React, { useState, useEffect } from 'react';
import { Download, Copy, Check, X, FileImage, Sliders, Info, Sparkles } from 'lucide-react';
import { DeviceSpec } from '../types';
import { downloadCanvas, copyCanvasToClipboard, formatBytes } from '../utils/screenshot';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  compositeCanvas: HTMLCanvasElement | null;
  mobileCanvas: HTMLCanvasElement | null;
  desktopCanvas: HTMLCanvasElement | null;
  mobileDevice?: DeviceSpec;
  desktopDevice?: DeviceSpec;
  projectTitle: string;
  onProjectTitleChange: (title: string) => void;
  onRegenerateComposite?: (options: {
    backgroundColor: 'dark' | 'slate' | 'light' | 'transparent';
    includeHeader: boolean;
  }) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  compositeCanvas,
  mobileCanvas,
  desktopCanvas,
  mobileDevice,
  desktopDevice,
  projectTitle,
  onProjectTitleChange,
  onRegenerateComposite,
}) => {
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [jpegQuality, setJpegQuality] = useState<number>(0.92);
  const [backgroundColor, setBackgroundColor] = useState<'dark' | 'slate' | 'light' | 'transparent'>('light');
  const [includeHeader, setIncludeHeader] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string>('');
  const [fileSizeEstimate, setFileSizeEstimate] = useState<string>('');

  // Update preview when composite canvas or export parameters change
  useEffect(() => {
    if (!compositeCanvas) return;
    const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const dataUrl = compositeCanvas.toDataURL(mime, format === 'jpeg' ? jpegQuality : undefined);
    setPreviewDataUrl(dataUrl);

    // Approximate size from dataUrl length
    const head = `data:${mime};base64,`;
    const base64Length = dataUrl.length - head.length;
    const byteLength = Math.round((base64Length * 3) / 4);
    setFileSizeEstimate(formatBytes(byteLength));
  }, [compositeCanvas, format, jpegQuality]);

  if (!isOpen || !compositeCanvas) return null;

  const handleBackgroundChange = (bg: 'dark' | 'slate' | 'light' | 'transparent') => {
    setBackgroundColor(bg);
    if (onRegenerateComposite) {
      onRegenerateComposite({ backgroundColor: bg, includeHeader });
    }
  };

  const handleHeaderToggle = (inc: boolean) => {
    setIncludeHeader(inc);
    if (onRegenerateComposite) {
      onRegenerateComposite({ backgroundColor, includeHeader: inc });
    }
  };

  const handleDownloadFull = () => {
    const filename = `${projectTitle.toLowerCase().replace(/\s+/g, '-')}-captura`;
    downloadCanvas(compositeCanvas, filename, format, jpegQuality);
  };

  const handleDownloadMobileOnly = () => {
    if (!mobileCanvas) return;
    const filename = `${projectTitle.toLowerCase().replace(/\s+/g, '-')}-${mobileDevice?.id || 'mobile'}`;
    downloadCanvas(mobileCanvas, filename, format, jpegQuality);
  };

  const handleDownloadDesktopOnly = () => {
    if (!desktopCanvas) return;
    const filename = `${projectTitle.toLowerCase().replace(/\s+/g, '-')}-${desktopDevice?.id || 'desktop'}`;
    downloadCanvas(desktopCanvas, filename, format, jpegQuality);
  };

  const handleCopy = async () => {
    const success = await copyCanvasToClipboard(compositeCanvas);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-xs">
              <FileImage className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Exportar Captura de Tela</h3>
              <p className="text-xs text-slate-500">Gere imagens em PNG ou JPG de alta resolução do dispositivo ativo</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-200/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two columns (Preview + Settings) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Image Preview */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-100/70 rounded-2xl border border-slate-200 p-4 relative min-h-[300px]">
            {previewDataUrl ? (
              <img
                src={previewDataUrl}
                alt="Preview da captura"
                className="max-h-[360px] w-auto object-contain rounded-xl shadow-md border border-slate-200/60"
              />
            ) : (
              <div className="text-slate-400 text-xs">Carregando visualização...</div>
            )}

            <div className="mt-3 flex items-center justify-between w-full text-[11px] text-slate-500 px-1 font-mono">
              <span>
                Resolução: {compositeCanvas.width} × {compositeCanvas.height} px
              </span>
              <span className="text-indigo-600 font-bold">Tamanho estimado: {fileSizeEstimate}</span>
            </div>
          </div>

          {/* Right Column: Export Configuration */}
          <div className="lg:col-span-5 space-y-4 text-xs text-slate-700">
            {/* Project Title */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Título do Projeto ou Release:
              </label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => onProjectTitleChange(e.target.value)}
                placeholder="Ex: Landing Page TechStore - Sprint 14"
                className="w-full bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Format Selection: JPG vs PNG */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Formato do Arquivo:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormat('png')}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    format === 'png'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-900 font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <p className="font-bold text-sm">PNG</p>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Sem perdas, nitidez máxima</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat('jpeg')}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    format === 'jpeg'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-900 font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <p className="font-bold text-sm">JPG / JPEG</p>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Compacto, ideal para web</span>
                </button>
              </div>
            </div>

            {/* Quality Slider (JPG only) */}
            {format === 'jpeg' && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-800">Qualidade JPEG:</span>
                  <span className="font-mono text-indigo-600 font-bold">{Math.round(jpegQuality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.0"
                  step="0.05"
                  value={jpegQuality}
                  onChange={(e) => setJpegQuality(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500">
                  90-95% oferece o equilíbrio perfeito entre nitidez gráfica e leveza de download.
                </p>
              </div>
            )}

            {/* Studio Background */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Fundo do Banner Comparativo:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'light', label: 'Claro' },
                  { id: 'slate', label: 'Ardósia' },
                  { id: 'dark', label: 'Escuro' },
                ].map((bg) => (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => handleBackgroundChange(bg.id as any)}
                    className={`py-2 px-2 rounded-full border text-center text-xs font-semibold transition-all ${
                      backgroundColor === bg.id
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Header Stamp Toggle */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="font-bold text-slate-800 block">Identificador dos Dispositivos</span>
                <span className="text-[11px] text-slate-500">Exibe tags com resolução e timestamp</span>
              </div>
              <input
                type="checkbox"
                checked={includeHeader}
                onChange={(e) => handleHeaderToggle(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          {/* Individual downloads */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadMobileOnly}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-full text-xs font-semibold transition-colors border border-slate-200 shadow-xs"
            >
              Baixar Só Mobile (.{format === 'jpeg' ? 'jpg' : 'png'})
            </button>
            <button
              type="button"
              onClick={handleDownloadDesktopOnly}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-full text-xs font-semibold transition-colors border border-slate-200 shadow-xs"
            >
              Baixar Só Desktop (.{format === 'jpeg' ? 'jpg' : 'png'})
            </button>
          </div>

          {/* Primary actions */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 rounded-full text-xs font-semibold transition-colors border border-slate-200 shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copiar Imagem</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadFull}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white rounded-full text-xs font-bold transition-all shadow-md shadow-slate-950/20 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Imagem (.{format === 'jpeg' ? 'jpg' : 'png'})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
