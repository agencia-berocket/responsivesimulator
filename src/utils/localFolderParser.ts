export interface ProjectFile {
  name: string;
  relativePath: string;
  size: number;
  type: string;
  blobUrl?: string;
  file: File;
  extension: string;
  lastModified?: number;
}

export interface ParsedProject {
  folderName: string;
  entryFileName: string;
  entryHtmlFile: ProjectFile | null;
  files: ProjectFile[];
  resolvedHtml: string;
  totalFiles: number;
  totalSize: number;
  dirHandle?: any;
  isLiveConnected?: boolean;
  lastReloadTime?: number;
  cssCount?: number;
  jsCount?: number;
  imageCount?: number;
}

/**
 * Normaliza caminhos relativos de arquivos (converte \ para /, remove ./ ou / inicial)
 */
function normalizePath(p: string): string {
  return p.replace(/\\/g, '/').replace(/^(\.\/|\/)/, '').trim();
}

/**
 * Obtém a extensão de um arquivo em minúsculo sem o ponto
 */
function getExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length <= 1) return '';
  return parts.pop()?.toLowerCase() || '';
}

/**
 * Resolve caminho relativo baseado no diretório atual
 */
function resolveRelativePath(baseDir: string, relativePath: string): string {
  const cleanRelative = normalizePath(relativePath);
  if (!baseDir) return cleanRelative;

  const baseParts = baseDir.split('/').filter(Boolean);
  const relativeParts = cleanRelative.split('/').filter(Boolean);

  for (const part of relativeParts) {
    if (part === '.') {
      continue;
    } else if (part === '..') {
      baseParts.pop();
    } else {
      baseParts.push(part);
    }
  }

  return baseParts.join('/');
}

/**
 * Processa arquivos selecionados de uma pasta ou arquivo index avulso,
 * mapeia assets e reescreve links relativos no HTML para Blob URLs
 */
