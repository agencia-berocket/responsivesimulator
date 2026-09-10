/**
 * Central translations for the Responsive Simulator app.
 * Supports: pt (PT-BR), en, es, fr
 * Fallback language: en
 */

export type Lang = 'pt' | 'en' | 'es' | 'fr';

export type TranslationKey =
  // Navigation Rail
  | 'nav.simulator'
  | 'nav.source'
  | 'nav.editor'
  | 'nav.breakpoints'
  | 'nav.superFocus'
  | 'nav.capture'
  | 'nav.resetZoom'
  | 'nav.logoTitle'
  // Header
  | 'header.capture'
  | 'header.export'
  | 'header.superFocus'
  | 'header.superFocusTitle'
  | 'header.captureTitle'
  | 'header.exportTitle'
  | 'header.sourcePanelTitle'
  | 'header.noSource'
  | 'header.filesCount'
  | 'header.urlActive'
  | 'header.retina'
  // View modes
  | 'view.mobile'
  | 'view.desktop'
  // Device Panel
  | 'device.title'
  | 'device.all'
  | 'device.mobile'
  | 'device.desktop'
  | 'device.frames'
  | 'device.active'
  | 'device.view'
  | 'device.retina'
  | 'device.simulateTip'
  // Source Panel
  | 'source.localTab'
  | 'source.urlTab'
  | 'source.localHint'
  | 'source.urlHint'
  | 'source.loading'
  | 'source.loadingDetail'
  | 'source.entryPoint'
  | 'source.structure'
  | 'source.changeFolder'
  | 'source.dragTitle'
  | 'source.dragDesc'
  | 'source.selectFolder'
  | 'source.selectFile'
  | 'source.loadedFiles'
  | 'source.clickHtmlTip'
  | 'source.quickExamples'
  | 'source.loadBtn'
  | 'source.urlPlaceholder'
  | 'source.images'
  | 'source.scripts'
  // Super Focus
  | 'sf.exit'
  | 'sf.hideBar'
  | 'sf.showControls'
  | 'sf.capture'
  | 'sf.export'
  | 'sf.reload'
  | 'sf.frameOn'
  | 'sf.frameOff'
  | 'sf.viewDesktop'
  | 'sf.viewMobile'
  | 'sf.switchTo'
  | 'sf.deviceTitle'
  | 'sf.zoomIn'
  | 'sf.zoomOut'
  | 'sf.zoomReset'
  | 'sf.orientation'
  | 'sf.portrait'
  | 'sf.landscape'
  | 'sf.reloadLive'
  | 'sf.autoSyncOn'
  | 'sf.autoSyncOff'
  // Device Frame
  | 'frame.reload'
  | 'frame.reloadLive'
  | 'frame.openExternal'
  | 'frame.zoomIn'
  | 'frame.zoomOut'
  | 'frame.rotateTo'
  | 'frame.portrait'
  | 'frame.landscape'
  // Export Modal
  | 'export.title'
  | 'export.subtitle'
  | 'export.projectLabel'
  | 'export.projectPlaceholder'
  | 'export.formatLabel'
  | 'export.pngDesc'
  | 'export.jpgDesc'
  | 'export.qualityLabel'
  | 'export.qualityHint'
  | 'export.bgLabel'
  | 'export.bgLight'
  | 'export.bgSlate'
  | 'export.bgDark'
  | 'export.deviceIdLabel'
  | 'export.deviceIdHint'
  | 'export.downloadMobile'
  | 'export.downloadDesktop'
  | 'export.copy'
  | 'export.copied'
  | 'export.download'
  | 'export.resolution'
  | 'export.estimatedSize'
  | 'export.loadingPreview'
  // Code Editor
  | 'editor.title'
  | 'editor.templates'
  | 'editor.addMediaQuery'
  | 'editor.copy'
  | 'editor.copied'
  | 'editor.placeholder'
  | 'editor.livePreview'
  // Breakpoints bar
  | 'bp.label'
  | 'bp.scale'
  | 'bp.resetZoom'
  // App toasts
  | 'app.capturing'
  | 'app.captureSuccess'
  | 'app.captureError'
  | 'app.captureNotFound'
  | 'app.exporting'
  | 'app.exportSuccess'
  | 'app.exportError'
  | 'app.exportNotFound'
  | 'app.templateLoaded'
  | 'app.urlLoading'
  | 'app.folderLoaded'
  | 'app.folderError'
  | 'app.zoomReset'
  | 'app.deviceMobile'
  | 'app.deviceDesktop'
  | 'app.sfDevice'
  | 'app.entryChanged'
  | 'app.entryError'
  | 'app.linkProtected'
  | 'app.bpMobile'
  | 'app.bpDesktop';

type Translations = Record<TranslationKey, string>;

