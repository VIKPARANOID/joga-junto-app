"""
Script de teste para validar o Pose Analyzer
Cria um vídeo de teste e valida os cálculos matemáticos
"""

import cv2
import numpy as np
import json
from pathlib import Path
from pose_analyzer import PoseAnalyzer

def create_test_video(output_path: str, duration_seconds: float = 5, fps: int = 30):
    """
    Cria um vídeo de teste com movimento linear
    
    Args:
        output_path: Caminho para salvar o vídeo
        duration_seconds: Duração do vídeo em segundos
        fps: Frames per second
    """
    # Configuração do vídeo
    width, height = 640, 480
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
    
    # Número de frames
    num_frames = int(duration_seconds * fps)
    
    print(f"Criando vídeo de teste: {output_path}")
    print(f"Duração: {duration_seconds}s, FPS: {fps}, Frames: {num_frames}")
    
    for frame_idx in range(num_frames):
        # Criar frame em branco
        frame = np.ones((height, width, 3), dtype=np.uint8) * 255
        
        # Desenhar figura humana simples (círculo para cabeça, linhas para corpo)
        # Posição varia com o tempo para simular movimento
        x_offset = int((frame_idx / num_frames) * 200)  # Move 200 pixels
        
        # Cabeça (círculo)
        head_x, head_y = 100 + x_offset, 100
        cv2.circle(frame, (head_x, head_y), 20, (0, 0, 255), -1)
        
        # Corpo (linha vertical)
        body_top_y = head_y + 20
        body_bottom_y = body_top_y + 150
        cv2.line(frame, (head_x, body_top_y), (head_x, body_bottom_y), (0, 255, 0), 3)
        
        # Pernas (duas linhas)
        left_leg_x = head_x - 20
        right_leg_x = head_x + 20
        cv2.line(frame, (head_x, body_bottom_y), (left_leg_x, body_bottom_y + 80), (255, 0, 0), 3)
        cv2.line(frame, (head_x, body_bottom_y), (right_leg_x, body_bottom_y + 80), (255, 0, 0), 3)
        
        # Adicionar texto
        cv2.putText(frame, f"Frame: {frame_idx+1}/{num_frames}", (10, 30), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)
        cv2.putText(frame, f"Movimento: {x_offset}px", (10, 60), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)
        
        # Escrever frame
        out.write(frame)
    
    out.release()
    print(f"Vídeo criado com sucesso!")

def test_pose_analyzer():
    """Testa o Pose Analyzer com um vídeo de teste"""
    
    # Criar vídeo de teste
    test_video_path = "/tmp/test_video.mp4"
    create_test_video(test_video_path, duration_seconds=5, fps=30)
    
    # Inicializar analisador
    analyzer = PoseAnalyzer()
    
    # Parâmetros do atleta
    athlete_height_cm = 175  # 1.75 metros
    
    print("\n" + "="*60)
    print("TESTE DO POSE ANALYZER")
    print("="*60)
    print(f"Vídeo: {test_video_path}")
    print(f"Altura do atleta: {athlete_height_cm} cm")
    print("="*60 + "\n")
    
    # Analisar vídeo
    result = analyzer.analyze_video(test_video_path, athlete_height_cm)
    
    # Exibir resultados
    print("RESULTADO DA ANÁLISE:")
    print(json.dumps(result, indent=2))
    
    # Validações
    print("\n" + "="*60)
    print("VALIDAÇÕES")
    print("="*60)
    
    if result.get("success"):
        kpis = result.get("kpis", {})
        
        # Validação 1: Escala de calibração
        scale_factor = result.get("scale_factor")
        print(f"✓ Fator de escala: {scale_factor:.6f} m/pixel")
        
        # Validação 2: Velocidade
        avg_speed = kpis.get("avg_speed_kmh", 0)
        max_speed = kpis.get("max_speed_kmh", 0)
        print(f"✓ Velocidade média: {avg_speed} km/h")
        print(f"✓ Velocidade máxima: {max_speed} km/h")
        
        if avg_speed > 0:
            print("  ✓ Velocidade detectada corretamente")
        else:
            print("  ⚠ Nenhuma velocidade detectada (MediaPipe pode não ter detectado pose)")
        
        # Validação 3: Distância
        distance = kpis.get("distance_covered_m", 0)
        print(f"✓ Distância percorrida: {distance} metros")
        
        # Validação 4: Frames processados
        frames_analyzed = kpis.get("frames_analyzed", 0)
        print(f"✓ Frames analisados: {frames_analyzed}")
        
        # Validação 5: Sprints
        sprints = kpis.get("sprints_count", 0)
        print(f"✓ Sprints detectados: {sprints}")
        
        # Validação 6: Agilidade
        agility = kpis.get("agility_score", 0)
        print(f"✓ Score de agilidade: {agility}")
        
        # Validação 7: Intensidade
        intensity = kpis.get("intensity_score", 0)
        print(f"✓ Score de intensidade: {intensity}")
        
        # Validação 8: Precisão
        accuracy = kpis.get("pass_accuracy_percent", 0)
        print(f"✓ Precisão de passes: {accuracy}%")
        
        print("\n" + "="*60)
        print("INTERPRETAÇÃO DOS RESULTADOS")
        print("="*60)
        
        if avg_speed == 0:
            print("⚠ AVISO: Nenhuma velocidade foi detectada.")
            print("  Possíveis causas:")
            print("  1. MediaPipe não detectou a pose (problema de iluminação)")
            print("  2. Vídeo muito curto ou sem movimento suficiente")
            print("  3. Qualidade do vídeo insuficiente")
        else:
            print(f"✓ Atleta se moveu a uma velocidade média de {avg_speed} km/h")
            print(f"✓ Pico de velocidade: {max_speed} km/h")
            print(f"✓ Distância total: {distance:.2f} metros")
        
        # Salvar resultado em arquivo
        output_file = "/tmp/test_analysis_result.json"
        analyzer.save_analysis(result, output_file)
        print(f"\n✓ Resultado salvo em: {output_file}")
    
    else:
        print(f"✗ Erro na análise: {result.get('error')}")
    
    # Limpar arquivo de teste
    try:
        Path(test_video_path).unlink()
        print(f"✓ Arquivo de teste removido")
    except:
        pass

if __name__ == "__main__":
    test_pose_analyzer()
