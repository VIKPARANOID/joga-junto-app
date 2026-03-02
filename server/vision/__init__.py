"""
Vision Computacional - Módulo de análise de movimento com MediaPipe
"""

from .pose_analyzer import PoseAnalyzer
from .video_processor import router, setup_vision_router

__all__ = ["PoseAnalyzer", "router", "setup_vision_router"]
