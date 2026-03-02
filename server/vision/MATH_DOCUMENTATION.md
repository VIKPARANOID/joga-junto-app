# Documentação Matemática - Pose Analyzer

## Visão Geral

O **Pose Analyzer** implementa uma análise matemática precisa de movimento humano usando MediaPipe Pose e calibração de escala. O sistema converte pixels em metros usando a altura real do atleta, permitindo cálculos de velocidade e agilidade com precisão científica.

---

## 1. Calibração de Escala (Pixels → Metros)

### Problema
O MediaPipe trabalha com coordenadas normalizadas (0-1) em pixels. Para calcular velocidade real, precisamos converter pixels em metros.

### Solução
Usar a **altura real do atleta** como referência de calibração.

### Fórmula

$$S = \frac{H_m}{H_p}$$

Onde:
- **S** = Fator de escala (metros por pixel)
- **H_m** = Altura real do atleta em metros
- **H_p** = Altura em pixels (distância entre nariz e calcanhares)

### Implementação

```python
def _calculate_scale_factor(self, frame_landmarks: Dict, athlete_height_cm: float) -> float:
    # Extrair landmarks
    nose = frame_landmarks["nose"]
    left_heel = frame_landmarks["left_heel"]
    right_heel = frame_landmarks["right_heel"]
    
    # Calcular altura em pixels
    heel_x = (left_heel["x"] + right_heel["x"]) / 2
    heel_y = (left_heel["y"] + right_heel["y"]) / 2
    
    height_pixels = sqrt((nose["x"] - heel_x)² + (nose["y"] - heel_y)²)
    
    # Converter para metros
    athlete_height_m = athlete_height_cm / 100
    
    # Fator de escala
    scale_factor = athlete_height_m / height_pixels
    return scale_factor
```

### Exemplo
- Atleta: 1.75m (175 cm)
- Altura em pixels no frame: 350 pixels
- S = 1.75 / 350 = **0.005 metros/pixel**

---

## 2. Rastreamento do Centro de Massa (CoM)

### Conceito
O **Centro de Massa** é o ponto que melhor representa o deslocamento do corpo. Usamos o ponto médio dos quadris (landmarks 23 e 24).

### Fórmula

$$CoM_x = \frac{x_{23} + x_{24}}{2}$$

$$CoM_y = \frac{y_{23} + y_{24}}{2}$$

Onde:
- **x₂₃, y₂₃** = Coordenadas do quadril esquerdo
- **x₂₄, y₂₄** = Coordenadas do quadril direito

### Implementação

```python
def _get_center_of_mass(self, frame_landmarks: Dict) -> Tuple[float, float]:
    left_hip = frame_landmarks["left_hip"]
    right_hip = frame_landmarks["right_hip"]
    
    com_x = (left_hip["x"] + right_hip["x"]) / 2
    com_y = (left_hip["y"] + right_hip["y"]) / 2
    
    return (com_x, com_y)
```

### Exemplo
- Frame t: CoM = (0.45, 0.60)
- Frame t+1: CoM = (0.48, 0.62)

---

## 3. Cálculo de Velocidade Instantânea

### Passo 1: Distância em Pixels

$$\Delta d_{pixels} = \sqrt{(CoM_{x,t} - CoM_{x,t-1})^2 + (CoM_{y,t} - CoM_{y,t-1})^2}$$

### Passo 2: Converter para Metros

$$\Delta d_{metros} = \Delta d_{pixels} \times S$$

### Passo 3: Calcular Velocidade em m/s

$$V_{m/s} = \frac{\Delta d_{metros}}{\Delta t}$$

Onde:
- **Δt** = 1/FPS (tempo entre frames)

### Passo 4: Converter para km/h

$$V_{km/h} = V_{m/s} \times 3.6$$

### Implementação

```python
def _calculate_velocities(self, landmarks_history, fps, scale_factor):
    velocities = []
    delta_t = 1 / fps  # Tempo entre frames
    
    for i in range(1, len(landmarks_history)):
        prev_com = self._get_center_of_mass(landmarks_history[i-1])
        curr_com = self._get_center_of_mass(landmarks_history[i])
        
        # Distância em pixels
        delta_d_pixels = sqrt((curr_com[0] - prev_com[0])² + (curr_com[1] - prev_com[1])²)
        
        # Converter para metros
        delta_d_meters = delta_d_pixels * scale_factor
        
        # Velocidade em m/s
        velocity_ms = delta_d_meters / delta_t
        
        # Converter para km/h
        velocity_kmh = velocity_ms * 3.6
        
        velocities.append(velocity_kmh)
    
    return velocities
```

### Exemplo Numérico

**Dados:**
- Escala: S = 0.005 m/pixel
- FPS: 30
- Frame anterior CoM: (0.45, 0.60)
- Frame atual CoM: (0.48, 0.62)

**Cálculo:**
1. Δd_pixels = √((0.48-0.45)² + (0.62-0.60)²) = √(0.0009 + 0.0004) = 0.036 pixels
2. Δd_metros = 0.036 × 0.005 = 0.00018 m
3. Δt = 1/30 = 0.033 s
4. V_m/s = 0.00018 / 0.033 = 0.0055 m/s
5. V_km/h = 0.0055 × 3.6 = **0.02 km/h**

---

## 4. Velocidade Máxima e Média

### Velocidade Máxima
$$V_{max} = \max(V_1, V_2, ..., V_n)$$

### Velocidade Média
$$V_{avg} = \frac{\sum_{i=1}^{n} V_i}{n}$$

---

## 5. Contagem de Sprints

### Definição
Um **sprint** é um período onde a velocidade excede 80% da velocidade máxima.

