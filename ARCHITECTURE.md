# Arquitetura do Joga Junto - MVP

## 1. Estrutura de Pastas do Projeto

```
joga-junto-app/
├── app/                          # Expo Router - Estrutura de telas
│   ├── _layout.tsx              # Layout raiz com providers
│   ├── (auth)/                  # Grupo de autenticação
│   │   ├── _layout.tsx
│   │   ├── login.tsx            # Tela de login
│   │   └── register.tsx         # Tela de cadastro
│   ├── (app)/                   # Grupo de telas autenticadas
│   │   ├── _layout.tsx          # Tab bar layout
│   │   ├── (athlete)/           # Fluxo do atleta
│   │   │   ├── _layout.tsx
│   │   │   ├── home.tsx         # Home do atleta
│   │   │   ├── profile.tsx      # Perfil do atleta
│   │   │   ├── upload.tsx       # Upload de vídeo
│   │   │   └── results.tsx      # Resultados/KPIs
│   │   └── (club)/              # Fluxo do clube/olheiro
│   │       ├── _layout.tsx
│   │       ├── home.tsx         # Feed de atletas
│   │       ├── ranking.tsx      # Ranking por KPIs
│   │       └── athlete-detail.tsx # Detalhes do atleta
│   └── oauth/                   # OAuth callbacks
├── components/
│   ├── screen-container.tsx     # SafeArea wrapper
│   ├── themed-view.tsx
│   ├── ui/
│   │   └── icon-symbol.tsx
│   ├── auth/
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── athlete/
│   │   ├── profile-form.tsx
│   │   ├── video-uploader.tsx
│   │   └── kpi-card.tsx
│   └── club/
│       ├── athlete-card.tsx
│       └── ranking-list.tsx
├── hooks/
│   ├── use-auth.ts              # Auth state management
│   ├── use-colors.ts
│   ├── use-color-scheme.ts
│   ├── use-athlete.ts           # Athlete data hook
│   └── use-club.ts              # Club data hook
├── lib/
│   ├── trpc.ts                  # API client
│   ├── utils.ts
│   ├── api/
│   │   ├── athlete.ts           # Athlete API calls
│   │   └── club.ts              # Club API calls
│   └── storage/
│       ├── auth-storage.ts      # Persist auth token
│       └── user-storage.ts      # Persist user data
├── constants/
│   └── theme.ts
├── assets/
│   ├── images/
│   │   ├── icon.png
│   │   ├── splash-icon.png
│   │   ├── favicon.png
│   │   ├── android-icon-foreground.png
│   │   └── android-icon-background.png
│   └── fonts/
├── server/                      # Backend FastAPI (Python)
│   ├── _core/
│   │   ├── index.ts             # Express server entry
│   │   ├── router.ts            # API routes
│   │   └── middleware.ts
│   ├── routes/
│   │   ├── auth.ts              # Auth endpoints
│   │   ├── athlete.ts           # Athlete endpoints
│   │   ├── club.ts              # Club endpoints
│   │   └── video.ts             # Video upload/processing
│   ├── services/
│   │   ├── auth-service.ts
│   │   ├── athlete-service.ts
│   │   ├── club-service.ts
│   │   └── vision-service.ts    # CV processing
│   ├── models/
│   │   ├── user.ts
│   │   ├── athlete.ts
│   │   ├── club.ts
│   │   └── video.ts
│   ├── db/
│   │   ├── schema.ts            # Drizzle ORM schema
│   │   └── migrations/
│   ├── python/                  # Scripts Python para CV
│   │   ├── vision_processor.py  # OpenCV + MediaPipe
│   │   ├── kpi_calculator.py    # Cálculo de KPIs
│   │   └── requirements.txt
│   └── README.md
├── app.config.ts
├── package.json
├── tailwind.config.js
├── theme.config.js
├── tsconfig.json
├── todo.md                      # Rastreamento de features
├── design.md                    # Design system e fluxos
└── ARCHITECTURE.md              # Este arquivo
```

---

## 2. Schema do Banco de Dados

### Tabelas Principais

#### **users** (Usuários - Base)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  user_type ENUM('athlete', 'club') NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);
```

#### **athletes** (Perfil do Atleta)
```sql
CREATE TABLE athletes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  date_of_birth DATE,
  height_cm DECIMAL(5, 2),
  weight_kg DECIMAL(5, 2),
  position VARCHAR(50),  -- Ex: "Meia", "Atacante", "Lateral"
  preferred_foot ENUM('left', 'right', 'both'),
  club_name VARCHAR(255),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### **clubs** (Perfil do Clube/Olheiro)
