# Revisão de Código - Joga Junto

Data: 2026-03-03
Versão: 010ece89

## 📋 Sumário Executivo

Revisão completa do codebase identificou **8 erros críticos**, **12 otimizações recomendadas** e **5 vulnerabilidades de segurança**. A maioria dos problemas são relacionados a:
- Tratamento de erros incompleto
- Validações faltando
- Queries N+1 no banco de dados
- Falta de tipagem em alguns casos

---

## 🔴 ERROS CRÍTICOS

### 1. **Validação de Altura Faltando (CRÍTICO)**
**Arquivo:** `app/athlete/profile.tsx`
**Problema:** Campo de altura não é validado como obrigatório antes de upload de vídeo
**Impacto:** Script Python falha ao calcular escala sem altura
**Solução:**
```typescript
// Adicionar validação antes de permitir upload
if (!athleteProfile?.heightCm || athleteProfile.heightCm < 100 || athleteProfile.heightCm > 250) {
  throw new Error("Altura deve estar entre 100cm e 250cm");
}
```

### 2. **Query N+1 em getStats (CRÍTICO)**
**Arquivo:** `server/routers-joga-junto.ts`, linha 66-81
**Problema:** Faz 3 queries separadas (athlete + ranking + videos) quando poderia fazer 1
**Impacto:** Performance ruim com muitos usuários
**Solução:**
```typescript
getStats: protectedProcedure.query(async ({ ctx }) => {
  // Usar JOIN em vez de 3 queries separadas
  const result = await db.select()
    .from(athletes)
    .leftJoin(athleteRankings, eq(athletes.id, athleteRankings.athleteId))
    .leftJoin(videos, eq(athletes.id, videos.athleteId))
    .where(eq(athletes.userId, ctx.user.id));
  // ... processar resultado
});
```

### 3. **Falta de Verificação de Permissão (CRÍTICO)**
**Arquivo:** `server/routers-joga-junto.ts`, linha 59 (getKPIs)
**Problema:** Não verifica se o vídeo pertence ao atleta autenticado
**Impacto:** Usuário pode acessar KPIs de outros atletas
**Solução:**
```typescript
getKPIs: protectedProcedure
  .input(z.object({ videoId: z.number() }))
  .query(async ({ ctx, input }) => {
    const video = await db.getVideoById(input.videoId);
    if (!video) throw new Error("Vídeo não encontrado");
    
    const athlete = await db.getAthleteByUserId(ctx.user.id);
    if (!athlete || video.athleteId !== athlete.id) {
      throw new Error("Acesso negado");
    }
    
    return db.getKPIByVideoId(input.videoId);
  }),
```

### 4. **Erro em pose_analyzer.py - Divisão por Zero**
**Arquivo:** `server/vision/pose_analyzer.py`, linha 62
**Problema:** Se `fps == 0`, retorna erro mas continua processando
**Impacto:** Pode causar crash em vídeos com FPS inválido
**Solução:**
```python
if fps == 0 or fps < 1:
    raise ValueError("FPS inválido: deve ser >= 1")
```

### 5. **Falta de Cleanup de Recursos**
**Arquivo:** `server/vision/pose_analyzer.py`, linha 54-77
**Problema:** `cv2.VideoCapture` não é fechado em caso de erro
**Impacto:** Vazamento de memória
**Solução:**
```python
try:
    cap = cv2.VideoCapture(video_path)
    # ... processar
finally:
    cap.release()
```

### 6. **Erro de Tipo em createAthlete**
**Arquivo:** `server/db-joga-junto.ts`, linha 39-40
**Problema:** `insertId` pode ser undefined, casting para `any` é inseguro
**Impacto:** Pode retornar 0 quando deveria retornar ID válido
**Solução:**
```typescript
const result = await db.insert(athletes).values(data);
const insertId = (result as any).insertId;
if (!insertId || insertId === 0) {
  throw new Error("Falha ao criar atleta");
}
return insertId;
```

