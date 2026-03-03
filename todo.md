# Joga Junto - TODO List

## MVP Phase 1: Core Features

### Autenticação & Onboarding
- [x] Tela de Login (email/senha)
- [x] Tela de Cadastro (email/senha)
- [x] Seleção de tipo de usuário (Atleta/Clube)
- [x] Persistência de token JWT
- [x] Logout funcional

### Perfil do Atleta
- [ ] Tela de Perfil do Atleta
- [ ] Formulário de dados físicos (idade, altura, peso, posição)
- [ ] Edição de perfil
- [ ] Avatar/foto do atleta

### Perfil do Clube
- [ ] Tela de Perfil do Clube
- [ ] Formulário de dados do clube (nome, cidade, descrição)
- [ ] Edição de perfil
- [ ] Logo do clube

### Upload de Vídeo (Atleta)
- [ ] Tela de Upload de Vídeo
- [ ] Seletor de arquivo (câmera/galeria)
- [ ] Validação de formato (MP4)
- [ ] Validação de duração (máx 30s)
- [ ] Validação de tamanho (máx 100MB)
- [ ] Progress bar de upload
- [ ] Feedback de sucesso/erro

### Backend - Autenticação
- [x] Endpoint POST /auth/login (OAuth Manus)
- [x] Endpoint POST /auth/register (OAuth Manus)
- [x] Endpoint POST /auth/logout
- [x] Validação de email
- [x] Hash de senha (bcrypt)
- [x] JWT token generation
- [x] Refresh token logic

### Backend - Athlete Endpoints
- [x] GET /athlete/profile (tRPC)
- [x] PUT /athlete/profile (tRPC)
- [ ] POST /athlete/video/upload (tRPC)
- [x] GET /athlete/videos (tRPC)
- [x] GET /athlete/kpis/:videoId (tRPC)

### Backend - Club Endpoints
- [x] GET /club/profile (tRPC)
- [x] PUT /club/profile (tRPC)
- [x] GET /club/athletes/feed (tRPC)
- [x] GET /club/ranking (tRPC)
- [x] GET /club/athlete/:athleteId (tRPC)

### Banco de Dados
- [x] Criar tabela `users`
- [x] Criar tabela `athletes`
- [x] Criar tabela `clubs`
- [x] Criar tabela `videos`
- [x] Criar tabela `kpis`
- [x] Criar tabela `athlete_rankings`
- [x] Criar tabela `club_follows`
- [x] Migrations Drizzle ORM

### Visão Computacional - Python
- [x] Script básico OpenCV + MediaPipe
- [x] Extração de frames de vídeo
- [x] Pose Landmark Detection (33 keypoints)
- [x] Cálculo de velocidade média
- [x] Cálculo de velocidade máxima
- [x] Cálculo de distância percorrida
- [x] Cálculo de sprints
- [x] Cálculo de aceleração
- [x] Geração de JSON com KPIs
- [x] Integração com backend (tRPC router)

### Área do Atleta - Frontend
- [ ] Tela Home do Atleta
- [ ] Exibição de últimos KPIs
- [ ] Histórico de vídeos
- [ ] Detalhes de cada análise

### Área do Clube - Frontend (Dashboard Web)
- [x] Tela Feed de Atletas (Cards com gráficos)
- [x] Lista de atletas com últimos vídeos
- [x] Tela de Ranking (Sidebar com filtros)
- [x] Ordenação por KPI (velocidade, precisão, geral)
- [x] Tela de Detalhes do Atleta (Modal com vídeo)
- [x] Botão de Entrar em Contato

### Integração Frontend-Backend
- [ ] tRPC client setup
- [ ] API calls para login/register
- [ ] API calls para upload de vídeo
- [ ] API calls para fetch de KPIs
- [ ] API calls para feed de atletas
- [ ] API calls para ranking
- [ ] Error handling e retry logic
- [ ] Loading states

### Branding & Assets
- [x] Gerar logo do app (Joga Junto)
- [x] Atualizar app.config.ts com nome e logo
- [x] Configurar cores do tema
- [x] Splash screen

