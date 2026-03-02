import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { athletes, videos, kpis } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const publicRouter = router({
  /**
   * Buscar perfil público de um atleta
   * Retorna apenas dados públicos (sem email, telefone privado, etc)
   */
  getAthleteProfile: publicProcedure
    .input(z.object({ athleteId: z.string() }))
    .query(async (opts: any) => {
      const db = await getDb();
      if (!db) return null;

      const athleteId = parseInt(opts.input.athleteId);

      // Buscar dados do atleta
      const athlete = await db
        .select({
          id: athletes.id,
          userId: athletes.userId,
          heightCm: athletes.heightCm,
          position: athletes.position,
          preferredFoot: athletes.preferredFoot,
          clubName: athletes.clubName,
          bio: athletes.bio,
        })
        .from(athletes)
        .where(eq(athletes.id, athleteId))
        .limit(1);

      if (!athlete.length) {
        return null;
      }

      // Buscar vídeos do atleta
      const athleteVideos = await db
        .select({
          id: videos.id,
          uploadDate: videos.uploadDate,
          durationSeconds: videos.durationSeconds,
        })
        .from(videos)
        .where(eq(videos.athleteId, athleteId))
        .limit(10);

      // Buscar KPIs dos vídeos
      const athleteKpis = await db
        .select({
          videoId: kpis.videoId,
          maxSpeedKmh: kpis.maxSpeedKmh,
          avgSpeedKmh: kpis.avgSpeedKmh,
          intensityScore: kpis.intensityScore,
          passAccuracyPercent: kpis.passAccuracyPercent,
          distanceCoveredM: kpis.distanceCoveredM,
          sprintsCount: kpis.sprintsCount,
        })
        .from(kpis)
        .where(eq(kpis.athleteId, athleteId));

      return {
        athlete: athlete[0],
        videos: athleteVideos,
        kpis: athleteKpis,
      };
    }),

  /**
   * Buscar vídeos públicos de um atleta
   */
  getAthleteVideos: publicProcedure
    .input(z.object({ athleteId: z.string() }))
    .query(async (opts: any) => {
      const db = await getDb();
      if (!db) return [];

      const athleteId = parseInt(opts.input.athleteId);

      const athleteVideos = await db
        .select({
          id: videos.id,
          uploadDate: videos.uploadDate,
          durationSeconds: videos.durationSeconds,
          fileUrl: videos.fileUrl,
        })
        .from(videos)
        .where(eq(videos.athleteId, athleteId))
        .limit(20);

      return athleteVideos;
    }),

  /**
   * Buscar KPIs de um atleta
   */
  getAthleteKpis: publicProcedure
    .input(z.object({ athleteId: z.string() }))
    .query(async (opts: any) => {
      const db = await getDb();
      if (!db) return [];

      const athleteId = parseInt(opts.input.athleteId);

      const athleteKpis = await db
        .select({
          videoId: kpis.videoId,
          maxSpeedKmh: kpis.maxSpeedKmh,
          avgSpeedKmh: kpis.avgSpeedKmh,
          intensityScore: kpis.intensityScore,
          passAccuracyPercent: kpis.passAccuracyPercent,
          distanceCoveredM: kpis.distanceCoveredM,
          sprintsCount: kpis.sprintsCount,
          generatedAt: kpis.generatedAt,
        })
        .from(kpis)
        .where(eq(kpis.athleteId, athleteId))
        .limit(50);

      return athleteKpis;
    }),
});
