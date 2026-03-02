# Design System - Joga Junto

## Princípios de Design

O Joga Junto segue os **Apple Human Interface Guidelines (HIG)** para garantir uma experiência nativa no iOS. O design é **mobile-first**, otimizado para **portrait (9:16)** e **uso com uma mão**.

---

## 1. Paleta de Cores

| Token | Luz | Escuro | Uso |
|-------|------|--------|-----|
| `primary` | `#0A7EA4` | `#0A7EA4` | Botões, links, destaques |
| `background` | `#FFFFFF` | `#151718` | Fundo das telas |
| `surface` | `#F5F5F5` | `#1E2022` | Cards, superfícies elevadas |
| `foreground` | `#11181C` | `#ECEDEE` | Texto principal |
| `muted` | `#687076` | `#9BA1A6` | Texto secundário |
| `border` | `#E5E7EB` | `#334155` | Divisores, bordas |
| `success` | `#22C55E` | `#4ADE80` | Estados positivos |
| `warning` | `#F59E0B` | `#FBBF24` | Alertas, avisos |
| `error` | `#EF4444` | `#F87171` | Erros, validação |

**Tema do Joga Junto**: Verde/Azul (futebol, confiança, movimento)

---

## 2. Tipografia

| Elemento | Tamanho | Peso | Uso |
|----------|---------|------|-----|
| H1 (Títulos) | 32px | Bold (700) | Títulos de telas |
| H2 (Subtítulos) | 24px | Semibold (600) | Seções principais |
| H3 (Cabeçalhos) | 18px | Semibold (600) | Cabeçalhos de cards |
| Body (Padrão) | 16px | Regular (400) | Corpo de texto |
| Caption | 14px | Regular (400) | Texto secundário |
| Small | 12px | Regular (400) | Labels, hints |

**Font**: System font (SF Pro Display no iOS, Roboto no Android)

---

## 3. Espaçamento (8px grid)

| Escala | Valor | Uso |
|--------|-------|-----|
| xs | 4px | Micro-espaçamento |
| sm | 8px | Espaçamento compacto |
| md | 16px | Espaçamento padrão |
| lg | 24px | Espaçamento generoso |
| xl | 32px | Separação de seções |
| 2xl | 48px | Espaçamento máximo |

---

## 4. Componentes Principais

### Botões
- **Primary**: Fundo azul, texto branco, altura 48px, border-radius 12px
- **Secondary**: Fundo transparente, borda azul, texto azul
- **Tertiary**: Texto apenas (sem fundo)
- **Feedback**: Scale 0.97 ao pressionar + haptic light

### Cards
- Fundo: `surface`
- Borda: 1px `border`
- Border-radius: 12px
- Sombra: Sutil (iOS style)
- Padding: 16px

### Input Fields
- Altura: 44px (toque confortável)
- Border-radius: 8px
- Borda: 1px `border`
- Padding: 12px 16px
- Focus: Borda azul + shadow

### Tab Bar
- Altura: 56px + safe area
- Ícones: 28px
- Labels: 10px, caption
- Feedback: Haptic medium ao trocar aba

---

## 5. Fluxos de Tela

### Fluxo de Autenticação

```
┌─────────────────────────────────┐
│        Splash Screen            │
│   (Logo + Loading Indicator)    │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│      Login / Register?          │
│  [Login]  [Criar Conta]         │
└─────────────────────────────────┘
              ↓
         ┌────┴────┐
         ↓         ↓
    [Login]    [Register]
         ↓         ↓
         └────┬────┘
              ↓
┌─────────────────────────────────┐
│   Selecionar Tipo de Usuário    │
│  [Atleta]  [Clube/Olheiro]      │
└─────────────────────────────────┘
              ↓
    ┌────────┴────────┐
    ↓                 ↓
[Perfil Atleta]  [Perfil Clube]
    ↓                 ↓
    └────────┬────────┘
             ↓
    [App Principal]
```

### Fluxo do Atleta