### Testes & QA
- [ ] Testar fluxo de login/cadastro
- [ ] Testar upload de vídeo
- [ ] Testar processamento de vídeo
- [ ] Testar exibição de KPIs
- [ ] Testar feed e ranking
- [ ] Testar responsividade mobile
- [ ] Testar dark mode
- [ ] Testar em iOS e Android

### Documentação
- [ ] ARCHITECTURE.md (✓ Concluído)
- [ ] design.md (✓ Concluído)
- [ ] server/README.md
- [ ] Guia de setup local
- [ ] Guia de deployment

---

## Phase 2: Melhorias & Polimento

- [ ] Autenticação OAuth (Google, Apple)
- [ ] Notificações push
- [ ] Comparação entre atletas
- [ ] Gráficos de progresso
- [ ] Compartilhamento de resultados
- [ ] Analytics e insights

---

## Bugs Conhecidos

(Nenhum no momento - será atualizado conforme encontrados)

---

## Notas

- Usar Supabase/Firebase para autenticação e storage (ou backend local)
- MediaPipe oferece 33 keypoints por frame
- Vídeos devem ser processados de forma assíncrona
- Implementar fila de processamento (Bull Queue ou similar)



## Fase 5: Área do Atleta (Mobile)

### Perfil Técnico do Atleta
- [x] Tela de cadastro de perfil (/atleta/perfil)
- [x] Formulário com altura (cm) - obrigatório
- [x] Formulário com peso (kg)
- [x] Seleção de posição (Goleiro, Zagueiro, Meia, Atacante)
- [x] Seleção de perna dominante (Canhoto/Destro)
- [x] Validação de dados
- [x] Salvar perfil no banco de dados

### Upload de Vídeo
- [x] Tela de desafio de velocidade/drible (/atleta/upload)
- [x] Card explicativo com instruções visuais
- [x] Botão "Selecionar Vídeo" (com mock para testes)
- [x] Validação de formato (MP4, MOV)
- [x] Validação de tamanho (<100MB)
- [x] Barra de progresso de upload
- [x] Mensagem "Nossa IA está analisando seus movimentos..."
- [x] Integração com backend (tRPC)

### Dashboard do Atleta
- [x] Tela de resultados (/atleta/dashboard)
- [x] Exibição de KPIs (velocidade, agilidade, intensidade)
- [x] Badge de nível (Bronze, Prata, Ouro)
- [x] Comparativo com média da categoria
- [x] Status do vídeo ("Disponível para Olheiros")
- [ ] Histórico de vídeos analisados
- [ ] Ranking pessoal

### Navegação do Atleta
- [x] Tab bar com 3 abas (Perfil, Upload, Dashboard)
- [x] Ícones customizados para cada aba
- [x] Roteamento dinâmico entre telas
- [x] Redirecionamento automático após login
- [x] Home screen com lógica de redirecionamento

### Integração Frontend-Backend
- [ ] Conectar upload ao analyze_video (Python)
- [ ] Exibir KPIs reais do backend
- [ ] Sincronizar com dashboard do olheiro
- [ ] Tratamento de erros de processamento


## Fase 6: Dashboard Avançado do Atleta

### Componentes de KPIs
- [x] Componente KPI Card com ícone e valor
- [x] Componente Radar Chart (gráfico de radar)
- [x] Componente Progress Bar (barra de progresso)
- [x] Componente Badge de nível dinâmico

### Integração com Backend
- [x] Buscar KPIs do último vídeo via tRPC
- [x] Buscar histórico de vídeos
- [x] Buscar comparativo com categoria
- [x] Tratamento de estados (loading, error, empty)

### Exibição de Dados
- [x] KPIs principais em cards (velocidade, agilidade, intensidade)
- [x] Gráfico radar com 3 métricas
- [x] Histórico de vídeos em lista
- [x] Comparativo com média da categoria
- [x] Trend de melhoria (seta para cima/baixo)

### UX/Polish
- [x] Animações de carregamento
- [x] Mensagens de erro amigáveis
- [x] Estado vazio quando sem vídeos
- [x] Refresh manual de dados