export async function parseLocalFiles(
  fileList: FileList | File[]
): Promise<ParsedProject> {
  const filesArray: File[] = Array.from(fileList);
  if (filesArray.length === 0) {
    throw new Error('Nenhum arquivo foi selecionado.');
  }

  const projectFiles: ProjectFile[] = [];
  const pathToBlobUrlMap = new Map<string, string>();
  let totalSize = 0;

  // 1. Identificar pasta raiz se houver webkitRelativePath
  let detectedFolderName = 'Pasta Local';
  if (filesArray[0].webkitRelativePath) {
    const rootName = filesArray[0].webkitRelativePath.split('/')[0];
    if (rootName) detectedFolderName = rootName;
  } else if (filesArray.length === 1) {
    detectedFolderName = filesArray[0].name;
  }

  // 2. Mapear todos os arquivos com caminhos normalizados
  for (const file of filesArray) {
    totalSize += file.size;
    let relPath = file.name;

    if (file.webkitRelativePath) {
      // Remove o nome da pasta raiz inicial para ter o caminho a partir da raiz do projeto
      const segments = file.webkitRelativePath.split('/');
      if (segments.length > 1) {
        relPath = segments.slice(1).join('/');
      } else {
        relPath = file.name;
      }
    }

    const cleanPath = normalizePath(relPath);
    const ext = getExtension(file.name);
    const blobUrl = URL.createObjectURL(file);

    const projectFile: ProjectFile = {
      name: file.name,
      relativePath: cleanPath,
      size: file.size,
      type: file.type || 'application/octet-stream',
      blobUrl,
      file,
      extension: ext,
      lastModified: file.lastModified,
    };

    projectFiles.push(projectFile);

    // Mapeia chaves de busca para resolução flexível
    pathToBlobUrlMap.set(cleanPath, blobUrl);
    pathToBlobUrlMap.set('/' + cleanPath, blobUrl);
    pathToBlobUrlMap.set('./' + cleanPath, blobUrl);
    // Também mapeia pelo nome do arquivo sozinho
    if (!pathToBlobUrlMap.has(file.name)) {
      pathToBlobUrlMap.set(file.name, blobUrl);
    }
  }

  // 3. Localizar o arquivo de entrada principal (index.html ou .index)
  let entryFile: ProjectFile | null = null;

  // Regra 1: se for apenas 1 arquivo selecionado diretamente
  if (projectFiles.length === 1) {
    entryFile = projectFiles[0];
  } else {
    // Procura na raiz primeiro por index.html ou index.htm
    entryFile =
      projectFiles.find(
        (f) =>
          f.relativePath.toLowerCase() === 'index.html' ||
          f.relativePath.toLowerCase() === 'index.htm'
      ) || null;

    // Procura por arquivo com extensão .index ou contendo "index"
    if (!entryFile) {
      entryFile =
        projectFiles.find((f) => {
          const lower = f.name.toLowerCase();
          return (
            lower.endsWith('.index') ||
            lower.includes('index.') ||
            lower === 'index'
          );
        }) || null;
    }

    // Procura qualquer arquivo .html na raiz
    if (!entryFile) {
      entryFile =
        projectFiles.find(
          (f) => !f.relativePath.includes('/') && f.extension === 'html'
        ) || null;
    }

    // Procura qualquer arquivo .html em qualquer lugar
    if (!entryFile) {
      entryFile =
        projectFiles.find((f) => f.extension === 'html' || f.extension === 'htm') ||
        null;
    }

    // Fallback: primeiro arquivo da lista
    if (!entryFile && projectFiles.length > 0) {
      entryFile = projectFiles[0];
    }
  }

  if (!entryFile) {
    throw new Error('Não foi possível identificar o arquivo de entrada do projeto.');
  }

  // 4. Se houver CSS, resolver referências url(...) dentro deles
  const cssFiles = projectFiles.filter((f) => f.extension === 'css');
  for (const cssFile of cssFiles) {
    try {
      const text = await cssFile.file.text();
      const cssBaseDir = cssFile.relativePath.includes('/')
        ? cssFile.relativePath.substring(0, cssFile.relativePath.lastIndexOf('/'))
        : '';

      const resolvedCss = text.replace(
        /url\(\s*(['"]?)([^'")]+)\1\s*\)/gi,
        (match, quote, assetPath) => {
          if (
            assetPath.startsWith('http://') ||
            assetPath.startsWith('https://') ||
            assetPath.startsWith('data:') ||
            assetPath.startsWith('blob:') ||
            assetPath.startsWith('//')
          ) {
            return match;
          }

          const targetPath = resolveRelativePath(cssBaseDir, assetPath);
          const mappedBlob =
            pathToBlobUrlMap.get(targetPath) ||
            pathToBlobUrlMap.get(normalizePath(assetPath)) ||
            pathToBlobUrlMap.get(assetPath.split('/').pop() || '');

          if (mappedBlob) {
            return `url("${mappedBlob}")`;
          }
          return match;
        }
      );

      // Substitui o Blob URL deste CSS pelo novo conteúdo modificado
      const newBlob = new Blob([resolvedCss], { type: 'text/css' });
      const newUrl = URL.createObjectURL(newBlob);
      cssFile.blobUrl = newUrl;
      pathToBlobUrlMap.set(cssFile.relativePath, newUrl);
      pathToBlobUrlMap.set('/' + cssFile.relativePath, newUrl);
      pathToBlobUrlMap.set('./' + cssFile.relativePath, newUrl);
      pathToBlobUrlMap.set(cssFile.name, newUrl);
    } catch {
      // Continua se falhar o parse de um CSS individual
    }
  }

  // 5. Ler o arquivo HTML de entrada e resolver links de assets
  let rawHtml = '';
  try {
    rawHtml = await entryFile.file.text();
  } catch (err) {
    throw new Error(`Falha ao ler o arquivo ${entryFile.name}: ${String(err)}`);
  }

  const htmlBaseDir = entryFile.relativePath.includes('/')
    ? entryFile.relativePath.substring(0, entryFile.relativePath.lastIndexOf('/'))
    : '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');

  // Função auxiliar para substituir caminho por BlobUrl
  const resolveAttr = (attrVal: string | null): string | null => {
    if (!attrVal) return null;
    const trimmed = attrVal.trim();
    if (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('data:') ||
      trimmed.startsWith('blob:') ||
      trimmed.startsWith('//') ||
      trimmed.startsWith('#') ||
      trimmed.startsWith('mailto:') ||
      trimmed.startsWith('tel:') ||
      trimmed.startsWith('javascript:')
    ) {
      return null;
    }

    const targetPath = resolveRelativePath(htmlBaseDir, trimmed);
    const mapped =
      pathToBlobUrlMap.get(targetPath) ||
      pathToBlobUrlMap.get(normalizePath(trimmed)) ||
      pathToBlobUrlMap.get(trimmed.split('/').pop() || '');

    return mapped || null;
  };

  // Reescrever links (CSS, favicons)
  const links = doc.querySelectorAll('link[href]');
  links.forEach((link) => {
    const orig = link.getAttribute('href');
    const resolved = resolveAttr(orig);
    if (resolved) link.setAttribute('href', resolved);
  });

  // Reescrever scripts
  const scripts = doc.querySelectorAll('script[src]');
  scripts.forEach((script) => {
    const orig = script.getAttribute('src');
    const resolved = resolveAttr(orig);
    if (resolved) script.setAttribute('src', resolved);
  });

  // Reescrever imagens
  const images = doc.querySelectorAll('img[src]');
  images.forEach((img) => {
    const orig = img.getAttribute('src');
    const resolved = resolveAttr(orig);
    if (resolved) img.setAttribute('src', resolved);
  });

  // Reescrever links de navegação <a href> para apontar para BlobUrls locais se existirem
  const anchors = doc.querySelectorAll('a[href]');
  anchors.forEach((a) => {
    const orig = a.getAttribute('href');
    if (orig) {
      const resolved = resolveAttr(orig);
      if (resolved) {
        a.setAttribute('href', resolved);
      }
    }
  });

  // Reescrever sources (picture, video, audio)
  const sources = doc.querySelectorAll('source[src], source[srcset], video[src], audio[src], video[poster]');
  sources.forEach((el) => {
    if (el.hasAttribute('src')) {
      const res = resolveAttr(el.getAttribute('src'));
      if (res) el.setAttribute('src', res);
    }
    if (el.hasAttribute('poster')) {
      const res = resolveAttr(el.getAttribute('poster'));
      if (res) el.setAttribute('poster', res);
    }
  });

  // Reescrever backgrounds inline style
  const elementsWithStyle = doc.querySelectorAll('[style*="url"]');
  elementsWithStyle.forEach((el) => {
    const styleVal = el.getAttribute('style') || '';
    const updatedStyle = styleVal.replace(
      /url\(\s*(['"]?)([^'")]+)\1\s*\)/gi,
      (match, quote, assetPath) => {
        const resolved = resolveAttr(assetPath);
        return resolved ? `url("${resolved}")` : match;
      }
    );
    el.setAttribute('style', updatedStyle);
  });

  // Reescrever tags <style> internas
  const styleTags = doc.querySelectorAll('style');
  styleTags.forEach((st) => {
    const content = st.textContent || '';
    const updated = content.replace(
      /url\(\s*(['"]?)([^'")]+)\1\s*\)/gi,
      (match, quote, assetPath) => {
        const resolved = resolveAttr(assetPath);
        return resolved ? `url("${resolved}")` : match;
      }
    );
    st.textContent = updated;
  });

  // Adicionar meta viewport se não tiver, garantindo responsividade precisa no iframe
  if (!doc.querySelector('meta[name="viewport"]')) {
    const meta = doc.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0';
    doc.head?.appendChild(meta);
  }

  // Injetar script de proteção para evitar que cliques ou redirecionamentos recarreguem a aplicação host
  const guardScript = doc.createElement('script');
  guardScript.id = '__responsive_preview_guard__';
  guardScript.textContent = `
    (function() {
      try {
        window.location.reload = function() {
          console.log('[Preview] Recarregamento capturado no simulador.');
        };
      } catch(e) {}

      document.addEventListener('click', function(e) {
        var a = e.target && e.target.closest ? e.target.closest('a') : null;
        if (!a) return;
        var href = a.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

        // Se for link externo (http/https), abre em nova aba
        if (href.startsWith('http://') || href.startsWith('https://')) {
          e.preventDefault();
          window.open(href, '_blank', 'noopener,noreferrer');
          return;
        }

        // Se for link relativo não resolvido para blob, previne navegação acidental para a aplicação host
        if (!href.startsWith('blob:')) {
          e.preventDefault();
          e.stopPropagation();
          try {
            window.parent.postMessage({ type: 'LOCAL_NAVIGATE', href: href }, '*');
          } catch(err) {}
        }
      }, true);

      document.addEventListener('submit', function(e) {
        e.preventDefault();
      }, true);
    })();
  `;
  doc.head?.appendChild(guardScript);

  const finalHtml = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;

  const cssCount = projectFiles.filter((f) => f.extension === 'css').length;
  const jsCount = projectFiles.filter((f) =>
    ['js', 'mjs', 'ts', 'jsx', 'tsx'].includes(f.extension)
  ).length;
  const imageCount = projectFiles.filter((f) =>
    ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif', 'ico', 'avif'].includes(f.extension)
  ).length;

  return {
    folderName: detectedFolderName,
    entryFileName: entryFile.name,
    entryHtmlFile: entryFile,
    files: projectFiles,
    resolvedHtml: finalHtml,
    totalFiles: projectFiles.length,
    totalSize,
    cssCount,
    jsCount,
    imageCount,
    lastReloadTime: Date.now(),
  };
}

/**
 * Verifica se a API moderna File System Access está disponível no navegador
 */
export function isFileSystemAccessSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof (window as any).showDirectoryPicker === 'function'
  );
}

/**
 * Lê recursivamente todas as entradas de um FileSystemDirectoryHandle
 */
export async function readDirectoryHandleRecursive(
  dirHandle: any,
  basePath = ''
): Promise<File[]> {
  const files: File[] = [];
  for await (const entry of dirHandle.values()) {
    if (entry.kind === 'file') {
      try {
        const file = await entry.getFile();
        const relPath = basePath ? `${basePath}/${entry.name}` : entry.name;
        try {
          Object.defineProperty(file, 'webkitRelativePath', {
            value: relPath,
            writable: true,
            configurable: true,
          });
        } catch {
          // Mantém o arquivo como está se a propriedade for restrita
        }
        files.push(file);
      } catch (err) {
        console.warn(`Não foi possível ler arquivo ${entry.name}:`, err);
      }
    } else if (entry.kind === 'directory') {
      try {
        const subFiles = await readDirectoryHandleRecursive(
          entry,
          basePath ? `${basePath}/${entry.name}` : entry.name
        );
        files.push(...subFiles);
      } catch (err) {
        console.warn(`Não foi possível ler subdiretório ${entry.name}:`, err);
      }
    }
  }
  return files;
}

/**
 * Carrega ou recarrega um projeto diretamente de um FileSystemDirectoryHandle (ao vivo do disco)
 */
export async function parseDirectoryHandle(
  dirHandle: any,
  preferredEntryFileName?: string
): Promise<ParsedProject> {
  const files = await readDirectoryHandleRecursive(dirHandle);
  const parsed = await parseLocalFiles(files);
  parsed.dirHandle = dirHandle;
  parsed.isLiveConnected = true;
  if (dirHandle.name) {
    parsed.folderName = dirHandle.name;
  }

  // Se o usuário já tinha uma página selecionada (ex: sobre.html), mantém ela
  if (preferredEntryFileName) {
    const match = parsed.files.find(
      (f) =>
        f.name.toLowerCase() === preferredEntryFileName.toLowerCase() ||
        f.relativePath.toLowerCase() === preferredEntryFileName.toLowerCase()
    );
    if (match && (match.extension === 'html' || match.extension === 'htm')) {
      const reResolved = await resolveHtmlForEntryFile(match, parsed.files);
      parsed.entryFileName = match.name;
      parsed.entryHtmlFile = match;
      parsed.resolvedHtml = reResolved;
    }
  }

  return parsed;
}

/**
 * Resolve o HTML e links de assets para um arquivo HTML específico dentre os arquivos do projeto
 */
export async function resolveHtmlForEntryFile(
  entryFile: ProjectFile,
  allFiles: ProjectFile[]
): Promise<string> {
  const pathToBlobUrlMap = new Map<string, string>();
  for (const f of allFiles) {
    if (f.blobUrl) {
      pathToBlobUrlMap.set(f.relativePath, f.blobUrl);
      pathToBlobUrlMap.set('/' + f.relativePath, f.blobUrl);
      pathToBlobUrlMap.set('./' + f.relativePath, f.blobUrl);
      if (!pathToBlobUrlMap.has(f.name)) {
        pathToBlobUrlMap.set(f.name, f.blobUrl);
      }
    }
  }

  const rawHtml = await entryFile.file.text();
  const htmlBaseDir = entryFile.relativePath.includes('/')
    ? entryFile.relativePath.substring(0, entryFile.relativePath.lastIndexOf('/'))
    : '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');

  const resolveAttr = (attrVal: string | null): string | null => {
    if (!attrVal) return null;
    const trimmed = attrVal.trim();
    if (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('data:') ||
      trimmed.startsWith('blob:') ||
      trimmed.startsWith('//') ||
      trimmed.startsWith('#') ||
      trimmed.startsWith('mailto:') ||
      trimmed.startsWith('tel:') ||
      trimmed.startsWith('javascript:')
    ) {
      return null;
    }

    const targetPath = resolveRelativePath(htmlBaseDir, trimmed);
    const mapped =
      pathToBlobUrlMap.get(targetPath) ||
      pathToBlobUrlMap.get(normalizePath(trimmed)) ||
      pathToBlobUrlMap.get(trimmed.split('/').pop() || '');

    return mapped || null;
  };

  doc.querySelectorAll('link[href]').forEach((link) => {
    const orig = link.getAttribute('href');
    const res = resolveAttr(orig);
    if (res) link.setAttribute('href', res);
  });

  doc.querySelectorAll('script[src]').forEach((s) => {
    const orig = s.getAttribute('src');
    const res = resolveAttr(orig);
    if (res) s.setAttribute('src', res);
  });

  doc.querySelectorAll('img[src]').forEach((img) => {
    const orig = img.getAttribute('src');
    const res = resolveAttr(orig);
    if (res) img.setAttribute('src', res);
  });

  doc.querySelectorAll('a[href]').forEach((a) => {
    const orig = a.getAttribute('href');
    if (orig) {
      const res = resolveAttr(orig);
      if (res) a.setAttribute('href', res);
    }
  });

  doc.querySelectorAll('source[src], source[srcset], video[src], audio[src], video[poster]').forEach((el) => {
    if (el.hasAttribute('src')) {
      const res = resolveAttr(el.getAttribute('src'));
      if (res) el.setAttribute('src', res);
    }
    if (el.hasAttribute('poster')) {
      const res = resolveAttr(el.getAttribute('poster'));
      if (res) el.setAttribute('poster', res);
    }
  });

  doc.querySelectorAll('[style*="url"]').forEach((el) => {
    const styleVal = el.getAttribute('style') || '';
    const updated = styleVal.replace(
      /url\(\s*(['"]?)([^'")]+)\1\s*\)/gi,
      (match, quote, assetPath) => {
        const resolved = resolveAttr(assetPath);
        return resolved ? `url("${resolved}")` : match;
      }
    );
    el.setAttribute('style', updated);
  });

  doc.querySelectorAll('style').forEach((st) => {
    const content = st.textContent || '';
    const updated = content.replace(
      /url\(\s*(['"]?)([^'")]+)\1\s*\)/gi,
      (match, quote, assetPath) => {
        const resolved = resolveAttr(assetPath);
        return resolved ? `url("${resolved}")` : match;
      }
    );
    st.textContent = updated;
  });

  if (!doc.querySelector('meta[name="viewport"]')) {
    const meta = doc.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0';
    doc.head?.appendChild(meta);
  }

  const guardScript = doc.createElement('script');
  guardScript.id = '__responsive_preview_guard__';
  guardScript.textContent = `
    (function() {
      try {
        window.location.reload = function() {
          console.log('[Preview] Recarregamento capturado no simulador.');
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
  doc.head?.appendChild(guardScript);

  return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
}

/**
 * Atualiza um único arquivo (por exemplo index.html ou style.css) no projeto existente
 * sem precisar selecionar a pasta inteira novamente
 */
export async function updateProjectWithSingleFile(
  currentProject: ParsedProject,
  newFile: File
): Promise<ParsedProject> {
  const newBlobUrl = URL.createObjectURL(newFile);
  const ext = getExtension(newFile.name);

  // Encontra o arquivo existente no projeto que tem o mesmo nome
  const updatedFiles = currentProject.files.map((f) => {
    if (f.name.toLowerCase() === newFile.name.toLowerCase()) {
      if (f.blobUrl) {
        try {
          URL.revokeObjectURL(f.blobUrl);
        } catch {}
      }
      return {
        ...f,
        file: newFile,
        size: newFile.size,
        blobUrl: newBlobUrl,
        extension: ext,
        lastModified: newFile.lastModified,
      };
    }
    return f;
  });

  // Se não existia, adiciona como novo
  const exists = updatedFiles.some(
    (f) => f.name.toLowerCase() === newFile.name.toLowerCase()
  );
  if (!exists) {
    updatedFiles.push({
      name: newFile.name,
      relativePath: newFile.name,
      size: newFile.size,
      type: newFile.type || 'application/octet-stream',
      blobUrl: newBlobUrl,
      file: newFile,
      extension: ext,
      lastModified: newFile.lastModified,
    });
  }

  // Determina o arquivo de entrada
  let entryFile =
    updatedFiles.find((f) => f.name === currentProject.entryFileName) ||
    updatedFiles.find(
      (f) => f.name.toLowerCase() === 'index.html' || f.name.toLowerCase() === 'index.htm'
    ) ||
    updatedFiles.find((f) => f.extension === 'html' || f.extension === 'htm') ||
    updatedFiles[0];

  const resolvedHtml = await resolveHtmlForEntryFile(entryFile, updatedFiles);

  return {
    ...currentProject,
    files: updatedFiles,
    entryFileName: entryFile.name,
    entryHtmlFile: entryFile,
    resolvedHtml,
    lastReloadTime: Date.now(),
  };
}

/**
 * Formata bytes em formato legível (KB, MB)
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
