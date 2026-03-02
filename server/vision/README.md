# Visão Computacional - Joga Junto

Módulo de análise de movimento e pose estimation usando MediaPipe e OpenCV.

## 📋 Funcionalidades

- **Pose Estimation**: Detecta 33 landmarks do corpo humano
- **Análise de Movimento**: Calcula velocidade, distância e aceleração
- **KPIs Automáticos**: Gera métricas de desempenho do atleta
- **Processamento de Vídeo**: Suporta múltiplos formatos (MP4, AVI, MOV, MKV)

## 🎯 KPIs Calculados

| KPI | Descrição | Unidade |
|-----|-----------|---------|
| `avg_speed_kmh` | Velocidade média do atleta | km/h |
| `max_speed_kmh` | Velocidade máxima atingida | km/h |
| `sprints_count` | Número de acelerações rápidas | unidade |
| `distance_covered_m` | Distância total percorrida | metros |
| `intensity_score` | Score de intensidade do movimento | 0-100 |
| `pass_accuracy_percent` | Estimativa de precisão de passes | % |

## 🚀 Instalação

### Dependências Python

```bash
pip install opencv-python mediapipe numpy
```

### Uso Local

```python
from server.vision.pose_analyzer import PoseAnalyzer

analyzer = PoseAnalyzer()
result = analyzer.analyze_video("video.mp4")

print(result["kpis"])
# {
#   "avg_speed_kmh": 28.5,
#   "max_speed_kmh": 32.1,
#   "sprints_count": 12,
#   "distance_covered_m": 4200,
#   "intensity_score": 82,
#   "pass_accuracy_percent": 78,
#   ...
# }
```

## 🔗 Integração com Backend

### Endpoint tRPC

```typescript
// Upload e análise automática
const result = await trpc.video.uploadAndAnalyze.mutate({
  videoUrl: "https://...",
  fileName: "treino.mp4"
});

// Resultado
{
  success: true,
  videoId: 123,
  kpis: {
    avg_speed_kmh: 28.5,
    max_speed_kmh: 32.1,
    ...
  }
}
```

## 📊 Algoritmos

### Cálculo de Velocidade

1. Detectar landmarks do corpo em cada frame
2. Calcular centro do corpo (média de ombros e quadris)
3. Medir distância entre frames consecutivos
4. Converter pixels para km/h usando calibração

### Contagem de Sprints

1. Calcular velocidade instantânea para cada frame
2. Identificar picos de velocidade (>80% da máxima)
3. Agrupar picos consecutivos como um sprint
4. Contar número total de sprints

### Score de Intensidade

1. Medir movimento de todos os 33 landmarks
2. Calcular variância de movimento
3. Normalizar para escala 0-100

## 🎬 Formatos Suportados

- MP4 (H.264)
- AVI
- MOV
- MKV

**Limites:**
- Tamanho máximo: 100MB
- Duração máxima: 30 segundos
- Resolução mínima: 480p

## 🔧 Configuração

Editar em `pose_analyzer.py`:

```python
self.pose = self.mp_pose.Pose(
    static_image_mode=False,
    model_complexity=1,  # 0=lite, 1=full, 2=heavy
    smooth_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)
```

## 📈 Melhorias Futuras

- [ ] Detecção de tipo de movimento (corrida, drible, passe)
- [ ] Análise de padrão de movimento
- [ ] Comparação com atletas de referência
- [ ] Detecção de lesões potenciais
- [ ] Análise de técnica de chute
- [ ] Rastreamento de bola

## 🐛 Troubleshooting

### Erro: "No pose detected"
- Aumentar `min_detection_confidence` a 0.3
- Melhorar iluminação do vídeo
- Usar vídeo com melhor resolução

### Erro: "Out of memory"
- Reduzir `model_complexity` para 0
- Processar vídeo em chunks
- Aumentar RAM disponível

## 📝 Licença

MIT