## Fase 7: Perfil Público do Atleta

### Tela de Perfil Público
- [x] Rota dinâmica `/athlete-public/[id]`
- [x] Exibição de dados básicos (nome, idade, posição, altura)
- [x] Foto de perfil/avatar
- [x] Badge de nível (Bronze/Prata/Ouro)
- [x] KPIs principais em cards
- [x] Gráfico radar de desempenho
- [x] Histórico de vídeos com thumbnails
- [x] Estatísticas gerais (total de vídeos, média de velocidade)

### Link Compartilhável
- [x] Gerar URL única por atleta
- [x] Copiar link para clipboard (mock)
- [x] Compartilhar via WhatsApp/Email (mock)
- [ ] QR Code com link do perfil
- [x] Validação de acesso público

### Integração com Backend
- [x] Endpoint tRPC para buscar perfil público
- [x] Filtrar apenas dados públicos
- [ ] Cache de perfis públicos
- [x] Validação de permissões

### Botão de Contato
- [x] Botão "Entrar em Contato" para olheiros
- [x] Modal com opções (WhatsApp, Email, Formulário)
- [x] Enviar mensagem para atleta (mock)
- [ ] Registrar interesse do olheiro

### UX/Design
- [x] Layout responsivo para mobile e web
- [x] Tema visual profissional
- [x] Animações suaves
- [x] Indicador de "Perfil Público"


## Fase 8: Integração Dashboard Web com Backend

### Cliente tRPC no Next.js
- [x] Configurar cliente tRPC no Next.js
- [x] Criar hooks customizados para queries
- [ ] Implementar cache e revalidação
- [x] Tratamento de erros de API

### Substituição de Dados Mockados
- [x] Conectar componente AthleteCard ao backend
- [x] Buscar lista de atletas com KPIs
- [x] Buscar rankings ordenáveis
- [ ] Implementar paginação

### Filtros Dinâmicos
- [x] Filtrar por idade
- [x] Filtrar por posição
- [x] Filtrar por perna dominante
- [x] Filtrar por score mínimo
- [x] Aplicar múltiplos filtros simultaneamente

### Performance
- [ ] Implementar infinite scroll
- [ ] Cache de dados
- [ ] Debounce de filtros
- [ ] Otimizar queries

### Modal de Vídeo
- [ ] Buscar vídeo real do S3
- [ ] Exibir player de vídeo
- [ ] Mostrar KPIs do vídeo
- [ ] Botão de contato funcional


## Fase 9: Sistema de Cache e Otimização de Performance

### React Query (TanStack Query)
- [x] Instalar @tanstack/react-query no Next.js
- [x] Configurar QueryClient com opções de cache
- [x] Envolver app com QueryClientProvider
- [x] Converter hooks para useQuery/useMutation

### Cache de Dados
- [x] Cache automático de listAthletes
- [x] Cache de perfil público do atleta
- [x] Cache de vídeos do atleta
- [x] Cache de KPIs
- [x] Definir TTL (time-to-live) para cada query

### Persistência Local
- [x] Implementar persistência com localStorage
- [x] Sincronizar cache com storage
- [x] Recuperar cache ao recarregar página
- [x] Limpar cache expirado

### Invalidação de Cache
- [x] Invalidar ao atualizar filtros
- [x] Invalidar ao mudar ordenação
- [ ] Invalidar ao fazer upload de vídeo
- [ ] Invalidar ao seguir/deixar de seguir atleta

### Debounce e Otimização
- [x] Debounce de 300ms nos filtros
- [x] Debounce na busca por nome
- [x] Prefetch de próxima página
- [ ] Lazy load de imagens

### Monitoramento
- [ ] Adicionar logs de cache hits/misses
- [ ] Monitorar tamanho do cache
- [ ] Alertar quando cache fica muito grande


## Fase 10: Lazy Loading de Imagens

### Componente de Imagem Lazy
- [x] Criar componente LazyImage com Intersection Observer
- [x] Implementar placeholder/skeleton
- [x] Adicionar blur-up effect
- [x] Fallback de erro com avatar padrão
- [x] Otimizar tamanho de imagens

