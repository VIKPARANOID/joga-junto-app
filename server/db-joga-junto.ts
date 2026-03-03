import { eq, and } from "drizzle-orm";
import { getDb } from "./db";
import {
  athletes,
  clubs,
  videos,
  kpis,
  athleteRankings,
  clubFollows,
  InsertAthlete,
  InsertClub,
  InsertVideo,
  InsertKPI,
  InsertAthleteRanking,
  InsertClubFollow,
  Athlete,
  Club,
  Video,
  KPI,
  AthleteRanking,
} from "../drizzle/schema";

/**
 * ATHLETE QUERIES
 */

export async function getAthleteByUserId(userId: number): Promise<Athlete | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(athletes).where(eq(athletes.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createAthlete(data: InsertAthlete): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(athletes).values(data);
  const insertId = (result as any).insertId;
  if (!insertId || insertId === 0) {
    throw new Error("Falha ao criar atleta: insertId invalido");
  }
  return insertId;
}

export async function updateAthlete(userId: number, data: Partial<InsertAthlete>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(athletes).set(data).where(eq(athletes.userId, userId));
}

/**
 * CLUB QUERIES
 */

export async function getClubByUserId(userId: number): Promise<Club | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(clubs).where(eq(clubs.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createClub(data: InsertClub): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(clubs).values(data);
  const insertId = (result as any).insertId;
  if (!insertId || insertId === 0) {
    throw new Error("Falha ao criar clube: insertId invalido");
  }
  return insertId;
}

export async function updateClub(userId: number, data: Partial<InsertClub>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(clubs).set(data).where(eq(clubs.userId, userId));
}

/**
 * VIDEO QUERIES
 */

export async function getVideosByAthleteId(athleteId: number): Promise<Video[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(videos).where(eq(videos.athleteId, athleteId));
}

export async function createVideo(data: InsertVideo): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(videos).values(data);
  return (result as any).insertId || 0;
}

export async function updateVideoStatus(
  videoId: number,
  status: "pending" | "processing" | "completed" | "failed",
  error?: string
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: any = { processingStatus: status };
  if (error) {
    updateData.processingError = error;
  }

  await db.update(videos).set(updateData).where(eq(videos.id, videoId));
}

export async function getVideoById(videoId: number): Promise<Video | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(videos).where(eq(videos.id, videoId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * KPI QUERIES
 */

export async function createKPI(data: InsertKPI): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(kpis).values(data);
  return (result as any).insertId || 0;
}

export async function getKPIByVideoId(videoId: number): Promise<KPI | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(kpis).where(eq(kpis.videoId, videoId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getKPIsByAthleteId(athleteId: number): Promise<KPI[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(kpis).where(eq(kpis.athleteId, athleteId));
}

/**
 * ATHLETE RANKING QUERIES
 */

export async function getAthleteRanking(athleteId: number): Promise<AthleteRanking | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(athleteRankings)
    .where(eq(athleteRankings.athleteId, athleteId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateAthleteRanking(
  athleteId: number,
  data: Partial<InsertAthleteRanking>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getAthleteRanking(athleteId);

  if (existing) {
    await db.update(athleteRankings).set(data).where(eq(athleteRankings.athleteId, athleteId));
  } else {
    await db.insert(athleteRankings).values({
      athleteId,
      ...data,
    });
  }
}

/**
 * CLUB FOLLOWS QUERIES
 */

export async function followAthlete(clubId: number, athleteId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(clubFollows).values({
    clubId,
    athleteId,
  });
}

export async function unfollowAthlete(clubId: number, athleteId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(clubFollows)
    .where(and(eq(clubFollows.clubId, clubId), eq(clubFollows.athleteId, athleteId)));
}

export async function isFollowing(clubId: number, athleteId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .select()
    .from(clubFollows)
    .where(and(eq(clubFollows.clubId, clubId), eq(clubFollows.athleteId, athleteId)))
    .limit(1);

  return result.length > 0;
}

/**
 * FEED & RANKING QUERIES
 */

export async function getAthletesFeed(limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  // Get athletes with their latest video and ranking
  // This is a simplified version - in production, you'd want a more optimized query
  const result = await db
    .select()
    .from(athletes)
    .limit(limit)
    .offset(offset);

  return result;
}

export async function getRankingByScore(
  sortBy: "overall" | "speed" | "accuracy" = "overall",
  limit: number = 50
) {
  const db = await getDb();
  if (!db) return [];

  // Simplified ranking query - in production use proper ordering
  return db
    .select()
    .from(athleteRankings)
    .limit(limit);
}