```sql
CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  club_name VARCHAR(255) NOT NULL,
  city VARCHAR(255),
  state VARCHAR(2),
  description TEXT,
  logo_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### **videos** (Vídeos de Atletas)
```sql
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID NOT NULL,
  file_url VARCHAR(255) NOT NULL,  -- S3 URL
  file_size_mb DECIMAL(10, 2),
  duration_seconds INT,
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processing_status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
  processing_error TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (athlete_id) REFERENCES athletes(id) ON DELETE CASCADE,
  INDEX (athlete_id),
  INDEX (processing_status)
);
```

#### **kpis** (KPIs Gerados pela IA)
```sql
CREATE TABLE kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL UNIQUE,
  athlete_id UUID NOT NULL,
  
  -- Métricas de movimento
  avg_speed_kmh DECIMAL(10, 2),
  max_speed_kmh DECIMAL(10, 2),
  
  -- Métricas de bola
  ball_touches INT,
  passes_attempted INT,
  passes_completed INT,
  pass_accuracy_percent DECIMAL(5, 2),
  
  -- Métricas de movimento
  sprints_count INT,
  avg_acceleration DECIMAL(10, 2),
  
  -- Métricas gerais
  distance_covered_m DECIMAL(10, 2),
  intensity_score DECIMAL(5, 2),  -- 0-100
  
  -- Pose estimation
  skeleton_landmarks JSON,  -- Array de keypoints do MediaPipe
  
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
  FOREIGN KEY (athlete_id) REFERENCES athletes(id) ON DELETE CASCADE,
  INDEX (athlete_id),
  INDEX (generated_at)
);
```

#### **athlete_rankings** (Cache de Rankings)
```sql
CREATE TABLE athlete_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID NOT NULL,
  
  -- Scores agregados
  overall_score DECIMAL(5, 2),
  speed_score DECIMAL(5, 2),
  dribbling_score DECIMAL(5, 2),
  accuracy_score DECIMAL(5, 2),
  
  -- Estatísticas
  total_videos INT DEFAULT 0,
  avg_intensity DECIMAL(5, 2),
  
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (athlete_id) REFERENCES athletes(id) ON DELETE CASCADE,
  INDEX (overall_score DESC),
  INDEX (speed_score DESC),
  INDEX (accuracy_score DESC)
);
```

#### **club_follows** (Clube segue Atleta)
```sql
CREATE TABLE club_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL,
  athlete_id UUID NOT NULL,
  followed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
  FOREIGN KEY (athlete_id) REFERENCES athletes(id) ON DELETE CASCADE,
  UNIQUE KEY unique_follow (club_id, athlete_id)
);
```

---

## 3. Fluxo de Dados - Visão Geral

### Fluxo do Atleta
```
1. Atleta faz login/cadastro
   ↓
2. Preenche perfil (idade, posição, altura, etc)
   ↓
3. Faz upload de vídeo (MP4, máx 30s)
   ↓
4. Backend recebe vídeo → Fila de processamento
   ↓
5. Script Python (OpenCV + MediaPipe):
   - Extrai skeleton (pose landmarks)
   - Calcula velocidade, distância, aceleração
   - Estima toques na bola
   - Gera JSON com KPIs
   ↓
6. KPIs salvos no BD
   ↓
7. Atleta vê resultados na tela
```

### Fluxo do Clube
```
1. Clube faz login/cadastro
   ↓
2. Acessa feed de atletas (lista com últimos vídeos)
   ↓
3. Vê ranking ordenável por KPIs (velocidade, precisão, drible)
   ↓
4. Clica em atleta para ver detalhes
   ↓
5. Pode seguir atleta (salva em club_follows)
```

---

## 4. Arquitetura de Visão Computacional

### Pipeline de Processamento

```
Vídeo (MP4)
    ↓
[OpenCV] Frame extraction (30 fps)
    ↓
[MediaPipe] Pose Landmark Detection
    - 33 keypoints por frame
    - Confiança de detecção
    ↓