### Integração no Dashboard
- [x] Aplicar lazy loading em cards de atletas
- [ ] Aplicar lazy loading em modal de atleta
- [ ] Aplicar lazy loading em histórico de vídeos
- [ ] Testar performance de carregamento

### Otimização de Imagens
- [x] Redimensionar imagens para diferentes resoluções
- [x] Comprimir imagens (WebP, JPEG)
- [x] Gerar srcset para responsividade
- [x] Cache de imagens no browser

### Monitoramento
- [x] Medir tempo de carregamento inicial
- [x] Medir tempo de scroll
- [x] Contar imagens carregadas vs não carregadas
- [x] Rastrear erros de carregamento


## Fase 11: Infinite Scroll e Paginação

### Infinite Scroll
- [x] Criar hook useInfiniteScroll com Intersection Observer
- [x] Implementar trigger ao final da página
- [x] Carregar próxima página automaticamente
- [x] Mostrar loading indicator
- [x] Tratamento de erro com retry

### Paginação no Backend
- [ ] Adicionar suporte a limit/offset no endpoint listAthletes
- [ ] Retornar total de atletas
- [ ] Retornar hasMore flag
- [ ] Otimizar queries com paginação

### Integração no Dashboard
- [x] Aplicar infinite scroll na grid de atletas
- [x] Mostrar skeleton loading enquanto carrega
- [x] Botão de retry em caso de erro
- [x] Indicador de "fim da lista"

### Performance
- [x] Debounce de requisições
- [x] Cache de páginas anteriores
- [x] Preload de próxima página
- [x] Limpar dados antigos se necessário


## Fase 12: Tratamento de Falhas e Loading Visual

### Componentes de Loading
- [x] Componente LoadingSpinner animado
- [x] Componente LoadingScreen com mensagem
- [x] Componente SkeletonLoader para dados
- [x] Componente ErrorScreen com retry
- [x] Componente TimeoutError para carregamento longo

### Tratamento de Erro
- [x] Capturar erros de rede
- [x] Capturar erros de timeout
- [x] Capturar erros de API
- [x] Mostrar mensagem de erro amigável
- [x] Botão de retry funcional

### Melhorias Visuais
- [x] Animações suaves de loading
- [x] Gradientes e cores profissionais
- [x] Ícones de erro/sucesso
- [x] Transições entre estados
- [x] Feedback visual de ação

### Integração
- [x] Aplicar em home screen
- [ ] Aplicar em login/cadastro
- [ ] Aplicar em upload de vídeo
- [ ] Aplicar em dashboard
- [ ] Aplicar em perfil


## Fase 13: Otimização de Upload de Vídeo e Padronização

### Vídeo de Instruções com IA
- [ ] Criar vídeo de demonstração (30-60s)
- [ ] Mostrar posicionamento correto da câmera
- [ ] Demonstrar iluminação ideal
- [ ] Mostrar movimentos esperados (sprint, drible, passe)
- [ ] Incluir áudio com instruções

### Otimização de Upload
- [ ] Validar formato (MP4, MOV)
- [ ] Validar duração (máx 30s)
- [ ] Validar tamanho (máx 100MB)
- [ ] Compressão automática se necessário
- [ ] Feedback de progresso em tempo real
- [ ] Estimativa de tempo de análise

### Padronização de Vídeos
- [ ] Checklist antes de enviar
- [ ] Validação de iluminação (detectar se muito escuro)
- [ ] Validação de movimento (detectar se estático)
- [ ] Validação de fundo (detectar se muito poluído)
- [ ] Recomendações de melhoria

### Descrição Escrita
- [ ] Instruções sobre iluminação
- [ ] Instruções sobre fundo
- [ ] Instruções sobre posicionamento
- [ ] Instruções sobre duração
- [ ] Instruções sobre movimentos
- [ ] Exemplos visuais (imagens/ícones)

### Feedback do Usuário
- [ ] Mostrar checklist de validação
- [ ] Indicar quais critérios foram atendidos
- [ ] Sugerir melhorias antes de enviar
- [ ] Permitir reenvio se não atender critérios
