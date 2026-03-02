import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import * as db from "./db-joga-junto";
import axios from "axios";

/**
 * VIDEO ROUTER - Gerenciamento de uploads e processamento de vídeos
 */
export const videoRouter = router({
  /**
   * Upload de vídeo e processamento com IA
   * Envia para backend Python para análise com MediaPipe
   */
  uploadAndAnalyze: protectedProcedure
    .input(
      z.object({
        videoUrl: z.string().url(),
        fileName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Verificar se é atleta
        const athlete = await db.getAthleteByUserId(ctx.user.id);
        if (!athlete) {
          throw new Error("Usuário não é um atleta");
        }

        // Criar registro de vídeo no banco
        const videoId = await db.createVideo({
          athleteId: athlete.id,
          fileUrl: input.videoUrl,
          uploadDate: new Date(),
          processingStatus: "pending",
        });

        // Chamar backend Python para análise com altura do atleta
        // Em produção, isso seria uma chamada para o serviço Python
        const kpis = await analyzeVideoWithPython(input.videoUrl, athlete.heightCm || 175);

        // Salvar KPIs no banco
        if (kpis) {
          await db.createKPI({
            videoId,
            athleteId: athlete.id,
            avgSpeedKmh: kpis.avg_speed_kmh,
            maxSpeedKmh: kpis.max_speed_kmh,
            sprintsCount: kpis.sprints_count,
            distanceCoveredM: kpis.distance_covered_m,
            intensityScore: kpis.intensity_score,
            passAccuracyPercent: kpis.pass_accuracy_percent,
          });

          // Atualizar status do vídeo
          await db.updateVideoStatus(videoId, "completed");

          // Atualizar ranking do atleta
          await updateAthleteRanking(athlete.id);
        }

        return {
          success: true,
          videoId,
          kpis,
        };
      } catch (error) {
        console.error("Erro ao fazer upload de vídeo:", error);
        throw new Error(`Erro ao processar vídeo: ${error}`);
      }
    }),

  /**
   * Obter status de processamento de um vídeo
   */
  getVideoStatus: protectedProcedure
    .input(z.object({ videoId: z.number() }))
    .query(async ({ input }) => {
      const video = await db.getVideoById(input.videoId);
      if (!video) {
        throw new Error("Vídeo não encontrado");
      }

      const kpi = await db.getKPIByVideoId(input.videoId);

      return {
        video,
        kpi,
      };
    }),

  /**
   * Listar vídeos do atleta
   */
  getAthleteVideos: protectedProcedure.query(async ({ ctx }) => {
    const athlete = await db.getAthleteByUserId(ctx.user.id);
    if (!athlete) {
      return [];
    }

    const videos = await db.getVideosByAthleteId(athlete.id);

    // Enriquecer com KPIs
    const videosWithKpis = await Promise.all(
      videos.map(async (video) => {
        const kpi = await db.getKPIByVideoId(video.id);
        return {
          ...video,
          kpi,
        };
      })
    );

    return videosWithKpis;
  }),

  /**
   * Deletar vídeo
   */
  deleteVideo: protectedProcedure
    .input(z.object({ videoId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const athlete = await db.getAthleteByUserId(ctx.user.id);
      if (!athlete) {
        throw new Error("Usuário não é um atleta");
      }

      const video = await db.getVideoById(input.videoId);
      if (!video || video.athleteId !== athlete.id) {
        throw new Error("Vídeo não encontrado ou acesso negado");
      }

      // await db.deleteVideo(input.videoId);
      // TODO: Implementar deleteVideo no db-joga-junto.ts

      return { success: true };
    }),
});

/**
 * Função auxiliar para chamar backend Python
 * Em produção, seria uma chamada HTTP real para o serviço Python
 */
async function analyzeVideoWithPython(videoUrl: string, athleteHeightCm: number) {
  try {
    // Simular análise com dados realistas
    // Em produção, seria:
    // const response = await axios.post("http://python-service:5000/analyze", { videoUrl });
    // return response.data;

    // Por enquanto, retornar dados simulados
    return {
      avg_speed_kmh: 28.5 + Math.random() * 5,
      max_speed_kmh: 32.1 + Math.random() * 5,
      sprints_count: Math.floor(10 + Math.random() * 8),
      distance_covered_m: 4000 + Math.random() * 1000,
      intensity_score: 75 + Math.random() * 20,
      pass_accuracy_percent: 70 + Math.random() * 25,
      video_duration_seconds: 25 + Math.random() * 5,
      frames_analyzed: 600 + Math.floor(Math.random() * 300),
    };
  } catch (error) {
    console.error("Erro ao chamar serviço Python:", error);
    throw error;
  }
}

/**
 * Atualizar ranking do atleta baseado em KPIs
 */
async function updateAthleteRanking(athleteId: number) {
  try {
    const videos = await db.getVideosByAthleteId(athleteId);

    if (videos.length === 0) {
      return;
    }

    // Calcular média de KPIs
    let totalSpeed = 0;
    let totalAccuracy = 0;
    let totalIntensity = 0;
    let kpiCount = 0;

    for (const video of videos) {
      const kpi = await db.getKPIByVideoId(video.id);
      if (kpi) {
        totalSpeed += kpi.avgSpeedKmh || 0;
        totalAccuracy += kpi.passAccuracyPercent || 0;
        totalIntensity += kpi.intensityScore || 0;
        kpiCount++;
      }
    }

    if (kpiCount === 0) {
      return;
    }

    const avgSpeed = totalSpeed / kpiCount;
    const avgAccuracy = totalAccuracy / kpiCount;
    const avgIntensity = totalIntensity / kpiCount;

    // Calcular scores (0-100)
    const speedScore = Math.min((avgSpeed / 35) * 100, 100);
    const accuracyScore = avgAccuracy;
    const accelerationScore = Math.min((avgIntensity / 100) * 100, 100);
    const overallScore = (speedScore + accuracyScore + accelerationScore) / 3;

    // Atualizar ranking
    await db.updateAthleteRanking(athleteId, {
      speedScore,
      accuracyScore,
      overallScore,
    });
  } catch (error) {
    console.error("Erro ao atualizar ranking:", error);
  }
}
