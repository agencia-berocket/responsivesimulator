import React from 'react';
import { BUILTIN_TEMPLATES } from '../data/templates';
import { Code2, Sparkles, Copy, Check, RotateCcw } from 'lucide-react';

interface CodeEditorProps {
  id?: string;
  code: string;
  onChange: (newCode: string) => void;
  onSelectTemplate: (templateId: string) => void;
  selectedTemplateId?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  id,
  code,
  onChange,
  onSelectTemplate,
  selectedTemplateId,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsertBreakpointSnippet = () => {
    const snippet = `\n/* Exemplo de Media Query */\n@media (max-width: 768px) {\n  .sua-classe {\n    flex-direction: column;\n    width: 100%;\n  }\n}\n`;
    onChange(code + snippet);
  };

  return (
    <div
      id={id}
      className="w-full bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col"
    >
      {/* Editor Header Bar */}
      <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <Code2 className="w-4 h-4 text-indigo-600" />
            <span>Editor de Código HTML & CSS</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-slate-200/70 p-1 rounded-full border border-slate-200">
            <span className="text-slate-500 px-2 text-[11px] font-semibold">Modelos:</span>
            {BUILTIN_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => onSelectTemplate(tmpl.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                  selectedTemplateId === tmpl.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tmpl.name.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleInsertBreakpointSnippet}
            title="Inserir Media Query de exemplo"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-[11px] font-semibold transition-colors shadow-xs"
          >
            <Sparkles className="w-3 h-3 text-indigo-600" />
            + Media Query
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-[11px] font-semibold transition-colors shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Textarea with mono font */}
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          rows={12}
          spellCheck={false}
          className="w-full bg-[#0d1117] text-slate-100 font-mono text-xs leading-relaxed p-5 focus:outline-none resize-y selection:bg-indigo-600 selection:text-white"
          placeholder="Cole seu código HTML com tags <style> aqui..."
        />
        <div className="absolute bottom-3 right-4 bg-slate-800/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-slate-400 border border-slate-700 pointer-events-none">
          Live HTML/CSS Preview
        </div>
      </div>
    </div>
  );
};