### Algoritmo

```python
def _count_sprints(self, velocities):
    max_velocity = max(velocities)
    sprint_threshold = max_velocity * 0.8
    
    sprint_count = 0
    in_sprint = False
    
    for velocity in velocities:
        if velocity > sprint_threshold and not in_sprint:
            sprint_count += 1
            in_sprint = True
        elif velocity <= sprint_threshold:
            in_sprint = False
    
    return sprint_count
```

### Exemplo
- V_max = 30 km/h
- Sprint threshold = 30 × 0.8 = 24 km/h
- Velocidades: [5, 10, 25, 26, 24, 15, 28, 29, 20, ...]
- Sprints detectados: 2 (frames 2-4 e 6-7)

---

## 6. Distância Total Percorrida

### Fórmula

$$D_{total} = \sum_{i=1}^{n} \Delta d_i$$

Onde cada Δd_i é calculado como na seção 3.

---

## 7. Score de Agilidade

### Conceito
Agilidade = capacidade de mudar de direção rapidamente.

### Algoritmo

Calcular o **ângulo entre vetores de movimento** consecutivos:

1. Vetor anterior: **v₁** = (CoM_t - CoM_{t-1})
2. Vetor seguinte: **v₂** = (CoM_{t+1} - CoM_t)
3. Cosseno do ângulo: cos(θ) = (v₁ · v₂) / (|v₁| × |v₂|)
4. Mudança de direção: change = (1 - cos(θ)) / 2

### Implementação

```python
def _calculate_agility(self, landmarks_history):
    direction_changes = []
    
    for i in range(1, len(landmarks_history) - 1):
        prev_com = self._get_center_of_mass(landmarks_history[i-1])
        curr_com = self._get_center_of_mass(landmarks_history[i])
        next_com = self._get_center_of_mass(landmarks_history[i+1])
        
        # Vetores de movimento
        vec1 = (curr_com[0] - prev_com[0], curr_com[1] - prev_com[1])
        vec2 = (next_com[0] - curr_com[0], next_com[1] - curr_com[1])
        
        # Produto escalar
        dot_product = vec1[0]*vec2[0] + vec1[1]*vec2[1]
        
        # Magnitudes
        mag1 = sqrt(vec1[0]² + vec1[1]²)
        mag2 = sqrt(vec2[0]² + vec2[1]²)
        
        if mag1 > 0 and mag2 > 0:
            cos_angle = dot_product / (mag1 * mag2)
            change = (1 - cos_angle) / 2
            direction_changes.append(change)
    
    agility = mean(direction_changes) * 100
    return min(agility, 100)
```

### Interpretação
- **Agility = 0**: Movimento linear (sem mudanças de direção)
- **Agility = 100**: Mudanças de direção frequentes

---

## 8. Score de Intensidade

### Fórmula

$$Intensidade = \frac{V_{avg}}{V_{ref}} \times 50 + \frac{\sigma_V^2}{100} \times 50$$

Onde:
- **V_avg** = Velocidade média
- **V_ref** = 35 km/h (velocidade de referência)
- **σ_V²** = Variância de velocidades

### Interpretação
- Considera tanto a **velocidade média** quanto a **variabilidade**
- Atleta rápido e consistente: alta intensidade
- Atleta lento ou muito variável: baixa intensidade

---

## 9. Precisão de Passes (Pass Accuracy)

### Conceito
Passes precisos requerem **movimento controlado** (baixa variância).

### Fórmula

$$Accuracy = 100 - (\sigma_{movement} \times 1000)$$

Onde:
- **σ_movement** = Variância de movimento entre frames

### Interpretação
- **Accuracy = 100**: Movimento muito controlado
- **Accuracy = 0**: Movimento muito errático

---

## Resumo dos KPIs

| KPI | Fórmula | Unidade | Range |
|-----|---------|---------|-------|
| Velocidade Média | mean(V_i) | km/h | 0-40 |
| Velocidade Máxima | max(V_i) | km/h | 0-50 |
| Sprints | count(V > 0.8×V_max) | unidade | 0-100 |
| Distância | Σ Δd_i | metros | 0-10000 |
| Agilidade | mean(direction_changes) × 100 | 0-100 | 0-100 |
| Intensidade | (V_avg/35)×50 + (σ_V²/100)×50 | 0-100 | 0-100 |
| Precisão | 100 - (σ_movement × 1000) | % | 0-100 |

---

## Validação e Testes

### Teste 1: Atleta Parado
- Esperado: V_avg ≈ 0, V_max ≈ 0, sprints = 0
- Distância ≈ 0, Agilidade ≈ 0

### Teste 2: Corrida Linear
- Esperado: V_avg ≈ 15 km/h, V_max ≈ 20 km/h
- Agilidade ≈ 0 (movimento linear)
- Precisão ≈ 100 (movimento controlado)

### Teste 3: Drible Rápido
- Esperado: V_avg ≈ 8 km/h, V_max ≈ 15 km/h
- Agilidade ≈ 80-100 (muitas mudanças de direção)
- Precisão ≈ 60-80 (movimento menos controlado)

---

## Limitações e Considerações

1. **Iluminação**: Afeta detecção de landmarks
2. **Ângulo da câmera**: Deve estar perpendicular ao movimento
3. **Oclusão**: Partes do corpo podem ficar ocultas
4. **FPS**: Vídeos com baixo FPS têm menos precisão
5. **Escala**: Calibração depende de detecção correta da altura

---

## Referências

- MediaPipe Pose: https://google.github.io/mediapipe/solutions/pose
- OpenCV: https://opencv.org/
- Biomecânica do Movimento: https://en.wikipedia.org/wiki/Biomechanics
