"""
Pose Analyzer - Análise de Movimento com MediaPipe
Extrai skeleton (pose landmarks) de vídeos e calcula KPIs de desempenho
"""

import cv2
import mediapipe as mp
import numpy as np
from typing import Dict, List, Tuple
import json
from pathlib import Path

class PoseAnalyzer:
    """Analisador de pose e movimento para atletas"""

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

    def analyze_video(self, video_path: str) -> Dict:
        """
        Analisa um vídeo e extrai KPIs de desempenho

        Args:
            video_path: Caminho para o arquivo de vídeo

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

        # Listas para armazenar dados
        landmarks_history = []
        frame_count_processed = 0
        
        # Processar frames
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
                landmarks_history.append(landmarks)
                frame_count_processed += 1

        cap.release()

        # Calcular KPIs
        kpis = self._calculate_kpis(landmarks_history, fps, video_duration)
        
        return {
            "success": True,
            "video_duration": video_duration,
            "frames_processed": frame_count_processed,
            "fps": fps,
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

    def _calculate_kpis(self, landmarks_history: List[Dict], fps: float, duration: float) -> Dict:
        """Calcula KPIs de desempenho baseado no histórico de landmarks"""
        
        if not landmarks_history or fps == 0:
            return self._default_kpis()

        # Calcular velocidade média
        avg_speed, max_speed = self._calculate_speed(landmarks_history, fps)
        
        # Contar sprints (acelerações)
        sprints_count = self._count_sprints(landmarks_history, fps)
        
        # Distância percorrida
        distance_covered = self._calculate_distance(landmarks_history)
        
        # Score de intensidade (baseado em movimento)
        intensity_score = self._calculate_intensity(landmarks_history)
        
        # Precisão de passes (simulado - em produção seria mais complexo)
        pass_accuracy = self._estimate_pass_accuracy(landmarks_history)
        
        return {
            "avg_speed_kmh": round(avg_speed, 2),
            "max_speed_kmh": round(max_speed, 2),
            "sprints_count": sprints_count,
            "distance_covered_m": round(distance_covered, 2),
            "intensity_score": round(intensity_score, 0),
            "pass_accuracy_percent": round(pass_accuracy, 0),
            "video_duration_seconds": round(duration, 2),
            "frames_analyzed": len(landmarks_history)
        }

    def _calculate_speed(self, landmarks_history: List[Dict], fps: float) -> Tuple[float, float]:
        """Calcula velocidade média e máxima baseada no movimento do corpo"""
        if len(landmarks_history) < 2:
            return 0, 0

        speeds = []
        
        # Usar centro do corpo (média de ombros e quadris)
        for i in range(1, len(landmarks_history)):
            prev_frame = landmarks_history[i - 1]
            curr_frame = landmarks_history[i]
            
            # Calcular posição do centro do corpo
            prev_center = self._get_body_center(prev_frame)
            curr_center = self._get_body_center(curr_frame)
            
            if prev_center and curr_center:
                # Distância em pixels
                pixel_distance = np.sqrt(
                    (curr_center[0] - prev_center[0])**2 + 
                    (curr_center[1] - prev_center[1])**2
                )
                
                # Converter para km/h (estimativa: 1 pixel ≈ 0.02 cm)
                # Fórmula: distância (cm) / tempo (s) * 3.6 = km/h
                time_between_frames = 1 / fps
                speed_kmh = (pixel_distance * 0.02) / time_between_frames * 3.6
                speeds.append(speed_kmh)
        
        if not speeds:
            return 0, 0
        
        avg_speed = np.mean(speeds)
        max_speed = np.max(speeds)
        
        return avg_speed, max_speed

    def _get_body_center(self, frame_landmarks: Dict) -> Tuple[float, float]:
        """Calcula o centro do corpo"""
        points = []
        
        for key in ["left_shoulder", "right_shoulder", "left_hip", "right_hip"]:
            if key in frame_landmarks:
                landmark = frame_landmarks[key]
                points.append((landmark["x"], landmark["y"]))
        
        if not points:
            return None
        
        center_x = np.mean([p[0] for p in points])
        center_y = np.mean([p[1] for p in points])
        
        return (center_x, center_y)

    def _count_sprints(self, landmarks_history: List[Dict], fps: float) -> int:
        """Conta acelerações rápidas (sprints)"""
        if len(landmarks_history) < 10:
            return 0

        speeds = []
        for i in range(1, len(landmarks_history)):
            prev_frame = landmarks_history[i - 1]
            curr_frame = landmarks_history[i]
            
            prev_center = self._get_body_center(prev_frame)
            curr_center = self._get_body_center(curr_frame)
            
            if prev_center and curr_center:
                pixel_distance = np.sqrt(
                    (curr_center[0] - prev_center[0])**2 + 
                    (curr_center[1] - prev_center[1])**2
                )
                time_between_frames = 1 / fps
                speed_kmh = (pixel_distance * 0.02) / time_between_frames * 3.6
                speeds.append(speed_kmh)
        
        if not speeds:
            return 0
        
        # Considerar sprint quando velocidade > 80% da máxima
        max_speed = np.max(speeds) if speeds else 0
        sprint_threshold = max_speed * 0.8
        
        sprint_count = 0
        in_sprint = False
        
        for speed in speeds:
            if speed > sprint_threshold and not in_sprint:
                sprint_count += 1
                in_sprint = True
            elif speed <= sprint_threshold:
                in_sprint = False
        
        return sprint_count

    def _calculate_distance(self, landmarks_history: List[Dict]) -> float:
        """Calcula distância total percorrida"""
        if len(landmarks_history) < 2:
            return 0

        total_distance = 0
        
        for i in range(1, len(landmarks_history)):
            prev_frame = landmarks_history[i - 1]
            curr_frame = landmarks_history[i]
            
            prev_center = self._get_body_center(prev_frame)
            curr_center = self._get_body_center(curr_frame)
            
            if prev_center and curr_center:
                pixel_distance = np.sqrt(
                    (curr_center[0] - prev_center[0])**2 + 
                    (curr_center[1] - prev_center[1])**2
                )
                # Converter pixels para metros (estimativa)
                distance_m = pixel_distance * 0.02 / 100
                total_distance += distance_m
        
        return total_distance

    def _calculate_intensity(self, landmarks_history: List[Dict]) -> float:
        """Calcula score de intensidade baseado em movimento"""
        if len(landmarks_history) < 2:
            return 0

        movements = []
        
        for i in range(1, len(landmarks_history)):
            prev_frame = landmarks_history[i - 1]
            curr_frame = landmarks_history[i]
            
            # Calcular movimento total do corpo
            total_movement = 0
            count = 0
            
            for key in prev_frame:
                if key in curr_frame:
                    prev_point = prev_frame[key]
                    curr_point = curr_frame[key]
                    
                    movement = np.sqrt(
                        (curr_point["x"] - prev_point["x"])**2 + 
                        (curr_point["y"] - prev_point["y"])**2
                    )
                    total_movement += movement
                    count += 1
            
            if count > 0:
                avg_movement = total_movement / count
                movements.append(avg_movement)
        
        if not movements:
            return 0
        
        # Normalizar para 0-100
        intensity = (np.mean(movements) * 100) * 10
        return min(intensity, 100)

    def _estimate_pass_accuracy(self, landmarks_history: List[Dict]) -> float:
        """Estima precisão de passes baseado em estabilidade de movimento"""
        if len(landmarks_history) < 10:
            return 0

        # Calcular variância de movimento (quanto menor, mais controlado)
        movements = []
        
        for i in range(1, len(landmarks_history)):
            prev_frame = landmarks_history[i - 1]
            curr_frame = landmarks_history[i]
            
            prev_center = self._get_body_center(prev_frame)
            curr_center = self._get_body_center(curr_frame)
            
            if prev_center and curr_center:
                movement = np.sqrt(
                    (curr_center[0] - prev_center[0])**2 + 
                    (curr_center[1] - prev_center[1])**2
                )
                movements.append(movement)
        
        if not movements:
            return 0
        
        # Quanto menor a variância, melhor o controle
        variance = np.var(movements)
        accuracy = 100 - (variance * 10)
        return max(0, min(accuracy, 100))

    def _default_kpis(self) -> Dict:
        """Retorna KPIs padrão quando não há dados suficientes"""
        return {
            "avg_speed_kmh": 0,
            "max_speed_kmh": 0,
            "sprints_count": 0,
            "distance_covered_m": 0,
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
    
    if Path(video_path).exists():
        print(f"Analisando vídeo: {video_path}")
        result = analyzer.analyze_video(video_path)
        print(json.dumps(result, indent=2))
        
        # Salvar resultado
        analyzer.save_analysis(result, "analysis_result.json")
    else:
        print(f"Arquivo não encontrado: {video_path}")
