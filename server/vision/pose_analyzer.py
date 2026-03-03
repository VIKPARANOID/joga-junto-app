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
        
        try:
            # CRÍTICO: Validar abertura do vídeo
            if not cap.isOpened():
                return {"error": "Nao foi possivel abrir o video"}

            # Informações do vídeo
            fps = cap.get(cv2.CAP_PROP_FPS)
            frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            
            # CRÍTICO: Validar FPS antes de usar em divisão
            if fps <= 0 or fps > 120:
                return {"error": f"FPS invalido: {fps}. Deve estar entre 1 e 120"}
            
            video_duration = frame_count / fps

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

        finally:
            # CRÍTICO: Sempre fechar recursos para evitar vazamento de memória
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
                landmarks[landmark_names[idx]] = {
                    "x": landmark.x,
                    "y": landmark.y,
                    "z": landmark.z,
                    "visibility": landmark.visibility
                }
        
        return landmarks

    def _calculate_scale_factor(self, landmarks: Dict, athlete_height_cm: float) -> Optional[float]:
        """
        Calcula fator de escala (metros por pixel)
        
        Fórmula: S = H_m / H_p
        onde H_m = altura real do atleta (metros)
              H_p = altura em pixels (distância nariz-calcanhares)
        """
        if "nose" not in landmarks or "left_heel" not in landmarks or "right_heel" not in landmarks:
            return None
        
        nose = landmarks["nose"]
        left_heel = landmarks["left_heel"]
        right_heel = landmarks["right_heel"]
        
        # Calcular altura em pixels (distância euclidiana nariz-calcanhares)
        height_pixels_left = np.sqrt(
            (nose["x"] - left_heel["x"])**2 + 
            (nose["y"] - left_heel["y"])**2
        )
        height_pixels_right = np.sqrt(
            (nose["x"] - right_heel["x"])**2 + 
            (nose["y"] - right_heel["y"])**2
        )
        
        # Usar média dos dois lados
        height_pixels = (height_pixels_left + height_pixels_right) / 2
        
        if height_pixels == 0:
            return None
        
        # Converter altura real para metros
        athlete_height_m = athlete_height_cm / 100.0
        
        # Calcular fator de escala
        scale_factor = athlete_height_m / height_pixels
        
        return scale_factor

    def _calculate_kpis(self, landmarks_history: List[Dict], fps: float, 
                       video_duration: float, scale_factor: float) -> Dict:
        """
        Calcula KPIs de desempenho
        """
        if len(landmarks_history) < 2:
            return {
                "error": "Insuficientes frames processados",
                "frames_processed": len(landmarks_history)
            }
        
        # Rastrear Centro de Massa (CoM)
        com_history = []
        for landmarks in landmarks_history:
            if "left_hip" in landmarks and "right_hip" in landmarks:
                left_hip = landmarks["left_hip"]
                right_hip = landmarks["right_hip"]
                
                com_x = (left_hip["x"] + right_hip["x"]) / 2
                com_y = (left_hip["y"] + right_hip["y"]) / 2
                
                com_history.append({"x": com_x, "y": com_y})
        
        if len(com_history) < 2:
            return {"error": "Nao foi possivel rastrear centro de massa"}
        
        # Calcular velocidades instantâneas
        velocities = []
        for i in range(1, len(com_history)):
            delta_x = com_history[i]["x"] - com_history[i-1]["x"]
            delta_y = com_history[i]["y"] - com_history[i-1]["y"]
            
            # Distância euclidiana em pixels
            delta_d_pixels = np.sqrt(delta_x**2 + delta_y**2)
            
            # Converter para metros
            delta_d_meters = delta_d_pixels * scale_factor
            
            # Tempo entre frames
            delta_t = 1.0 / fps
            
            # Velocidade em m/s
            velocity_ms = delta_d_meters / delta_t if delta_t > 0 else 0
            
            # Converter para km/h
            velocity_kmh = velocity_ms * 3.6
            
            velocities.append(velocity_kmh)
        
        # Calcular estatísticas de velocidade
        velocities_array = np.array(velocities)
        velocity_max = float(np.max(velocities_array)) if len(velocities_array) > 0 else 0
        velocity_avg = float(np.mean(velocities_array)) if len(velocities_array) > 0 else 0
        velocity_std = float(np.std(velocities_array)) if len(velocities_array) > 0 else 0
        
        # Calcular agilidade (mudanças de direção)
        direction_changes = 0
        if len(com_history) > 2:
            for i in range(1, len(com_history) - 1):
                v1_x = com_history[i]["x"] - com_history[i-1]["x"]
                v1_y = com_history[i]["y"] - com_history[i-1]["y"]
                
                v2_x = com_history[i+1]["x"] - com_history[i]["x"]
                v2_y = com_history[i+1]["y"] - com_history[i]["y"]
                
                # Calcular ângulo entre vetores
                dot_product = v1_x * v2_x + v1_y * v2_y
                mag1 = np.sqrt(v1_x**2 + v1_y**2)
                mag2 = np.sqrt(v2_x**2 + v2_y**2)
                
                if mag1 > 0 and mag2 > 0:
                    cos_angle = dot_product / (mag1 * mag2)
                    cos_angle = np.clip(cos_angle, -1, 1)
                    angle = np.arccos(cos_angle) * 180 / np.pi
                    
                    # Contar mudanças significativas (> 30 graus)
                    if angle > 30:
                        direction_changes += 1
        
        # Calcular distância total percorrida
        total_distance = sum(velocities_array) * (1.0 / fps) if len(velocities_array) > 0 else 0
        
        # Calcular sprints (períodos com velocidade > 20 km/h)
        sprint_count = sum(1 for v in velocities if v > 20)
        
        # Score de intensidade (0-100)
        intensity_score = min(100, int((velocity_avg / 25) * 100))
        
        # Score de agilidade (0-100)
        agility_score = min(100, int((direction_changes / max(1, len(com_history) / 10)) * 100))
        
        # Score de precisão (baseado em estabilidade)
        precision_score = max(0, 100 - int(velocity_std * 10))
        
        return {
            "velocity_max_kmh": round(velocity_max, 2),
            "velocity_avg_kmh": round(velocity_avg, 2),
            "velocity_std": round(velocity_std, 2),
            "distance_meters": round(total_distance, 2),
            "sprint_count": sprint_count,
            "direction_changes": direction_changes,
            "intensity_score": intensity_score,
            "agility_score": agility_score,
            "precision_score": precision_score,
            "overall_score": round((intensity_score + agility_score + precision_score) / 3, 1),
            "com_points_tracked": len(com_history),
        }
