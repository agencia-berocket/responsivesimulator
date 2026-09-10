import { TemplateSite } from '../types';

export const BUILTIN_TEMPLATES: TemplateSite[] = [
  {
    id: 'ecommerce',
    name: 'Loja Virtual (TechStore)',
    category: 'E-commerce',
    description: 'Grid responsivo de produtos, menu adaptativo e barra de compra fixa no mobile.',
    html: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TechStore - Acessórios Premium</title>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-neutral-50 text-neutral-900 antialiased pb-20 md:pb-8">

  <!-- Top Banner de Frete -->
  <div class="bg-indigo-600 text-white text-xs font-medium py-2 px-4 text-center">
    ⚡ Frete Grátis para todo o Brasil acima de R$ 199 • Parcele em até 10x sem juros
  </div>

  <!-- Navbar Responsiva -->
  <header class="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <button class="md:hidden p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">T</div>
          <span class="font-bold text-lg tracking-tight text-neutral-900">TechStore</span>
        </div>
      </div>

      <!-- Nav Desktop -->
      <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
        <a href="#produtos" class="text-indigo-600 font-semibold">Destaques</a>
        <a href="#audio" class="hover:text-neutral-900 transition-colors">Áudio & Fones</a>
        <a href="#wearables" class="hover:text-neutral-900 transition-colors">Smartwatches</a>
        <a href="#acessorios" class="hover:text-neutral-900 transition-colors">Carregadores</a>
      </nav>

      <!-- Ações do Usuário -->
      <div class="flex items-center gap-3">
        <div class="relative hidden sm:block w-48 lg:w-64">
          <input type="text" placeholder="Buscar produtos..." class="w-full bg-neutral-100 border-none rounded-full py-1.5 pl-8 pr-3 text-xs focus:ring-2 focus:ring-indigo-500">
          <svg class="w-4 h-4 text-neutral-400 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>
        <button class="relative p-2 text-neutral-700 hover:text-indigo-600 rounded-full hover:bg-neutral-100 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          <span class="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">3</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Hero Banner -->
  <section class="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
    <div class="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-2xl p-6 sm:p-12 relative overflow-hidden shadow-lg">
      <div class="relative z-10 max-w-xl">
        <span class="inline-block bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs px-3 py-1 rounded-full font-semibold mb-3">Lançamento Exclusivo</span>
        <h1 class="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-3">
          Som Imersivo.<br class="hidden sm:inline"> Design Ultraleve.
        </h1>
        <p class="text-neutral-300 text-xs sm:text-base mb-6 max-w-md">
          Experimente o novo fone Pro Wireless com cancelamento ativo de ruído em até 42dB e 40h de autonomia.
        </p>
        <div class="flex flex-col sm:flex-row gap-3">
          <button class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md">
            Comprar Agora • R$ 489
          </button>
          <button class="bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-all border border-white/15">
            Ver Ficha Técnica
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Grid de Produtos Responsivo (1 col mobile, 2 col tablet, 4 col desktop) -->
  <main id="produtos" class="max-w-6xl mx-auto px-4 sm:px-6 py-4">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-lg sm:text-2xl font-bold text-neutral-900">Mais Vendidos da Semana</h2>
        <p class="text-neutral-500 text-xs sm:text-sm">Adaptado para visualização em todos os tamanhos</p>
      </div>
      <div class="hidden sm:flex gap-2">
        <span class="text-xs bg-neutral-200 text-neutral-700 px-2.5 py-1 rounded-md font-medium">Todos</span>
        <span class="text-xs text-neutral-500 hover:bg-neutral-100 px-2.5 py-1 rounded-md font-medium cursor-pointer">Fones</span>
        <span class="text-xs text-neutral-500 hover:bg-neutral-100 px-2.5 py-1 rounded-md font-medium cursor-pointer">Hubs USB</span>
      </div>
    </div>

    <!-- Grid 1 coluna em celular, 2 em tablet, 3 em laptop, 4 em desktop -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      
      <!-- Produto 1 -->
      <div class="bg-white rounded-2xl border border-neutral-200 p-4 flex flex-col justify-between hover:shadow-md transition-shadow group">
        <div>
          <div class="w-full h-44 bg-neutral-100 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
            <span class="text-4xl group-hover:scale-110 transition-transform">🎧</span>
            <span class="absolute top-2 left-2 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">-25% OFF</span>
          </div>
          <p class="text-neutral-400 text-[11px] font-medium uppercase tracking-wider">Áudio Hi-Res</p>
          <h3 class="font-semibold text-neutral-900 text-sm mt-0.5 group-hover:text-indigo-600 transition-colors">Headphone NoiseCancel Elite</h3>
          <div class="flex items-center gap-1 my-1.5">
            <span class="text-amber-400 text-xs">★★★★★</span>
            <span class="text-neutral-400 text-[11px]">(142)</span>
          </div>
        </div>
        <div class="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <span class="text-xs text-neutral-400 line-through">R$ 599</span>
            <p class="font-bold text-neutral-900 text-base">R$ 449,00</p>
          </div>
          <button class="bg-neutral-900 hover:bg-indigo-600 text-white p-2.5 rounded-xl transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          </button>
        </div>
      </div>

      <!-- Produto 2 -->
      <div class="bg-white rounded-2xl border border-neutral-200 p-4 flex flex-col justify-between hover:shadow-md transition-shadow group">
        <div>
          <div class="w-full h-44 bg-neutral-100 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
            <span class="text-4xl group-hover:scale-110 transition-transform">⌚</span>
            <span class="absolute top-2 left-2 bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded">NOVO</span>
          </div>
          <p class="text-neutral-400 text-[11px] font-medium uppercase tracking-wider">Wearables</p>
          <h3 class="font-semibold text-neutral-900 text-sm mt-0.5 group-hover:text-indigo-600 transition-colors">Smartwatch Pulse GPS 2</h3>
          <div class="flex items-center gap-1 my-1.5">
            <span class="text-amber-400 text-xs">★★★★☆</span>
            <span class="text-neutral-400 text-[11px]">(88)</span>
          </div>
        </div>
        <div class="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <p class="font-bold text-neutral-900 text-base">R$ 699,00</p>
          </div>
          <button class="bg-neutral-900 hover:bg-indigo-600 text-white p-2.5 rounded-xl transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          </button>
        </div>
      </div>

      <!-- Produto 3 -->
      <div class="bg-white rounded-2xl border border-neutral-200 p-4 flex flex-col justify-between hover:shadow-md transition-shadow group">
        <div>
          <div class="w-full h-44 bg-neutral-100 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
            <span class="text-4xl group-hover:scale-110 transition-transform">⚡</span>
          </div>
          <p class="text-neutral-400 text-[11px] font-medium uppercase tracking-wider">Carregamento</p>
          <h3 class="font-semibold text-neutral-900 text-sm mt-0.5 group-hover:text-indigo-600 transition-colors">Carregador GaN 65W Triplo</h3>
          <div class="flex items-center gap-1 my-1.5">
            <span class="text-amber-400 text-xs">★★★★★</span>
            <span class="text-neutral-400 text-[11px]">(310)</span>
          </div>
        </div>
        <div class="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <span class="text-xs text-neutral-400 line-through">R$ 219</span>
            <p class="font-bold text-neutral-900 text-base">R$ 169,00</p>
          </div>
          <button class="bg-neutral-900 hover:bg-indigo-600 text-white p-2.5 rounded-xl transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          </button>
        </div>
      </div>

      <!-- Produto 4 -->
      <div class="bg-white rounded-2xl border border-neutral-200 p-4 flex flex-col justify-between hover:shadow-md transition-shadow group">
        <div>
          <div class="w-full h-44 bg-neutral-100 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
            <span class="text-4xl group-hover:scale-110 transition-transform">⌨️</span>
          </div>
          <p class="text-neutral-400 text-[11px] font-medium uppercase tracking-wider">Produtividade</p>
          <h3 class="font-semibold text-neutral-900 text-sm mt-0.5 group-hover:text-indigo-600 transition-colors">Teclado Mecânico Wireless 75%</h3>
          <div class="flex items-center gap-1 my-1.5">
            <span class="text-amber-400 text-xs">★★★★★</span>
            <span class="text-neutral-400 text-[11px]">(94)</span>
          </div>
        </div>
        <div class="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <p class="font-bold text-neutral-900 text-base">R$ 389,00</p>
          </div>
          <button class="bg-neutral-900 hover:bg-indigo-600 text-white p-2.5 rounded-xl transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          </button>
        </div>
      </div>

    </div>
  </main>

  <!-- Barra de Ação Mobile Fixa na parte inferior (visível apenas em telas menores) -->
  <div class="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-3 px-4 flex items-center justify-between z-30 shadow-lg">
    <div>
      <span class="text-[10px] text-neutral-400 uppercase font-semibold">Total no Carrinho</span>
      <p class="text-sm font-bold text-neutral-900">R$ 449,00 (1 item)</p>
    </div>
    <button class="bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-sm">
      Finalizar Compra
    </button>
  </div>

</body>
</html>`
  },
  {
    id: 'saas-landing',
    name: 'SaaS / Landing Page (CloudFlow)',
    category: 'Landing Page',
    description: 'Hero moderno com CTA empilhável no mobile e tabela comparativa de planos em 3 colunas.',
    html: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CloudFlow - Automação Inteligente para Devs</title>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-neutral-950 text-neutral-100 antialiased selection:bg-cyan-500 selection:text-neutral-950">

  <!-- Nav -->
  <nav class="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between border-b border-neutral-800">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-sm">⚡</div>
      <span class="font-bold text-lg tracking-tight">CloudFlow</span>
    </div>
    <div class="hidden md:flex items-center gap-8 text-sm text-neutral-400 font-medium">
      <a href="#features" class="hover:text-white transition-colors">Recursos</a>
      <a href="#precos" class="hover:text-white transition-colors">Planos & Preços</a>
      <a href="#docs" class="hover:text-white transition-colors">Documentação</a>
    </div>
    <div class="flex items-center gap-3">
      <a href="#" class="text-xs sm:text-sm text-neutral-300 hover:text-white px-3 py-1.5 font-medium">Entrar</a>
      <a href="#" class="bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm transition-colors shadow-sm">Criar Conta</a>
    </div>
  </nav>

  <!-- Hero Section -->
  <header class="max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 text-center">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-medium mb-6">
      <span>🚀 v2.4 Lançada com Deploy Instantâneo</span>
    </div>
    <h1 class="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
      Gerencie sua infraestrutura <br class="hidden sm:inline">
      <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">sem dores de cabeça.</span>
    </h1>
    <p class="text-neutral-400 text-sm sm:text-lg max-w-2xl mx-auto mb-8">
      Automatize CI/CD, balanceamento de carga e monitoramento em tempo real com pipelines declarativas e zero configuração manual.
    </p>

    <!-- CTAs adaptáveis -->
    <div class="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
      <button class="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold px-7 py-3 rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20">
        Começar Grátis (14 dias)
      </button>
      <button class="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-medium px-6 py-3 rounded-xl text-sm border border-neutral-800 transition-all">
        Agendar Demonstração
      </button>
    </div>
  </header>

  <!-- Tabela de Preços (1 coluna no mobile, 3 colunas no desktop) -->
  <section id="precos" class="max-w-6xl mx-auto px-4 sm:px-6 py-12">
    <div class="text-center mb-10">
      <h2 class="text-2xl sm:text-3xl font-bold">Planos Transparentes</h2>
      <p class="text-neutral-400 text-xs sm:text-sm mt-1">Escale conforme a necessidade da sua aplicação</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
      
      <!-- Plano Starter -->
      <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between">
        <div>
          <h3 class="font-bold text-lg text-white">Starter</h3>
          <p class="text-xs text-neutral-400 mt-1">Para desenvolvedores e projetos solo</p>
          <div class="my-4">
            <span class="text-3xl font-extrabold text-white">R$ 0</span>
            <span class="text-xs text-neutral-500">/mês para sempre</span>
          </div>
          <ul class="space-y-2 text-xs text-neutral-300">
            <li class="flex items-center gap-2">✓ 3 Projetos simultâneos</li>
            <li class="flex items-center gap-2">✓ 100 deploys mensais</li>
            <li class="flex items-center gap-2">✓ SSL automático</li>
          </ul>
        </div>
        <button class="w-full mt-6 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold">Iniciar Grátis</button>
      </div>

      <!-- Plano Pro (Destaque) -->
      <div class="bg-neutral-900 border-2 border-cyan-500 rounded-2xl p-6 flex flex-col justify-between relative shadow-xl shadow-cyan-500/10">
        <span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-neutral-950 text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full">Mais Escolhido</span>
        <div>
          <h3 class="font-bold text-lg text-white">Profissional</h3>
          <p class="text-xs text-neutral-400 mt-1">Para startups e equipes em rápido crescimento</p>
          <div class="my-4">
            <span class="text-3xl font-extrabold text-cyan-400">R$ 149</span>
            <span class="text-xs text-neutral-500">/mês</span>
          </div>
          <ul class="space-y-2 text-xs text-neutral-300">
            <li class="flex items-center gap-2">✓ Projetos Ilimitados</li>
            <li class="flex items-center gap-2">✓ Deploys ilimitados e sem filas</li>
            <li class="flex items-center gap-2">✓ Domínios customizados & CDN Global</li>
            <li class="flex items-center gap-2">✓ Suporte 24/7 via Slack</li>
          </ul>
        </div>
        <button class="w-full mt-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold transition-colors">Assinar Pro</button>
      </div>

      <!-- Plano Enterprise -->
      <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between">
        <div>
          <h3 class="font-bold text-lg text-white">Enterprise</h3>
          <p class="text-xs text-neutral-400 mt-1">Para operações críticas e compliance rigoroso</p>
          <div class="my-4">
            <span class="text-3xl font-extrabold text-white">Sob Medida</span>
          </div>
          <ul class="space-y-2 text-xs text-neutral-300">
            <li class="flex items-center gap-2">✓ SLA 99.99% garantido</li>
            <li class="flex items-center gap-2">✓ Instâncias dedicadas multi-região</li>
            <li class="flex items-center gap-2">✓ Auditoria SOC2 & SSO SAML</li>
          </ul>
        </div>
        <button class="w-full mt-6 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold">Falar com Consultor</button>
      </div>

    </div>
  </section>

</body>
</html>`
  },
  {
    id: 'editorial-blog',
    name: 'Portal Editorial / Artigo',
    category: 'Blog / Notícias',
    description: 'Layout magazine com leitura fluida no mobile e sidebar com índice de conteúdo no desktop.',
    html: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Design Systems Modernos em 2026</title>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .editorial-text { font-family: 'Newsreader', serif; }
  </style>
</head>
<body class="bg-stone-50 text-stone-900 antialiased">

  <nav class="border-b border-stone-200 bg-white">
    <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
      <span class="font-serif text-xl font-bold tracking-tight text-stone-900">THE CODE DISPATCH</span>
      <span class="text-xs text-stone-500 font-medium">Edição #142 • 2026</span>
    </div>
  </nav>

  <main class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
    <div class="max-w-3xl mb-8">
      <div class="flex items-center gap-2 text-xs text-amber-700 font-semibold uppercase tracking-wider mb-2">
        <span>Arquitetura de Front-end</span>
        <span>•</span>
        <span>6 min de leitura</span>
      </div>
      <h1 class="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 leading-tight">
        Como Testar a Responsividade Perfeita Entre Mobile e Telas Ultra-Wide
      </h1>
      <p class="text-stone-600 text-sm sm:text-lg mt-3">
        Descubra como os melhores times de produto estruturam breakpoints, evitam quebras visuais e garantem acessibilidade em qualquer densidade de pixels.
      </p>
    </div>

    <!-- Layout 2 colunas no desktop, 1 no mobile -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <!-- Artigo Principal -->
      <article class="lg:col-span-8 text-stone-800 text-base sm:text-lg leading-relaxed editorial-text">
        <div class="w-full h-56 sm:h-80 bg-stone-200 rounded-xl mb-6 flex items-center justify-center text-stone-400 font-sans text-sm">
          [ Imagem do Artigo: Ilustração de Dispositivos e Telas ]
        </div>

        <p class="mb-5">
          Com a proliferação de formatos — desde pequenos smartphones de 360px até monitores ultra-wide de 3440px —, testar websites apenas redimensionando a janela do navegador não é mais suficiente.
        </p>

        <h2 class="font-sans font-bold text-xl sm:text-2xl text-stone-900 mt-8 mb-3">
          1. O Problema da Densidade de Pixels (DPR)
        </h2>
        <p class="mb-5">
          Dispositivos móveis modernos operam frequentemente com Pixel Ratios de 2x ou 3x. Uma imagem com 400px de largura física requer 1200px reais de resolução gráfica para manter a nitidez sem pixelização.
        </p>

        <div class="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg my-6 font-sans text-xs sm:text-sm text-amber-900">
          <strong>Dica Pro:</strong> Ao tirar capturas de tela comparativas, sempre exporte com escala multiplicadora (2x retina) para não perder detalhes em revisões de design.
        </div>

        <h2 class="font-sans font-bold text-xl sm:text-2xl text-stone-900 mt-8 mb-3">
          2. Navegação Lateral vs. Barra Flutuante
        </h2>
        <p class="mb-5">
          Enquanto telas grandes se beneficiam de colunas laterais fixas que mantêm o contexto visual, smartphones exigem interfaces orientadas a toque com áreas seguras (safe areas) respeitando o notch e a barra de gestos.
        </p>
      </article>

      <!-- Sidebar no desktop -->
      <aside class="lg:col-span-4 space-y-6">
        <div class="bg-white border border-stone-200 rounded-xl p-5">
          <h3 class="font-sans font-bold text-sm text-stone-900 mb-3">Autor</h3>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-stone-300 flex items-center justify-center font-bold text-stone-700">GR</div>
            <div>
              <p class="text-xs font-semibold text-stone-900">Guilherme Ramos</p>
              <p class="text-[11px] text-stone-500">Tech Lead & UI Architect</p>
            </div>
          </div>
        </div>

        <div class="bg-stone-900 text-white rounded-xl p-5 text-center">
          <h4 class="font-sans font-bold text-sm mb-1">Boletim Semanal</h4>
          <p class="text-xs text-stone-400 mb-4">Receba análises de UX e código toda terça-feira.</p>
          <input type="email" placeholder="Seu melhor e-mail" class="w-full bg-stone-800 border border-stone-700 rounded-lg py-2 px-3 text-xs text-white mb-2">
          <button class="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2 rounded-lg text-xs">Inscrever-se</button>
        </div>
      </aside>

    </div>
  </main>

</body>
</html>`
  }
];
