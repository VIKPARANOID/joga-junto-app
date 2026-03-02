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