export const translations: Record<Lang, Translations> = {
  // ──────────────── PORTUGUÊS (BR) ────────────────
  pt: {
    'nav.simulator': 'Simulador Responsivo',
    'nav.source': 'Pasta .Index / URL',
    'nav.editor': 'Editor de Código',
    'nav.breakpoints': 'Breakpoints & Escala',
    'nav.superFocus': 'Modo Super Foco',
    'nav.capture': 'Tirar Captura de Tela',
    'nav.resetZoom': 'Resetar Zoom',
    'nav.logoTitle': 'Simulador Responsivo - Mac Desktop',
    'header.capture': 'Capturar Tela',
    'header.export': 'Exportar',
    'header.superFocus': 'Super Foco',
    'header.superFocusTitle': 'Super Foco: Ampliar a tela e ocultar menus',
    'header.captureTitle': 'Capturar tela do dispositivo ativo em alta resolução',
    'header.exportTitle': 'Exportar em PNG ou JPG',
    'header.sourcePanelTitle': 'Alterar pasta .Index ou URL do projeto',
    'header.noSource': 'Sem fonte',
    'header.filesCount': '{n} arquivos (.index)',
    'header.urlActive': 'URL Web Ativa',
    'header.retina': 'Retina 2x',
    'view.mobile': 'Mobile',
    'view.desktop': 'Desktop',
    'device.title': 'Dispositivos',
    'device.all': 'Todos',
    'device.mobile': 'Mobile',
    'device.desktop': 'Desktop',
    'device.frames': 'Molduras',
    'device.active': 'ATIVO',
    'device.view': 'VER',
    'device.retina': 'Retina 2x / 3x',
    'device.simulateTip': 'Clique para simular em {name} ({w} × {h})',
    'source.localTab': 'Pasta Local (.Index)',
    'source.urlTab': 'URL da Web',
    'source.localHint': 'Insira o arquivo index.html ou selecione a pasta completa do projeto.',
    'source.urlHint': 'Digite uma URL de produção ou servidor local (ex: localhost:3000).',
    'source.loading': 'Lendo estrutura da pasta e resolvendo links de assets...',
    'source.loadingDetail': 'Mapeando arquivos HTML, folhas de estilo CSS, scripts e imagens locais em memória.',
    'source.entryPoint': 'Ponto de entrada:',
    'source.structure': 'Estrutura',
    'source.changeFolder': 'Trocar Pasta',
    'source.dragTitle': 'Arraste aqui a pasta do projeto ou o arquivo .index',
    'source.dragDesc': 'O simulador lê automaticamente o index.html e resolve todos os arquivos CSS, JS e imagens locais sem enviar nada para servidores externos.',
    'source.selectFolder': 'Selecionar Pasta Completa',
    'source.selectFile': 'Selecionar Arquivo .index / HTML',
    'source.loadedFiles': 'Arquivos do Projeto Carregado:',
    'source.clickHtmlTip': 'Clique em qualquer HTML para torná-lo a tela ativa',
    'source.quickExamples': 'Exemplos rápidos:',
    'source.loadBtn': 'Carregar no Simulador',
    'source.urlPlaceholder': 'https://meusite.com.br ou http://localhost:3000',
    'source.images': '{n} Imagens',
    'source.scripts': '{n} Scripts',
    'sf.exit': 'Sair (Esc)',
    'sf.hideBar': 'Ocultar Barra',
    'sf.showControls': 'Controles',
    'sf.capture': 'Capturar',
    'sf.export': 'Exportar',
    'sf.reload': 'Atualizar',
    'sf.frameOn': 'Moldura ON',
    'sf.frameOff': 'Moldura OFF',
    'sf.viewDesktop': 'Ver Desktop',
    'sf.viewMobile': 'Ver Mobile',
    'sf.switchTo': 'Trocar para {mode}',
    'sf.deviceTitle': 'Clique para trocar o dispositivo',
    'sf.zoomIn': 'Aumentar Zoom',
    'sf.zoomOut': 'Diminuir Zoom',
    'sf.zoomReset': 'Resetar Zoom',
    'sf.orientation': 'Girar Orientação (Retrato / Paisagem)',
    'sf.portrait': 'retrato',
    'sf.landscape': 'paisagem',
    'sf.reloadLive': 'Recarregar alterações do disco ao vivo (F5 / Ctrl+R)',
    'sf.autoSyncOn': '⚡ Auto-Sync ON',
    'sf.autoSyncOff': 'Auto-Sync OFF',
    'frame.reload': 'Recarregar tela (F5 / Ctrl+R)',
    'frame.reloadLive': 'Recarregar alterações do disco ao vivo (F5 / Ctrl+R)',
    'frame.openExternal': 'Abrir URL em nova aba',
    'frame.zoomIn': 'Aumentar Zoom',
    'frame.zoomOut': 'Diminuir Zoom',
    'frame.rotateTo': 'Alternar para {mode}',
    'frame.portrait': 'Retrato',
    'frame.landscape': 'Paisagem',
    'export.title': 'Exportar Captura de Tela',
    'export.subtitle': 'Gere imagens em PNG ou JPG de alta resolução do dispositivo ativo',
    'export.projectLabel': 'Título do Projeto ou Release:',
    'export.projectPlaceholder': 'Ex: Landing Page TechStore - Sprint 14',
    'export.formatLabel': 'Formato do Arquivo:',
    'export.pngDesc': 'Sem perdas, nitidez máxima',
    'export.jpgDesc': 'Compacto, ideal para web',
    'export.qualityLabel': 'Qualidade JPEG:',
    'export.qualityHint': '90-95% oferece o equilíbrio perfeito entre nitidez gráfica e leveza de download.',
    'export.bgLabel': 'Fundo do Banner Comparativo:',
    'export.bgLight': 'Claro',
    'export.bgSlate': 'Ardósia',
    'export.bgDark': 'Escuro',
    'export.deviceIdLabel': 'Identificador dos Dispositivos',
    'export.deviceIdHint': 'Exibe tags com resolução e timestamp',
    'export.downloadMobile': 'Baixar Só Mobile',
    'export.downloadDesktop': 'Baixar Só Desktop',
    'export.copy': 'Copiar Imagem',
    'export.copied': 'Copiado!',
    'export.download': 'Baixar Imagem',
    'export.resolution': 'Resolução:',
    'export.estimatedSize': 'Tamanho estimado:',
    'export.loadingPreview': 'Carregando visualização...',
    'editor.title': 'Editor de Código HTML & CSS',
    'editor.templates': 'Modelos:',
    'editor.addMediaQuery': '+ Media Query',
    'editor.copy': 'Copiar',
    'editor.copied': 'Copiado!',
    'editor.placeholder': 'Cole seu código HTML com tags <style> aqui...',
    'editor.livePreview': 'Live HTML/CSS Preview',
    'bp.label': 'Breakpoints Rápidos:',
    'bp.scale': 'Escala:',
    'bp.resetZoom': 'Resetar Zoom',
    'app.capturing': 'Gerando captura de tela…',
    'app.captureSuccess': '✅ Captura PNG ({name}) baixada!',
    'app.captureError': 'Ocorreu um erro ao capturar a tela.',
    'app.captureNotFound': 'Elemento do dispositivo não encontrado para captura.',
    'app.exporting': 'Gerando exportação completa…',
    'app.exportSuccess': '✅ Exportação PNG ({name}) baixada!',
    'app.exportError': 'Falha ao gerar exportação.',
    'app.exportNotFound': 'Elemento do dispositivo não encontrado para exportação.',
    'app.templateLoaded': 'Modelo "{name}" carregado.',
    'app.urlLoading': 'Carregando URL: {url}',
    'app.folderLoaded': 'Pasta "{name}" carregada! {n} arquivos mapeados.',
    'app.folderError': 'Erro: {msg}',
    'app.zoomReset': 'Escala restaurada para o padrão.',
    'app.deviceMobile': 'Dispositivo mobile: {name}',
    'app.deviceDesktop': 'Dispositivo desktop: {name}',
    'app.sfDevice': 'Super Foco: {name}',
    'app.entryChanged': 'Arquivo de entrada alterado para "{name}"',
    'app.entryError': 'Erro ao alternar arquivo: {err}',
    'app.linkProtected': 'Link local "{href}" protegido contra redirecionamento.',
    'app.bpMobile': 'Mobile ajustado para {w}px ({label})',
    'app.bpDesktop': 'Desktop ajustado para {w}px ({label})',
  },

  // ──────────────── ENGLISH ────────────────
  en: {
    'nav.simulator': 'Responsive Simulator',
    'nav.source': 'Local Folder / URL',
    'nav.editor': 'Code Editor',
    'nav.breakpoints': 'Breakpoints & Scale',
    'nav.superFocus': 'Super Focus Mode',
    'nav.capture': 'Take Screenshot',
    'nav.resetZoom': 'Reset Zoom',
    'nav.logoTitle': 'Responsive Simulator - Mac Desktop',
    'header.capture': 'Capture Screen',
    'header.export': 'Export',
    'header.superFocus': 'Super Focus',
    'header.superFocusTitle': 'Super Focus: Expand screen and hide menus',
    'header.captureTitle': 'Capture active device screen in high resolution',
    'header.exportTitle': 'Export as PNG or JPG',
    'header.sourcePanelTitle': 'Change .Index folder or project URL',
    'header.noSource': 'No source',
    'header.filesCount': '{n} files (.index)',
    'header.urlActive': 'Active Web URL',
    'header.retina': 'Retina 2x',
    'view.mobile': 'Mobile',
    'view.desktop': 'Desktop',
    'device.title': 'Devices',
    'device.all': 'All',
    'device.mobile': 'Mobile',
    'device.desktop': 'Desktop',
    'device.frames': 'Frames',
    'device.active': 'ACTIVE',
    'device.view': 'VIEW',
    'device.retina': 'Retina 2x / 3x',
    'device.simulateTip': 'Click to simulate on {name} ({w} × {h})',
    'source.localTab': 'Local Folder (.Index)',
    'source.urlTab': 'Web URL',
    'source.localHint': 'Insert the index.html file or select the full project folder.',
    'source.urlHint': 'Enter a production URL or local dev server (e.g., localhost:3000).',
    'source.loading': 'Reading folder structure and resolving asset links...',
    'source.loadingDetail': 'Mapping HTML files, CSS stylesheets, scripts, and local images into memory.',
    'source.entryPoint': 'Entry point:',
    'source.structure': 'Structure',
    'source.changeFolder': 'Change Folder',
    'source.dragTitle': 'Drag the project folder or .index file here',
    'source.dragDesc': 'The simulator automatically reads the index.html and resolves all local CSS, JS, and image files without sending anything to external servers.',
    'source.selectFolder': 'Select Full Folder',
    'source.selectFile': 'Select .index / HTML File',
    'source.loadedFiles': 'Loaded Project Files:',
    'source.clickHtmlTip': 'Click any HTML file to make it the active view',
    'source.quickExamples': 'Quick examples:',
    'source.loadBtn': 'Load in Simulator',
    'source.urlPlaceholder': 'https://mysite.com or http://localhost:3000',
    'source.images': '{n} Images',
    'source.scripts': '{n} Scripts',
    'sf.exit': 'Exit (Esc)',
    'sf.hideBar': 'Hide Bar',
    'sf.showControls': 'Controls',
    'sf.capture': 'Capture',
    'sf.export': 'Export',
    'sf.reload': 'Refresh',
    'sf.frameOn': 'Frame ON',
    'sf.frameOff': 'Frame OFF',
    'sf.viewDesktop': 'View Desktop',
    'sf.viewMobile': 'View Mobile',
    'sf.switchTo': 'Switch to {mode}',
    'sf.deviceTitle': 'Click to change device',
    'sf.zoomIn': 'Zoom In',
    'sf.zoomOut': 'Zoom Out',
    'sf.zoomReset': 'Reset Zoom',
    'sf.orientation': 'Rotate Orientation (Portrait / Landscape)',
    'sf.portrait': 'portrait',
    'sf.landscape': 'landscape',
    'sf.reloadLive': 'Reload live changes from disk (F5 / Ctrl+R)',
    'sf.autoSyncOn': '⚡ Auto-Sync ON',
    'sf.autoSyncOff': 'Auto-Sync OFF',
    'frame.reload': 'Reload view (F5 / Ctrl+R)',
    'frame.reloadLive': 'Reload live changes from disk (F5 / Ctrl+R)',
    'frame.openExternal': 'Open URL in new tab',
    'frame.zoomIn': 'Zoom In',
    'frame.zoomOut': 'Zoom Out',
    'frame.rotateTo': 'Switch to {mode}',
    'frame.portrait': 'Portrait',
    'frame.landscape': 'Landscape',
    'export.title': 'Export Screenshot',
    'export.subtitle': 'Generate high-resolution PNG or JPG images of the active device',
    'export.projectLabel': 'Project or Release Title:',
    'export.projectPlaceholder': 'E.g.: TechStore Landing Page - Sprint 14',
    'export.formatLabel': 'File Format:',
    'export.pngDesc': 'Lossless, maximum sharpness',
    'export.jpgDesc': 'Compact, ideal for web',
    'export.qualityLabel': 'JPEG Quality:',
    'export.qualityHint': '90-95% provides the perfect balance between image sharpness and download size.',
    'export.bgLabel': 'Comparative Banner Background:',
    'export.bgLight': 'Light',
    'export.bgSlate': 'Slate',
    'export.bgDark': 'Dark',
    'export.deviceIdLabel': 'Device Identifier',
    'export.deviceIdHint': 'Shows tags with resolution and timestamp',
    'export.downloadMobile': 'Download Mobile Only',
    'export.downloadDesktop': 'Download Desktop Only',
    'export.copy': 'Copy Image',
    'export.copied': 'Copied!',
    'export.download': 'Download Image',
    'export.resolution': 'Resolution:',
    'export.estimatedSize': 'Estimated size:',
    'export.loadingPreview': 'Loading preview...',
    'editor.title': 'HTML & CSS Code Editor',
    'editor.templates': 'Templates:',
    'editor.addMediaQuery': '+ Media Query',
    'editor.copy': 'Copy',
    'editor.copied': 'Copied!',
    'editor.placeholder': 'Paste your HTML code with <style> tags here...',
    'editor.livePreview': 'Live HTML/CSS Preview',
    'bp.label': 'Quick Breakpoints:',
    'bp.scale': 'Scale:',
    'bp.resetZoom': 'Reset Zoom',
    'app.capturing': 'Generating screenshot…',
    'app.captureSuccess': '✅ Screen Capture PNG ({name}) downloaded!',
    'app.captureError': 'An error occurred while capturing the screen.',
    'app.captureNotFound': 'Device element not found for capture.',
    'app.exporting': 'Generating full export…',
    'app.exportSuccess': '✅ Export PNG ({name}) downloaded!',
    'app.exportError': 'Failed to generate export.',
    'app.exportNotFound': 'Device element not found for export.',
    'app.templateLoaded': 'Template "{name}" loaded.',
    'app.urlLoading': 'Loading URL: {url}',
    'app.folderLoaded': 'Folder "{name}" loaded! {n} files mapped.',
    'app.folderError': 'Error: {msg}',
    'app.zoomReset': 'Scale reset to default.',
    'app.deviceMobile': 'Mobile device: {name}',
    'app.deviceDesktop': 'Desktop device: {name}',
    'app.sfDevice': 'Super Focus: {name}',
    'app.entryChanged': 'Entry file changed to "{name}"',
    'app.entryError': 'Error switching file: {err}',
    'app.linkProtected': 'Local link "{href}" protected from redirect.',
    'app.bpMobile': 'Mobile set to {w}px ({label})',
    'app.bpDesktop': 'Desktop set to {w}px ({label})',
  },

  // ──────────────── ESPAÑOL ────────────────
  es: {
    'nav.simulator': 'Simulador Responsivo',
    'nav.source': 'Carpeta .Index / URL',
    'nav.editor': 'Editor de Código',
    'nav.breakpoints': 'Breakpoints y Escala',
    'nav.superFocus': 'Modo Super Enfoque',
    'nav.capture': 'Capturar Pantalla',
    'nav.resetZoom': 'Restablecer Zoom',
    'nav.logoTitle': 'Simulador Responsivo - Mac Desktop',
    'header.capture': 'Capturar Pantalla',
    'header.export': 'Exportar',
    'header.superFocus': 'Super Enfoque',
    'header.superFocusTitle': 'Super Enfoque: Ampliar pantalla y ocultar menús',
    'header.captureTitle': 'Capturar pantalla del dispositivo activo en alta resolución',
    'header.exportTitle': 'Exportar como PNG o JPG',
    'header.sourcePanelTitle': 'Cambiar carpeta .Index o URL del proyecto',
    'header.noSource': 'Sin fuente',
    'header.filesCount': '{n} archivos (.index)',
    'header.urlActive': 'URL Web Activa',
    'header.retina': 'Retina 2x',
    'view.mobile': 'Móvil',
    'view.desktop': 'Escritorio',
    'device.title': 'Dispositivos',
    'device.all': 'Todos',
    'device.mobile': 'Móvil',
    'device.desktop': 'Escritorio',
    'device.frames': 'Marcos',
    'device.active': 'ACTIVO',
    'device.view': 'VER',
    'device.retina': 'Retina 2x / 3x',
    'device.simulateTip': 'Clic para simular en {name} ({w} × {h})',
    'source.localTab': 'Carpeta Local (.Index)',
    'source.urlTab': 'URL Web',
    'source.localHint': 'Inserte el archivo index.html o seleccione la carpeta completa del proyecto.',
    'source.urlHint': 'Ingrese una URL de producción o servidor local (ej: localhost:3000).',
    'source.loading': 'Leyendo estructura de carpeta y resolviendo enlaces de assets...',
    'source.loadingDetail': 'Mapeando archivos HTML, hojas de estilo CSS, scripts e imágenes locales en memoria.',
    'source.entryPoint': 'Punto de entrada:',
    'source.structure': 'Estructura',
    'source.changeFolder': 'Cambiar Carpeta',
    'source.dragTitle': 'Arrastre aquí la carpeta del proyecto o el archivo .index',
    'source.dragDesc': 'El simulador lee automáticamente el index.html y resuelve todos los archivos CSS, JS e imágenes locales sin enviar nada a servidores externos.',
    'source.selectFolder': 'Seleccionar Carpeta Completa',
    'source.selectFile': 'Seleccionar Archivo .index / HTML',
    'source.loadedFiles': 'Archivos del Proyecto Cargado:',
    'source.clickHtmlTip': 'Clic en cualquier HTML para hacerlo la vista activa',
    'source.quickExamples': 'Ejemplos rápidos:',
    'source.loadBtn': 'Cargar en Simulador',
    'source.urlPlaceholder': 'https://mipagina.com o http://localhost:3000',
    'source.images': '{n} Imágenes',
    'source.scripts': '{n} Scripts',
    'sf.exit': 'Salir (Esc)',
    'sf.hideBar': 'Ocultar Barra',
    'sf.showControls': 'Controles',
    'sf.capture': 'Capturar',
    'sf.export': 'Exportar',
    'sf.reload': 'Actualizar',
    'sf.frameOn': 'Marco ON',
    'sf.frameOff': 'Marco OFF',
    'sf.viewDesktop': 'Ver Escritorio',
    'sf.viewMobile': 'Ver Móvil',
    'sf.switchTo': 'Cambiar a {mode}',
    'sf.deviceTitle': 'Clic para cambiar dispositivo',
    'sf.zoomIn': 'Acercar',
    'sf.zoomOut': 'Alejar',
    'sf.zoomReset': 'Restablecer Zoom',
    'sf.orientation': 'Rotar Orientación (Retrato / Paisaje)',
    'sf.portrait': 'retrato',
    'sf.landscape': 'paisaje',
    'sf.reloadLive': 'Recargar cambios del disco en vivo (F5 / Ctrl+R)',
    'sf.autoSyncOn': '⚡ Auto-Sync ON',
    'sf.autoSyncOff': 'Auto-Sync OFF',
    'frame.reload': 'Recargar vista (F5 / Ctrl+R)',
    'frame.reloadLive': 'Recargar cambios del disco en vivo (F5 / Ctrl+R)',
    'frame.openExternal': 'Abrir URL en nueva pestaña',
    'frame.zoomIn': 'Acercar',
    'frame.zoomOut': 'Alejar',
    'frame.rotateTo': 'Cambiar a {mode}',
    'frame.portrait': 'Retrato',
    'frame.landscape': 'Paisaje',
    'export.title': 'Exportar Captura de Pantalla',
    'export.subtitle': 'Genere imágenes PNG o JPG de alta resolución del dispositivo activo',
    'export.projectLabel': 'Título del Proyecto o Release:',
    'export.projectPlaceholder': 'Ej: Landing Page TechStore - Sprint 14',
    'export.formatLabel': 'Formato del Archivo:',
    'export.pngDesc': 'Sin pérdidas, máxima nitidez',
    'export.jpgDesc': 'Compacto, ideal para web',
    'export.qualityLabel': 'Calidad JPEG:',
    'export.qualityHint': '90-95% ofrece el equilibrio perfecto entre nitidez gráfica y peso de descarga.',
    'export.bgLabel': 'Fondo del Banner Comparativo:',
    'export.bgLight': 'Claro',
    'export.bgSlate': 'Pizarra',
    'export.bgDark': 'Oscuro',
    'export.deviceIdLabel': 'Identificador de Dispositivos',
    'export.deviceIdHint': 'Muestra etiquetas con resolución y timestamp',
    'export.downloadMobile': 'Descargar Solo Móvil',
    'export.downloadDesktop': 'Descargar Solo Escritorio',
    'export.copy': 'Copiar Imagen',
    'export.copied': '¡Copiado!',
    'export.download': 'Descargar Imagen',
    'export.resolution': 'Resolución:',
    'export.estimatedSize': 'Tamaño estimado:',
    'export.loadingPreview': 'Cargando vista previa...',
    'editor.title': 'Editor de Código HTML & CSS',
    'editor.templates': 'Plantillas:',
    'editor.addMediaQuery': '+ Media Query',
    'editor.copy': 'Copiar',
    'editor.copied': '¡Copiado!',
    'editor.placeholder': 'Pegue su código HTML con etiquetas <style> aquí...',
    'editor.livePreview': 'Vista previa HTML/CSS en vivo',
    'bp.label': 'Breakpoints Rápidos:',
    'bp.scale': 'Escala:',
    'bp.resetZoom': 'Restablecer Zoom',
    'app.capturing': 'Generando captura de pantalla…',
    'app.captureSuccess': '✅ Captura PNG ({name}) descargada!',
    'app.captureError': 'Ocurrió un error al capturar la pantalla.',
    'app.captureNotFound': 'Elemento del dispositivo no encontrado para captura.',
    'app.exporting': 'Generando exportación completa…',
    'app.exportSuccess': '✅ Exportación PNG ({name}) descargada!',
    'app.exportError': 'Error al generar exportación.',
    'app.exportNotFound': 'Elemento del dispositivo no encontrado para exportación.',
    'app.templateLoaded': 'Plantilla "{name}" cargada.',
    'app.urlLoading': 'Cargando URL: {url}',
    'app.folderLoaded': 'Carpeta "{name}" cargada! {n} archivos mapeados.',
    'app.folderError': 'Error: {msg}',
    'app.zoomReset': 'Escala restablecida al valor predeterminado.',
    'app.deviceMobile': 'Dispositivo móvil: {name}',
    'app.deviceDesktop': 'Dispositivo escritorio: {name}',
    'app.sfDevice': 'Super Enfoque: {name}',
    'app.entryChanged': 'Archivo de entrada cambiado a "{name}"',
    'app.entryError': 'Error al cambiar archivo: {err}',
    'app.linkProtected': 'Enlace local "{href}" protegido de redirección.',
    'app.bpMobile': 'Móvil ajustado a {w}px ({label})',
    'app.bpDesktop': 'Escritorio ajustado a {w}px ({label})',
  },

  // ──────────────── FRANÇAIS ────────────────
  fr: {
    'nav.simulator': 'Simulateur Adaptatif',
    'nav.source': 'Dossier .Index / URL',
    'nav.editor': 'Éditeur de Code',
    'nav.breakpoints': 'Points d\'arrêt & Échelle',
    'nav.superFocus': 'Mode Super Focus',
    'nav.capture': 'Capturer l\'écran',
    'nav.resetZoom': 'Réinitialiser le Zoom',
    'nav.logoTitle': 'Simulateur Adaptatif - Mac Desktop',
    'header.capture': 'Capturer l\'écran',
    'header.export': 'Exporter',
    'header.superFocus': 'Super Focus',
    'header.superFocusTitle': 'Super Focus: Agrandir l\'écran et masquer les menus',
    'header.captureTitle': 'Capturer l\'écran de l\'appareil actif en haute résolution',
    'header.exportTitle': 'Exporter en PNG ou JPG',
    'header.sourcePanelTitle': 'Modifier le dossier .Index ou l\'URL du projet',
    'header.noSource': 'Sans source',
    'header.filesCount': '{n} fichiers (.index)',
    'header.urlActive': 'URL Web Active',
    'header.retina': 'Retina 2x',
    'view.mobile': 'Mobile',
    'view.desktop': 'Bureau',
    'device.title': 'Appareils',
    'device.all': 'Tous',
    'device.mobile': 'Mobile',
    'device.desktop': 'Bureau',
    'device.frames': 'Cadres',
    'device.active': 'ACTIF',
    'device.view': 'VOIR',
    'device.retina': 'Retina 2x / 3x',
    'device.simulateTip': 'Cliquer pour simuler sur {name} ({w} × {h})',
    'source.localTab': 'Dossier Local (.Index)',
    'source.urlTab': 'URL Web',
    'source.localHint': 'Insérez le fichier index.html ou sélectionnez le dossier complet du projet.',
    'source.urlHint': 'Saisissez une URL de production ou un serveur local (ex: localhost:3000).',
    'source.loading': 'Lecture de la structure du dossier et résolution des liens d\'assets...',
    'source.loadingDetail': 'Mappage des fichiers HTML, feuilles de style CSS, scripts et images locales en mémoire.',
    'source.entryPoint': 'Point d\'entrée:',
    'source.structure': 'Structure',
    'source.changeFolder': 'Changer de Dossier',
    'source.dragTitle': 'Glissez ici le dossier du projet ou le fichier .index',
    'source.dragDesc': 'Le simulateur lit automatiquement le index.html et résout tous les fichiers CSS, JS et images locales sans rien envoyer aux serveurs externes.',
    'source.selectFolder': 'Sélectionner le Dossier Complet',
    'source.selectFile': 'Sélectionner un Fichier .index / HTML',
    'source.loadedFiles': 'Fichiers du Projet Chargé:',
    'source.clickHtmlTip': 'Cliquez sur n\'importe quel HTML pour en faire la vue active',
    'source.quickExamples': 'Exemples rapides:',
    'source.loadBtn': 'Charger dans le Simulateur',
    'source.urlPlaceholder': 'https://monsite.com ou http://localhost:3000',
    'source.images': '{n} Images',
    'source.scripts': '{n} Scripts',
    'sf.exit': 'Quitter (Éch)',
    'sf.hideBar': 'Masquer la Barre',
    'sf.showControls': 'Contrôles',
    'sf.capture': 'Capturer',
    'sf.export': 'Exporter',
    'sf.reload': 'Actualiser',
    'sf.frameOn': 'Cadre ON',
    'sf.frameOff': 'Cadre OFF',
    'sf.viewDesktop': 'Voir Bureau',
    'sf.viewMobile': 'Voir Mobile',
    'sf.switchTo': 'Passer à {mode}',
    'sf.deviceTitle': 'Cliquer pour changer d\'appareil',
    'sf.zoomIn': 'Zoom avant',
    'sf.zoomOut': 'Zoom arrière',
    'sf.zoomReset': 'Réinitialiser le Zoom',
    'sf.orientation': 'Changer Orientation (Portrait / Paysage)',
    'sf.portrait': 'portrait',
    'sf.landscape': 'paysage',
    'sf.reloadLive': 'Recharger les modifications du disque en direct (F5 / Ctrl+R)',
    'sf.autoSyncOn': '⚡ Auto-Sync ON',
    'sf.autoSyncOff': 'Auto-Sync OFF',
    'frame.reload': 'Recharger la vue (F5 / Ctrl+R)',
    'frame.reloadLive': 'Recharger les modifications du disque en direct (F5 / Ctrl+R)',
    'frame.openExternal': 'Ouvrir l\'URL dans un nouvel onglet',
    'frame.zoomIn': 'Zoom avant',
    'frame.zoomOut': 'Zoom arrière',
    'frame.rotateTo': 'Passer à {mode}',
    'frame.portrait': 'Portrait',
    'frame.landscape': 'Paysage',
    'export.title': 'Exporter la Capture d\'écran',
    'export.subtitle': 'Générez des images PNG ou JPG haute résolution de l\'appareil actif',
    'export.projectLabel': 'Titre du Projet ou Release:',
    'export.projectPlaceholder': 'Ex: Landing Page TechStore - Sprint 14',
    'export.formatLabel': 'Format du Fichier:',
    'export.pngDesc': 'Sans perte, netteté maximale',
    'export.jpgDesc': 'Compact, idéal pour le web',
    'export.qualityLabel': 'Qualité JPEG:',
    'export.qualityHint': '90-95% offre le parfait équilibre entre netteté graphique et légèreté de téléchargement.',
    'export.bgLabel': 'Fond de la Bannière Comparative:',
    'export.bgLight': 'Clair',
    'export.bgSlate': 'Ardoise',
    'export.bgDark': 'Sombre',
    'export.deviceIdLabel': 'Identifiant des Appareils',
    'export.deviceIdHint': 'Affiche des tags avec résolution et horodatage',
    'export.downloadMobile': 'Télécharger Mobile Seul',
    'export.downloadDesktop': 'Télécharger Bureau Seul',
    'export.copy': 'Copier l\'Image',
    'export.copied': 'Copié!',
    'export.download': 'Télécharger l\'Image',
    'export.resolution': 'Résolution:',
    'export.estimatedSize': 'Taille estimée:',
    'export.loadingPreview': 'Chargement de l\'aperçu...',
    'editor.title': 'Éditeur de Code HTML & CSS',
    'editor.templates': 'Modèles:',
    'editor.addMediaQuery': '+ Media Query',
    'editor.copy': 'Copier',
    'editor.copied': 'Copié!',
    'editor.placeholder': 'Collez votre code HTML avec les balises <style> ici...',
    'editor.livePreview': 'Aperçu HTML/CSS en direct',
    'bp.label': 'Points d\'arrêt Rapides:',
    'bp.scale': 'Échelle:',
    'bp.resetZoom': 'Réinitialiser le Zoom',
    'app.capturing': 'Génération de la capture d\'écran…',
    'app.captureSuccess': '✅ Capture PNG ({name}) téléchargée!',
    'app.captureError': 'Une erreur s\'est produite lors de la capture.',
    'app.captureNotFound': 'Élément d\'appareil introuvable pour la capture.',
    'app.exporting': 'Génération de l\'export complet…',
    'app.exportSuccess': '✅ Export PNG ({name}) téléchargé!',
    'app.exportError': 'Échec de la génération de l\'export.',
    'app.exportNotFound': 'Élément d\'appareil introuvable pour l\'export.',
    'app.templateLoaded': 'Modèle "{name}" chargé.',
    'app.urlLoading': 'Chargement de l\'URL: {url}',
    'app.folderLoaded': 'Dossier "{name}" chargé! {n} fichiers mappés.',
    'app.folderError': 'Erreur: {msg}',
    'app.zoomReset': 'Échelle réinitialisée par défaut.',
    'app.deviceMobile': 'Appareil mobile: {name}',
    'app.deviceDesktop': 'Appareil bureau: {name}',
    'app.sfDevice': 'Super Focus: {name}',
    'app.entryChanged': 'Fichier d\'entrée changé pour "{name}"',
    'app.entryError': 'Erreur lors du changement de fichier: {err}',
    'app.linkProtected': 'Lien local "{href}" protégé contre la redirection.',
    'app.bpMobile': 'Mobile réglé à {w}px ({label})',
    'app.bpDesktop': 'Bureau réglé à {w}px ({label})',
  },
};