[Processamento] Cálculo de métricas
    - Velocidade: distância / tempo entre frames
    - Aceleração: derivada da velocidade
    - Distância total: soma de deslocamentos
    - Sprints: períodos com aceleração > threshold
    ↓
[KPI Calculator] Agregação final
    - Média, máxima, mínima
    - Scores normalizados (0-100)
    ↓
JSON com KPIs → BD
```

### Métricas Calculadas (MVP)

| Métrica | Descrição | Fonte |
|---------|-----------|-------|
| `avg_speed_kmh` | Velocidade média | Deslocamento entre frames |
| `max_speed_kmh` | Velocidade máxima | Pico de deslocamento |
| `sprints_count` | Número de acelerações | Períodos com aceleração > 2 m/s² |
| `distance_covered_m` | Distância total percorrida | Soma de deslocamentos |
| `intensity_score` | Score 0-100 | Baseado em velocidade média e sprints |
| `skeleton_landmarks` | Pose estimation raw | Array JSON com 33 keypoints |

---

## 5. Stack Tecnológico

### Frontend (Mobile)
- **Framework**: React Native com Expo SDK 54
- **Roteamento**: Expo Router 6
- **Styling**: NativeWind (Tailwind CSS)
- **State Management**: React Context + AsyncStorage
- **API Client**: tRPC + React Query
- **TypeScript**: 5.9

### Backend (Node.js/Express)
- **Runtime**: Node.js
- **Framework**: Express.js (via tRPC)
- **Banco de Dados**: MySQL (Drizzle ORM)
- **Autenticação**: JWT + Secure Store
- **File Storage**: S3-compatible (Manus Storage)

### Visão Computacional (Python)
- **OpenCV**: Processamento de vídeo
- **MediaPipe**: Pose estimation
- **NumPy/SciPy**: Cálculos matemáticos
- **Integração**: Subprocess call do backend Node.js

---

## 6. Endpoints da API (tRPC)

### Auth
- `auth.login(email, password)` → JWT token
- `auth.register(email, password, userType)` → User + JWT
- `auth.logout()` → Clear token

### Athlete
- `athlete.getProfile(userId)` → Athlete data
- `athlete.updateProfile(data)` → Updated athlete
- `athlete.uploadVideo(file)` → Video + processing job
- `athlete.getVideos(athleteId)` → List of videos
- `athlete.getKPIs(videoId)` → KPI data
- `athlete.getStats()` → Aggregated stats

### Club
- `club.getProfile(userId)` → Club data
- `club.updateProfile(data)` → Updated club
- `club.getAthletesFeed()` → List of athletes with latest videos
- `club.getRanking(sortBy)` → Ranking by KPI
- `club.getAthleteDetail(athleteId)` → Athlete profile + videos + KPIs
- `club.followAthlete(athleteId)` → Add to follows
- `club.unfollowAthlete(athleteId)` → Remove from follows

---

## 7. Fluxo de Integração Frontend-Backend

```
Frontend (Expo)
    ↓
[tRPC Client] Chamada de API
    ↓
Backend (Express)
    ↓
[Service Layer] Lógica de negócio
    ↓
[Database] MySQL via Drizzle
    ↓
[Python Script] (se for processamento de vídeo)
    ↓
Resposta JSON → Frontend
    ↓
[React Query] Cache + UI update
    ↓
Tela atualizada
```

---

## 8. Próximas Fases (Pós-MVP)

1. **Fase 2**: Autenticação com OAuth (Google, Apple)
2. **Fase 3**: Análise de bola (detecção com YOLO)
3. **Fase 4**: Comparação de atletas (benchmarking)
4. **Fase 5**: Notificações push para clubes
5. **Fase 6**: Dashboard analítico com gráficos

---

## 9. Considerações de Performance

- **Vídeos**: Armazenar em S3, não no BD
- **KPIs**: Cache em `athlete_rankings` para rankings rápidos
- **Processamento**: Fila assíncrona (Bull Queue ou similar)
- **Imagens**: Compressão automática de uploads
- **API**: Rate limiting por usuário

---

## 10. Segurança

- **Autenticação**: JWT com refresh tokens
- **Autorização**: Atleta só vê seus vídeos; Clube só vê atletas públicos
- **Dados sensíveis**: Passwords hasheadas (bcrypt)
- **Uploads**: Validação de tipo de arquivo + antivírus
- **CORS**: Restrito a domínios conhecidos