### 7. **Falta de Validação de Email**
**Arquivo:** `app/auth/login.tsx`, linha 59
**Problema:** Email não é validado antes de enviar ao backend
**Impacto:** Requisições inválidas ao servidor
**Solução:**
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  setError("Email inválido");
  return;
}
```

### 8. **Erro de Segurança - OAuth Redirect URI Hardcoded**
**Arquivo:** `app/auth/login.tsx`, linha 40
**Problema:** URL de redirect está hardcoded com `localhost`
**Impacto:** Não funciona em produção
**Solução:**
```typescript
const redirectUri = Constants.expoConfig?.scheme 
  ? `${Constants.expoConfig.scheme}://oauth` 
  : "exp://localhost:8081/oauth";
```

---

## 🟡 OTIMIZAÇÕES RECOMENDADAS

### 1. **Adicionar Índices no Banco de Dados**
**Arquivo:** `drizzle/schema.ts`
**Problema:** Queries por userId não têm índices
**Solução:**
```typescript
export const athletes = mysqlTable("athletes", {
  // ... campos
}, (table) => ({
  userIdIdx: index("user_id_idx").on(table.userId),
  athleteIdIdx: index("athlete_id_idx").on(table.id),
}));
```

### 2. **Implementar Caching de Perfil**
**Arquivo:** `hooks/use-auth.ts`
**Problema:** Faz request a `/api/auth/me` a cada mount
**Solução:** Usar React Query com staleTime de 5 minutos
```typescript
const { data: user } = useQuery({
  queryKey: ["auth", "me"],
  queryFn: () => api.getMe(),
  staleTime: 5 * 60 * 1000, // 5 minutos
});
```

### 3. **Otimizar Queries de Vídeo**
**Arquivo:** `server/db-joga-junto.ts`
**Problema:** `getVideosByAthleteId` não pagina resultados
**Solução:** Adicionar limit e offset
```typescript
export async function getVideosByAthleteId(
  athleteId: number,
  limit: number = 10,
  offset: number = 0
): Promise<Video[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(videos)
    .where(eq(videos.athleteId, athleteId))
    .limit(limit)
    .offset(offset);
}
```

### 4. **Adicionar Rate Limiting**
**Arquivo:** `server/_core/index.ts`
**Problema:** Sem proteção contra brute force
**Solução:** Usar middleware de rate limiting
```typescript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requisições por IP
});

app.use(limiter);
```

### 5. **Melhorar Tratamento de Erro em Upload**
**Arquivo:** `server/routers-video.ts`
**Problema:** Erros de upload não retornam mensagens úteis
**Solução:** Adicionar validações específicas
```typescript
if (!file) throw new Error("Arquivo não fornecido");
if (file.size > 100 * 1024 * 1024) {
  throw new Error("Arquivo maior que 100MB");
}
if (!["video/mp4", "video/quicktime"].includes(file.type)) {
  throw new Error("Formato inválido (use MP4 ou MOV)");
}
```

### 6. **Adicionar Logging Estruturado**
**Arquivo:** Todos os routers
**Problema:** Sem logs de erro estruturados
**Solução:** Usar winston ou pino
```typescript
import logger from "./logger";

logger.info("Athlete profile updated", { athleteId, userId });
logger.error("Video upload failed", { error, userId });
```

### 7. **Otimizar Pose Analyzer**
**Arquivo:** `server/vision/pose_analyzer.py`
**Problema:** Processa TODOS os frames mesmo que desnecessário
**Solução:** Amostrar a cada N frames
```python
FRAME_SAMPLE_RATE = 5  # Processar a cada 5 frames
if frame_index % FRAME_SAMPLE_RATE == 0:
    results = self.pose.process(rgb_frame)
```

### 8. **Adicionar Validação de Tamanho de Vídeo**
**Arquivo:** `app/athlete/upload.tsx`
**Problema:** Sem validação de duração de vídeo
**Solução:** Validar antes de upload
```typescript
const validateVideo = async (uri: string) => {
  // Usar react-native-video-player para obter duração
  const duration = await getVideoDuration(uri);
  if (duration > 30) {
    throw new Error("Vídeo deve ter no máximo 30 segundos");
  }
};
```

### 9. **Melhorar Tipagem em db-joga-junto.ts**
**Arquivo:** `server/db-joga-junto.ts`, linha 40
**Problema:** Casting para `any` em vários lugares
**Solução:** Usar tipos corretos
```typescript
interface InsertResult {
  insertId: number;
  affectedRows: number;
}

