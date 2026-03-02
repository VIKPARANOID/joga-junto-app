"""
Video Processor - Endpoint para processamento de vídeos
Integra upload, armazenamento e análise com MediaPipe
"""

import os
import json
import asyncio
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
import aiofiles
import logging

from .pose_analyzer import PoseAnalyzer

logger = logging.getLogger(__name__)

# Configurações
UPLOAD_DIR = Path("/tmp/joga_junto_videos")
ALLOWED_EXTENSIONS = {".mp4", ".avi", ".mov", ".mkv"}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB
MAX_VIDEO_DURATION = 30  # segundos

# Criar diretório de upload
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

router = APIRouter(prefix="/api/vision", tags=["vision"])
analyzer = PoseAnalyzer()


@router.post("/analyze-video")
async def analyze_video(file: UploadFile = File(...)):
    """
    Endpoint para upload e análise de vídeo
    
    Args:
        file: Arquivo de vídeo (MP4, AVI, MOV, MKV)
    
    Returns:
        JSON com KPIs calculados
    """
    try:
        # Validar arquivo
        if not file.filename:
            raise HTTPException(status_code=400, detail="Nome de arquivo inválido")
        
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Formato não suportado. Use: {', '.join(ALLOWED_EXTENSIONS)}"
            )
        
        # Validar tamanho
        file_size = 0
        file_content = await file.read()
        file_size = len(file_content)
        
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"Arquivo muito grande. Máximo: {MAX_FILE_SIZE / 1024 / 1024}MB"
            )
        
        if file_size == 0:
            raise HTTPException(status_code=400, detail="Arquivo vazio")
        
        # Salvar arquivo temporário
        temp_filename = f"temp_{int(asyncio.get_event_loop().time())}_{file.filename}"
        temp_path = UPLOAD_DIR / temp_filename
        
        async with aiofiles.open(temp_path, 'wb') as f:
            await f.write(file_content)
        
        logger.info(f"Vídeo salvo: {temp_path}")
        
        # Analisar vídeo
        analysis_result = analyzer.analyze_video(str(temp_path))
        
        # Verificar se análise foi bem-sucedida
        if "error" in analysis_result:
            raise HTTPException(status_code=400, detail=analysis_result["error"])
        
        # Validar duração do vídeo
        if analysis_result.get("video_duration", 0) > MAX_VIDEO_DURATION:
            raise HTTPException(
                status_code=400,
                detail=f"Vídeo muito longo. Máximo: {MAX_VIDEO_DURATION}s"
            )
        
        # Limpar arquivo temporário
        try:
            os.remove(temp_path)
        except Exception as e:
            logger.warning(f"Erro ao remover arquivo temporário: {e}")
        
        # Retornar resultado
        return JSONResponse({
            "success": True,
            "message": "Vídeo analisado com sucesso",
            "data": analysis_result
        })
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao processar vídeo: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao processar vídeo: {str(e)}")


@router.get("/health")
async def health_check():
    """Health check do serviço de visão computacional"""
    return {
        "status": "ok",
        "service": "vision-processor",
        "upload_dir": str(UPLOAD_DIR),
        "supported_formats": list(ALLOWED_EXTENSIONS)
    }


# Função para inicializar o router em um app FastAPI
def setup_vision_router(app):
    """Setup do router de visão computacional em um app FastAPI"""
    app.include_router(router)
    logger.info("Vision router inicializado")