```
┌──────────────────────────────────────┐
│  Home (Atleta)                       │
│  ┌────────────────────────────────┐  │
│  │ Bem-vindo, [Nome]!             │  │
│  │                                │  │
│  │ Últimos KPIs:                  │  │
│  │ ├─ Velocidade: 28.5 km/h       │  │
│  │ ├─ Distância: 4.2 km           │  │
│  │ └─ Sprints: 12                 │  │
│  │                                │  │
│  │ [Fazer Upload de Vídeo]        │  │
│  └────────────────────────────────┘  │
│                                      │
│  Tab Bar: Home | Perfil | Histórico │
└──────────────────────────────────────┘
         ↓
    [Upload Video]
         ↓
┌──────────────────────────────────────┐
│  Upload de Vídeo                     │
│  ┌────────────────────────────────┐  │
│  │ Selecionar vídeo (MP4, <30s)   │  │
│  │ [Câmera] [Galeria]             │  │
│  │                                │  │
│  │ Vídeo selecionado:             │  │
│  │ meu_video.mp4 (25.3 MB)        │  │
│  │                                │  │
│  │ [Enviar para Análise]          │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│  Processando...                      │
│  ⏳ Analisando vídeo                  │
│  (Pode levar 1-2 minutos)            │
└──────────────────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│  Resultados da Análise               │
│  ┌────────────────────────────────┐  │
│  │ 📊 KPIs Gerados                │  │
│  │                                │  │
│  │ Velocidade Média: 28.5 km/h    │  │
│  │ Velocidade Máxima: 32.1 km/h   │  │
│  │ Distância Percorrida: 4.2 km   │  │
│  │ Sprints: 12                    │  │
│  │ Aceleração Média: 1.8 m/s²     │  │
│  │ Precisão: 78%                  │  │
│  │ Score Geral: 82/100            │  │
│  │                                │  │
│  │ [Compartilhar] [Voltar]        │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

### Fluxo do Clube

```
┌──────────────────────────────────────┐
│  Feed de Atletas (Clube)             │
│  ┌────────────────────────────────┐  │
│  │ Atleta: João Silva             │  │
│  │ Posição: Meia                  │  │
│  │ Último vídeo: há 2 dias        │  │
│  │ Score: 82/100                  │  │
│  │ [Ver Detalhes]                 │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ Atleta: Maria Santos           │  │
│  │ Posição: Atacante              │  │
│  │ Último vídeo: há 1 dia         │  │
│  │ Score: 88/100                  │  │
│  │ [Ver Detalhes]                 │  │
│  └────────────────────────────────┘  │
│                                      │
│  Tab Bar: Feed | Ranking | Perfil   │
└──────────────────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│  Ranking de Atletas                  │
│  ┌────────────────────────────────┐  │
│  │ Ordenar por:                   │  │
│  │ [Velocidade] [Precisão] [Geral]│  │
│  │                                │  │
│  │ 🥇 Maria Santos - 88/100       │  │
│  │ 🥈 João Silva - 82/100         │  │
│  │ 🥉 Pedro Costa - 79/100        │  │
│  │                                │  │
│  │ [Ver Detalhes]                 │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│  Detalhes do Atleta                  │
│  ┌────────────────────────────────┐  │
│  │ João Silva                     │  │
│  │ Meia | 22 anos | 1.78m         │  │
│  │                                │  │
│  │ Estatísticas Gerais:           │  │
│  │ ├─ Score Geral: 82/100         │  │
│  │ ├─ Velocidade Média: 28.5 km/h │  │
│  │ ├─ Distância Total: 45.2 km    │  │
│  │ └─ Precisão: 78%               │  │
│  │                                │  │
│  │ Últimos Vídeos:                │  │
│  │ ├─ Vídeo 1 (há 2 dias)        │  │
│  │ └─ Vídeo 2 (há 5 dias)        │  │
│  │                                │  │
│  │ [Seguir Atleta] [Voltar]       │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

---

## 6. Lista de Telas

| Tela | Grupo | Descrição | Usuário |
|------|-------|-----------|---------|
| Login | Auth | Tela de login com email/senha | Todos |
| Register | Auth | Cadastro com tipo de usuário | Todos |
| Athlete Home | Athlete | Home com últimos KPIs | Atleta |
| Athlete Profile | Athlete | Perfil do atleta (editar dados) | Atleta |
| Video Upload | Athlete | Upload de vídeo para análise | Atleta |
| Video Results | Athlete | Resultados/KPIs do vídeo | Atleta |
| Club Home | Club | Feed de atletas | Clube |
| Club Ranking | Club | Ranking de atletas por KPI | Clube |
| Athlete Detail | Club | Detalhes do atleta (visto pelo clube) | Clube |
| Club Profile | Club | Perfil do clube (editar dados) | Clube |

---

## 7. Interações e Feedback

### Press Feedback
- **Botões primários**: Scale 0.97 + haptic light
- **Cards/Items**: Opacity 0.7 ao pressionar
- **Ícones**: Opacity 0.6 ao pressionar

### Loading States
- Spinner centralizado com texto "Carregando..."
- Skeleton loaders para listas
- Progress bar para upload de vídeo

### Error States
- Toast notification (topo da tela)
- Ícone de erro + mensagem clara
- Botão de retry

### Success States
- Toast notification com checkmark
- Haptic notification (success)
- Transição para próxima tela

---

## 8. Acessibilidade

- **Contraste**: WCAG AA mínimo (4.5:1 para texto)
- **Tamanho de toque**: 44px mínimo
- **Font scaling**: Suporta até 200% de zoom
- **VoiceOver**: Labels descritivos em todos os elementos interativos
- **Cores**: Não usar apenas cor para comunicar informação

---

## 9. Animações (Subtis)

- **Transições de tela**: Fade in (250ms)
- **Press feedback**: Scale (80ms)
- **Loading spinner**: Rotação contínua (1s)
- **Slide-in cards**: Staggered (100ms entre items)

---

## 10. Guia de Implementação

### Estrutura de Componentes
```
components/
├── auth/
│   ├── LoginForm.tsx
│   └── RegisterForm.tsx
├── athlete/
│   ├── ProfileForm.tsx
│   ├── VideoUploader.tsx
│   ├── KPICard.tsx
│   └── ResultsDisplay.tsx
├── club/
│   ├── AthleteCard.tsx
│   ├── RankingList.tsx
│   └── AthleteDetailCard.tsx
└── shared/
    ├── Button.tsx
    ├── Card.tsx
    ├── Input.tsx
    └── LoadingSpinner.tsx
```

### Padrão de Tela
```tsx
import { ScreenContainer } from "@/components/screen-container";

export default function MyScreen() {
  return (
    <ScreenContainer className="p-4">
      {/* Conteúdo aqui */}
    </ScreenContainer>
  );
}
```