const result = await db.insert(athletes).values(data) as InsertResult;
```

### 10. **Adicionar Validação de Entrada em updateProfile**
**Arquivo:** `server/routers-joga-junto.ts`, linha 26-41
**Problema:** Sem validação de ranges (ex: altura negativa)
**Solução:**
```typescript
updateProfile: protectedProcedure
  .input(
    z.object({
      heightCm: z.number().min(100).max(250).optional(),
      weightKg: z.number().min(30).max(200).optional(),
      position: z.enum(["goleiro", "zagueiro", "lateral", "meia", "atacante"]).optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    // ... validações adicionais
  }),
```

### 11. **Implementar Soft Delete**
**Arquivo:** `drizzle/schema.ts`
**Problema:** Sem forma de recuperar dados deletados
**Solução:** Adicionar campo `deletedAt`
```typescript
export const athletes = mysqlTable("athletes", {
  // ... campos
  deletedAt: timestamp("deleted_at"),
});
```

### 12. **Adicionar Testes de Integração**
**Arquivo:** Criar `tests/integration/`
**Problema:** Sem testes de fluxo completo
**Solução:** Criar testes E2E
```typescript
describe("Athlete Upload Flow", () => {
  it("should upload video and generate KPIs", async () => {
    // Teste completo do fluxo
  });
});
```

---

## 🔐 VULNERABILIDADES DE SEGURANÇA

### 1. **SQL Injection Potencial**
**Severidade:** Alta
**Arquivo:** `server/db-joga-junto.ts`
**Problema:** Queries dinâmicas sem sanitização (embora Drizzle ajude)
**Solução:** Sempre usar Drizzle ORM, nunca SQL raw

### 2. **CSRF Token Faltando**
**Severidade:** Alta
**Arquivo:** `server/_core/index.ts`
**Problema:** Sem proteção CSRF em mutações
**Solução:** Adicionar middleware CSRF
```typescript
import csrf from "csurf";
app.use(csrf());
```

### 3. **Falta de HTTPS Enforcement**
**Severidade:** Alta
**Arquivo:** `server/_core/index.ts`
**Problema:** Sem redirecionamento de HTTP para HTTPS
**Solução:**
```typescript
app.use((req, res, next) => {
  if (req.header("x-forwarded-proto") !== "https") {
    res.redirect(`https://${req.header("host")}${req.url}`);
  } else {
    next();
  }
});
```

### 4. **Falta de Validação de Arquivo**
**Severidade:** Média
**Arquivo:** `server/routers-video.ts`
**Problema:** Sem validação de tipo MIME real
**Solução:** Usar `file-type` para validar
```typescript
import FileType from "file-type";

const type = await FileType.fromBuffer(buffer);
if (type?.mime !== "video/mp4") {
  throw new Error("Arquivo não é MP4 válido");
}
```

### 5. **Exposição de Erro Sensível**
**Severidade:** Média
**Arquivo:** Todos os routers
**Problema:** Erros do banco de dados expostos ao cliente
**Solução:** Sanitizar erros em produção
```typescript
catch (error) {
  if (process.env.NODE_ENV === "production") {
    logger.error("Database error", error);
    throw new Error("Erro ao processar requisição");
  }
  throw error;
}
```

---

## 📊 Resumo de Prioridades

| Prioridade | Tipo | Quantidade |
|-----------|------|-----------|
| 🔴 Crítico | Erro | 8 |
| 🟡 Alto | Otimização | 7 |
| 🟢 Médio | Otimização | 5 |
| 🔐 Segurança | Vulnerabilidade | 5 |

---

## ✅ Checklist de Correções

- [ ] Adicionar validação de altura obrigatória
- [ ] Corrigir queries N+1 em getStats
- [ ] Adicionar verificação de permissão em getKPIs
- [ ] Fechar recursos em pose_analyzer.py
- [ ] Adicionar índices no banco de dados
- [ ] Implementar rate limiting
- [ ] Adicionar validação de email
- [ ] Corrigir OAuth redirect URI
- [ ] Adicionar logging estruturado
- [ ] Implementar CSRF protection
- [ ] Adicionar testes de integração
- [ ] Sanitizar erros em produção

---

## 📝 Notas

- Código está bem estruturado em geral
- Tipagem TypeScript é boa na maioria dos casos
- Falta principalmente validações e tratamento de edge cases
- Performance é aceitável mas pode melhorar com índices
- Segurança precisa de melhorias antes de produção
