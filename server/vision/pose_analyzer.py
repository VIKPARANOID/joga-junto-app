"""
Pose Analyzer - Análise Matemática Precisa de Movimento com MediaPipe
Implementa calibração de escala (pixels → metros) e cálculo de velocidade/agilidade
"""

import cv2
import mediapipe as mp
import numpy as np
from typing import Dict, List, Tuple, Optional
import json
from pathlib import Path

class PoseAnalyzer:
    """
    Analisador de pose e movimento com calibração de escala precisa
    
    Algoritmo:
    1. Calibração: Usar altura real do atleta para converter pixels em metros
    2. Rastreamento: Centro de Massa (CoM) = ponto médio dos quadris
    3. Velocidade: Distância euclidiana entre frames / tempo
    4. Agilidade: Variância de movimento e mudanças de direção
    """

    def __init__(self):
        """Inicializa MediaPipe Pose"""
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=1,
            smooth_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        self.mp_drawing = mp.solutions.drawing_utils
        
        # Índices dos landmarks principais
        self.NOSE = 0
        self.LEFT_HEEL = 29
        self.RIGHT_HEEL = 30
        self.LEFT_HIP = 23
        self.RIGHT_HIP = 24

    def analyze_video(self, video_path: str, athlete_height_cm: float) -> Dict:
        """
        Analisa um vídeo e extrai KPIs com calibração de escala precisa

        Args:
            video_path: Caminho para o arquivo de vídeo
            athlete_height_cm: Altura real do atleta em centímetros

        Returns:
            Dict com KPIs calculados
        """
        cap = cv2.VideoCapture(video_path)
        
        if not cap.isOpened():
            return {"error": "Não foi possível abrir o vídeo"}

        # Informações do vídeo
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        video_duration = frame_count / fps if fps > 0 else 0

        if fps == 0:
            return {"error": "FPS inválido"}

        # Listas para armazenar dados
        landmarks_history = []
        frame_count_processed = 0
        scale_factor = None  # Será calculado no primeiro frame
        
        # Processar frames
        frame_index = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            # Converter para RGB
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Detectar pose
            results = self.pose.process(rgb_frame)
            
            if results.pose_landmarks:
                landmarks = self._extract_landmarks(results.pose_landmarks)
                
                # Calibrar escala no primeiro frame
                if scale_factor is None:
                    scale_factor = self._calculate_scale_factor(
                        landmarks, 
                        athlete_height_cm
                    )
                    if scale_factor is None:
                        # Se falhar na calibração, usar valor padrão
                        scale_factor = 0.0002  # metros por pixel (estimativa)
                
                landmarks_history.append(landmarks)
                frame_count_processed += 1
            
            frame_index += 1

        cap.release()

        # Calcular KPIs com escala calibrada
        kpis = self._calculate_kpis(
            landmarks_history, 
            fps, 
            video_duration,
            scale_factor
        )
        
        return {
            "success": True,
            "video_duration": video_duration,
            "frames_processed": frame_count_processed,
            "fps": fps,
            "scale_factor": scale_factor,
            "athlete_height_cm": athlete_height_cm,
            "kpis": kpis,
            "landmarks_count": len(landmarks_history)
        }

    def _extract_landmarks(self, pose_landmarks) -> Dict:
        """Extrai coordenadas dos landmarks"""
        landmarks = {}
        
        # Mapeamento de nomes dos landmarks principais
        landmark_names = {
            0: "nose",
            11: "left_shoulder",
            12: "right_shoulder",
            13: "left_elbow",
            14: "right_elbow",
            15: "left_wrist",
            16: "right_wrist",
            23: "left_hip",
            24: "right_hip",
            25: "left_knee",
            26: "right_knee",
            27: "left_ankle",
            28: "right_ankle",
            29: "left_heel",
            30: "right_heel",
        }
        
        for idx, landmark in enumerate(pose_landmarks.landmark):
            if idx in landmark_names:
                name = landmark_names[idx]
                landmarks[name] = {
                    "x": landmark.x,
                    "y": landmark.y,
                    "z": landmark.z,
                    "visibility": landmark.visibility
                }
        
        return landmarks

    def _calculate_scale_factor(self, frame_landmarks: Dict, athlete_height_cm: float) -> Optional[float]:
        """
        Calcula o fator de escala (metros por pixel) usando a altura do atleta
        
        Fórmula: S = H_m / H_p
        onde:
        - H_m = altura real do atleta em metros
        - H_p = altura em pixels (distância entre nariz e calcanhares)
        """
        try:
            # Verificar se temos os landmarks necessários
            if "nose" not in frame_landmarks or "left_heel" not in frame_landmarks or "right_heel" not in frame_landmarks:
                return None
            
            nose = frame_landmarks["nose"]
            left_heel = frame_landmarks["left_heel"]
            right_heel = frame_landmarks["right_heel"]
            
            # Calcular altura em pixels (distância euclidiana entre nariz e calcanhares)
            # Usar a média dos dois calcanhares
            heel_x = (left_heel["x"] + right_heel["x"]) / 2
            heel_y = (left_heel["y"] + right_heel["y"]) / 2
            
            height_pixels = np.sqrt(
                (nose["x"] - heel_x)**2 + 
                (nose["y"] - heel_y)**2
            )
            
            if height_pixels == 0:
                return None
            
            # Converter altura real para metros
            athlete_height_m = athlete_height_cm / 100.0
            
            # Calcular fator de escala: metros por pixel
            scale_factor = athlete_height_m / height_pixels
            
            return scale_factor
        
        except Exception as e:
            print(f"Erro ao calcular fator de escala: {e}")
            return None

    def _get_center_of_mass(self, frame_landmarks: Dict) -> Optional[Tuple[float, float]]:
        """
        Calcula o Centro de Massa (CoM) como o ponto médio dos quadris
        
        CoM_x = (x_23 + x_24) / 2
        CoM_y = (y_23 + y_24) / 2
        """
        try:
            if "left_hip" not in frame_landmarks or "right_hip" not in frame_landmarks:
                return None
            
            left_hip = frame_landmarks["left_hip"]
            right_hip = frame_landmarks["right_hip"]
            
            com_x = (left_hip["x"] + right_hip["x"]) / 2
            com_y = (left_hip["y"] + right_hip["y"]) / 2
            
            return (com_x, com_y)
        
        except Exception as e:
            print(f"Erro ao calcular CoM: {e}")
            return None

    def _calculate_kpis(self, landmarks_history: List[Dict], fps: float, duration: float, scale_factor: float) -> Dict:
        """Calcula KPIs de desempenho baseado no histórico de landmarks"""
        
        if not landmarks_history or fps == 0:
            return self._default_kpis()

        # Calcular velocidades
        velocities = self._calculate_velocities(landmarks_history, fps, scale_factor)
        
        if not velocities:
            return self._default_kpis()
        
        avg_speed = np.mean(velocities)
        max_speed = np.max(velocities)
        
        # Contar sprints (velocidades > 80% da máxima)
        sprints_count = self._count_sprints(velocities)
        
        # Distância percorrida
        distance_covered = self._calculate_distance(landmarks_history, scale_factor)
        
        # Score de agilidade (variância de movimento)
        agility_score = self._calculate_agility(landmarks_history)
        
        # Score de intensidade
        intensity_score = self._calculate_intensity(velocities)
        
        # Precisão de passes (baseado em estabilidade)
        pass_accuracy = self._estimate_pass_accuracy(landmarks_history)
        
        return {
            "avg_speed_kmh": round(avg_speed, 2),
            "max_speed_kmh": round(max_speed, 2),
            "sprints_count": sprints_count,
            "distance_covered_m": round(distance_covered, 2),
            "agility_score": round(agility_score, 0),
            "intensity_score": round(intensity_score, 0),
            "pass_accuracy_percent": round(pass_accuracy, 0),
            "video_duration_seconds": round(duration, 2),
            "frames_analyzed": len(landmarks_history)
        }

    def _calculate_velocities(self, landmarks_history: List[Dict], fps: float, scale_factor: float) -> List[float]:
        """
        Calcula velocidade instantânea para cada frame
        
        Fórmula:
        Δd_pixels = sqrt((CoM_x,t - CoM_x,t-1)² + (CoM_y,t - CoM_y,t-1)²)
        Δd_meters = Δd_pixels × S
        V = Δd_meters / Δt (em m/s)
        V_kmh = V × 3.6
        """
        velocities = []
        delta_t = 1 / fps  # Tempo entre frames em segundos
        
        for i in range(1, len(landmarks_history)):
            prev_frame = landmarks_history[i - 1]
            curr_frame = landmarks_history[i]
            
            prev_com = self._get_center_of_mass(prev_frame)
            curr_com = self._get_center_of_mass(curr_frame)
            
            if prev_com and curr_com:
                # Distância euclidiana em pixels
                delta_d_pixels = np.sqrt(
                    (curr_com[0] - prev_com[0])**2 + 
                    (curr_com[1] - prev_com[1])**2
                )
                
                # Converter para metros
                delta_d_meters = delta_d_pixels * scale_factor
                
                # Velocidade em m/s
                velocity_ms = delta_d_meters / delta_t
                
                # Converter para km/h
                velocity_kmh = velocity_ms * 3.6
                
                velocities.append(velocity_kmh)
        
        return velocities

    def _count_sprints(self, velocities: List[float]) -> int:
        """
        Conta acelerações rápidas (sprints)
        Sprint = velocidade > 80% da máxima
        """
        if not velocities:
            return 0
        
        max_velocity = np.max(velocities)
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

    def _calculate_distance(self, landmarks_history: List[Dict], scale_factor: float) -> float:
        """Calcula distância total percorrida"""
        if len(landmarks_history) < 2:
            return 0

        total_distance = 0
        
        for i in range(1, len(landmarks_history)):
            prev_frame = landmarks_history[i - 1]
            curr_frame = landmarks_history[i]
            
            prev_com = self._get_center_of_mass(prev_frame)
            curr_com = self._get_center_of_mass(curr_frame)
            
            if prev_com and curr_com:
                delta_d_pixels = np.sqrt(
                    (curr_com[0] - prev_com[0])**2 + 
                    (curr_com[1] - prev_com[1])**2
                )
                delta_d_meters = delta_d_pixels * scale_factor
                total_distance += delta_d_meters
        
        return total_distance

    def _calculate_agility(self, landmarks_history: List[Dict]) -> float:
        """
        Calcula score de agilidade baseado em mudanças de direção
        Quanto maior a variância de movimento, maior a agilidade
        """
        if len(landmarks_history) < 3:
            return 0

        direction_changes = []
        
        for i in range(1, len(landmarks_history) - 1):
            prev_com = self._get_center_of_mass(landmarks_history[i - 1])
            curr_com = self._get_center_of_mass(landmarks_history[i])
            next_com = self._get_center_of_mass(landmarks_history[i + 1])
            
            if prev_com and curr_com and next_com:
                # Vetor de movimento anterior
                vec1 = (curr_com[0] - prev_com[0], curr_com[1] - prev_com[1])
                # Vetor de movimento seguinte
                vec2 = (next_com[0] - curr_com[0], next_com[1] - curr_com[1])
                
                # Calcular ângulo entre vetores (cosseno)
                dot_product = vec1[0] * vec2[0] + vec1[1] * vec2[1]
                mag1 = np.sqrt(vec1[0]**2 + vec1[1]**2)
                mag2 = np.sqrt(vec2[0]**2 + vec2[1]**2)
                
                if mag1 > 0 and mag2 > 0:
                    cos_angle = dot_product / (mag1 * mag2)
                    # Normalizar para 0-1 (0 = mudança de direção, 1 = mesma direção)
                    change = (1 - cos_angle) / 2
                    direction_changes.append(change)
        
        if not direction_changes:
            return 0
        
        # Agilidade = média de mudanças de direção * 100
        agility = np.mean(direction_changes) * 100
        return min(agility, 100)

    def _calculate_intensity(self, velocities: List[float]) -> float:
        """
        Calcula score de intensidade baseado em velocidades
        Considera média e variância de velocidades
        """
        if not velocities:
            return 0
        
        avg_velocity = np.mean(velocities)
        velocity_variance = np.var(velocities)
        
        # Normalizar: velocidade média + variância
        # Velocidade típica de atleta: 5-35 km/h
        intensity = (avg_velocity / 35 * 50) + (velocity_variance / 100 * 50)
        
        return min(intensity, 100)

    def _estimate_pass_accuracy(self, landmarks_history: List[Dict]) -> float:
        """
        Estima precisão de passes baseado em estabilidade de movimento
        Quanto menor a variância, mais controlado o movimento
        """
        if len(landmarks_history) < 10:
            return 0

        movements = []
        
        for i in range(1, len(landmarks_history)):
            prev_com = self._get_center_of_mass(landmarks_history[i - 1])
            curr_com = self._get_center_of_mass(landmarks_history[i])
            
            if prev_com and curr_com:
                movement = np.sqrt(
                    (curr_com[0] - prev_com[0])**2 + 
                    (curr_com[1] - prev_com[1])**2
                )
                movements.append(movement)
        
        if not movements:
            return 0
        
        # Quanto menor a variância, melhor o controle
        variance = np.var(movements)
        accuracy = 100 - (variance * 1000)  # Escalar a variância
        
        return max(0, min(accuracy, 100))

    def _default_kpis(self) -> Dict:
        """Retorna KPIs padrão quando não há dados suficientes"""
        return {
            "avg_speed_kmh": 0,
            "max_speed_kmh": 0,
            "sprints_count": 0,
            "distance_covered_m": 0,
            "agility_score": 0,
            "intensity_score": 0,
            "pass_accuracy_percent": 0,
            "video_duration_seconds": 0,
            "frames_analyzed": 0
        }

    def save_analysis(self, analysis: Dict, output_path: str) -> bool:
        """Salva análise em JSON"""
        try:
            with open(output_path, 'w') as f:
                json.dump(analysis, f, indent=2)
            return True
        except Exception as e:
            print(f"Erro ao salvar análise: {e}")
            return False


# Teste local
if __name__ == "__main__":
    analyzer = PoseAnalyzer()
    
    # Exemplo de uso
    video_path = "sample_video.mp4"
    athlete_height_cm = 175  # 1.75 metros
    
    if Path(video_path).exists():
        print(f"Analisando vídeo: {video_path}")
        print(f"Altura do atleta: {athlete_height_cm} cm")
        result = analyzer.analyze_video(video_path, athlete_height_cm)
        print(json.dumps(result, indent=2))
        
        # Salvar resultado
        analyzer.save_analysis(result, "analysis_result.json")
    else:
        print(f"Arquivo não encontrado: {video_path}")
