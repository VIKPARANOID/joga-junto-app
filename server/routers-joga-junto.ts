import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db-joga-junto";
import { getDb } from "./db";
import { athletes, clubs, users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * ATHLETE ROUTER
 */
export const athleteRouter = router({
  /**
   * Get athlete profile
   */
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const athlete = await db.getAthleteByUserId(ctx.user.id);
    if (!athlete) {
      return null;
    }
    return athlete;
  }),

  /**
   * Update athlete profile
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        dateOfBirth: z.string().optional(),
        heightCm: z.number().optional(),
        weightKg: z.number().optional(),
        position: z.string().optional(),
        preferredFoot: z.enum(["left", "right", "both"]).optional(),
        clubName: z.string().optional(),
        bio: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await db.updateAthlete(ctx.user.id, input);
      return { success: true };
    }),

  /**
   * Get all videos for athlete
   */
  getVideos: protectedProcedure.query(async ({ ctx }) => {
    const athlete = await db.getAthleteByUserId(ctx.user.id);
    if (!athlete) {
      return [];
    }
    return db.getVideosByAthleteId(athlete.id);
  }),

  /**
   * Get KPIs for a specific video
   */
  getKPIs: protectedProcedure
    .input(z.object({ videoId: z.number() }))
    .query(async ({ input }) => {
      return db.getKPIByVideoId(input.videoId);
    }),

  /**
   * Get aggregated stats for athlete
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const athlete = await db.getAthleteByUserId(ctx.user.id);
    if (!athlete) {
      return null;
    }

    const ranking = await db.getAthleteRanking(athlete.id);
    const videos = await db.getVideosByAthleteId(athlete.id);

    return {
      athlete,
      ranking,
      totalVideos: videos.length,
      recentVideos: videos.slice(0, 5),
    };
  }),
});

/**
 * CLUB ROUTER
 */
export const clubRouter = router({
  /**
   * Get club profile
   */
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const club = await db.getClubByUserId(ctx.user.id);
    if (!club) {
      return null;
    }
    return club;
  }),

  /**
   * Update club profile
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        clubName: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        description: z.string().optional(),
        logoUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await db.updateClub(ctx.user.id, input);
      return { success: true };
    }),

  /**
   * Get feed of athletes
   */
  getAthletesFeed: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      return db.getAthletesFeed(input.limit, input.offset);
    }),

  /**
   * Get ranking of athletes
   */
  getRanking: protectedProcedure
    .input(
      z.object({
        sortBy: z.enum(["overall", "speed", "accuracy"]).default("overall"),
        limit: z.number().default(50),
      })
    )
    .query(async ({ input }) => {
      return db.getRankingByScore(input.sortBy, input.limit);
    }),

  /**
   * Get athlete details
   */
  getAthleteDetail: protectedProcedure
    .input(z.object({ athleteId: z.number() }))
    .query(async ({ input, ctx }) => {
      const dbInstance = await getDb();
      if (!dbInstance) return null;

      // Get athlete profile
      const athleteResult = await dbInstance
        .select()
        .from(athletes)
        .where(eq(athletes.id, input.athleteId))
        .limit(1);

      if (athleteResult.length === 0) {
        return null;
      }

      const athlete = athleteResult[0];

      // Get athlete's videos
      const videos = await db.getVideosByAthleteId(athlete.id);

      // Get athlete's ranking
      const ranking = await db.getAthleteRanking(athlete.id);

      // Check if current club is following this athlete
      const club = await db.getClubByUserId(ctx.user.id);
      let isFollowing = false;
      if (club) {
        isFollowing = await db.isFollowing(club.id, athlete.id);
      }

      return {
        athlete,
        videos,
        ranking,
        isFollowing,
      };
    }),

  /**
   * Follow an athlete
   */
  followAthlete: protectedProcedure
    .input(z.object({ athleteId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const club = await db.getClubByUserId(ctx.user.id);
      if (!club) {
        throw new Error("User is not a club");
      }

      await db.followAthlete(club.id, input.athleteId);
      return { success: true };
    }),

  /**
   * Unfollow an athlete
   */
  unfollowAthlete: protectedProcedure
    .input(z.object({ athleteId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const club = await db.getClubByUserId(ctx.user.id);
      if (!club) {
        throw new Error("User is not a club");
      }

      await db.unfollowAthlete(club.id, input.athleteId);
      return { success: true };
    }),
});

/**
 * USER TYPE ROUTER
 */
export const userTypeRouter = router({
  /**
   * Check user type (athlete or club)
   */
  getType: protectedProcedure.query(async ({ ctx }) => {
    const athlete = await db.getAthleteByUserId(ctx.user.id);
    const club = await db.getClubByUserId(ctx.user.id);

    if (athlete) {
      return { type: "athlete", id: athlete.id };
    } else if (club) {
      return { type: "club", id: club.id };
    }

    return { type: null, id: null };
  }),

  /**
   * Create athlete profile
   */
  createAthlete: protectedProcedure
    .input(
      z.object({
        dateOfBirth: z.string().optional(),
        heightCm: z.number().optional(),
        weightKg: z.number().optional(),
        position: z.string().optional(),
        preferredFoot: z.enum(["left", "right", "both"]).optional(),
        clubName: z.string().optional(),
        bio: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingAthlete = await db.getAthleteByUserId(ctx.user.id);
      if (existingAthlete) {
        throw new Error("User already has an athlete profile");
      }

      const athleteId = await db.createAthlete({
        userId: ctx.user.id,
        ...input,
      });

      return { success: true, athleteId };
    }),

  /**
   * Create club profile
   */
  createClub: protectedProcedure
    .input(
      z.object({
        clubName: z.string(),
        city: z.string().optional(),
        state: z.string().optional(),
        description: z.string().optional(),
        logoUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingClub = await db.getClubByUserId(ctx.user.id);
      if (existingClub) {
        throw new Error("User already has a club profile");
      }

      const clubId = await db.createClub({
        userId: ctx.user.id,
        ...input,
      });

      return { success: true, clubId };
    }),
});
